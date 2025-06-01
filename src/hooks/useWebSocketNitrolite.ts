import { useState, useEffect, useCallback, useRef } from "react";
import type { Channel } from "@erc7824/nitrolite";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useNitroliteClient } from "../context/NitroliteClientWrapper";
import type { GameSession } from "../types/nitrolite";
import { STORAGE_KEYS } from "../config/nitrolite";

export interface UseWebSocketNitroliteReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  
  // Channel state
  currentChannel: Channel | null;
  channelMembers: string[];
  
  // Game state
  gameSession: GameSession | null;
  
  // Actions
  connect: () => Promise<boolean>;
  disconnect: () => void;
  sendMessage: (message: any) => Promise<boolean>;
  joinGame: (gameId: string) => Promise<boolean>;
  leaveGame: () => Promise<boolean>;
  
  // Event handlers
  onMessage: (handler: (message: any) => void) => () => void;
  onGameUpdate: (handler: (update: any) => void) => () => void;
  onPlayerJoin: (handler: (player: string) => void) => () => void;
  onPlayerLeave: (handler: (player: string) => void) => () => void;
}

export const useWebSocketNitrolite = (): UseWebSocketNitroliteReturn => {
  const { 
    isConnected: wsConnected, 
    connect: wsConnect, 
    disconnect: wsDisconnect,
    currentNitroliteChannel,
    sendRequest,
    client: wsClient
  } = useWebSocketContext();
  
  const { nitroliteClient, isReady: isNitroliteReady } = useNitroliteClient();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelMembers, setChannelMembers] = useState<string[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  
  // Event handler refs
  const messageHandlers = useRef<Set<(message: any) => void>>(new Set());
  const gameUpdateHandlers = useRef<Set<(update: any) => void>>(new Set());
  const playerJoinHandlers = useRef<Set<(player: string) => void>>(new Set());
  const playerLeaveHandlers = useRef<Set<(player: string) => void>>(new Set());

  // Load game session from storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem(STORAGE_KEYS.GAME_SESSION);
      if (savedSession) {
        try {
          const session: GameSession = JSON.parse(savedSession);
          setGameSession(session);
          console.log("Loaded game session from storage:", session.gameId);
        } catch (e) {
          console.error("Failed to parse saved game session:", e);
          localStorage.removeItem(STORAGE_KEYS.GAME_SESSION);
        }
      }
    }
  }, []);

  // Set up channel message listeners
  useEffect(() => {
    if (!currentNitroliteChannel) return;

    const handleMessage = (message: any) => {
      console.log("Received channel message:", message);
      
      // Notify message handlers
      messageHandlers.current.forEach(handler => {
        try {
          handler(message);
        } catch (err) {
          console.error("Error in message handler:", err);
        }
      });

      // Handle specific message types
      if (message.type === "game_update") {
        gameUpdateHandlers.current.forEach(handler => {
          try {
            handler(message.data);
          } catch (err) {
            console.error("Error in game update handler:", err);
          }
        });
      } else if (message.type === "player_join") {
        const playerId = message.data?.playerId;
        if (playerId) {
          setChannelMembers(prev => {
            if (!prev.includes(playerId)) {
              return [...prev, playerId];
            }
            return prev;
          });
          
          playerJoinHandlers.current.forEach(handler => {
            try {
              handler(playerId);
            } catch (err) {
              console.error("Error in player join handler:", err);
            }
          });
        }
      } else if (message.type === "player_leave") {
        const playerId = message.data?.playerId;
        if (playerId) {
          setChannelMembers(prev => prev.filter(id => id !== playerId));
          
          playerLeaveHandlers.current.forEach(handler => {
            try {
              handler(playerId);
            } catch (err) {
              console.error("Error in player leave handler:", err);
            }
          });
        }
      }
    };

    // Subscribe to channel messages
    const unsubscribe = currentNitroliteChannel.onMessage(handleMessage);
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentNitroliteChannel]);

  const connect = useCallback(async (): Promise<boolean> => {
    if (wsConnected) {
      return true;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const success = await wsConnect();
      if (!success) {
        throw new Error("Failed to establish WebSocket connection");
      }
      
      console.log("WebSocket connection established");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Connection failed";
      setError(errorMessage);
      console.error("Connection error:", err);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [wsConnected, wsConnect]);

  const disconnect = useCallback(() => {
    wsDisconnect();
    setChannelMembers([]);
    setGameSession(null);
    setError(null);
    
    // Clear storage
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.GAME_SESSION);
    }
    
    console.log("Disconnected from WebSocket");
  }, [wsDisconnect]);

  const sendMessage = useCallback(async (message: any): Promise<boolean> => {
    if (!currentNitroliteChannel) {
      setError("No active channel");
      return false;
    }

    try {
      await currentNitroliteChannel.sendMessage(message);
      console.log("Message sent successfully:", message);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("Error sending message:", err);
      return false;
    }
  }, [currentNitroliteChannel]);

  const joinGame = useCallback(async (gameId: string): Promise<boolean> => {
    if (!currentNitroliteChannel) {
      setError("No active channel");
      return false;
    }

    try {
      const joinMessage = {
        type: "join_game",
        data: { gameId },
        timestamp: new Date().toISOString(),
      };

      await currentNitroliteChannel.sendMessage(joinMessage);
      
      const session: GameSession = {
        gameId,
        channelId: currentNitroliteChannel.id,
        joinedAt: new Date().toISOString(),
        status: "active",
      };
      
      setGameSession(session);
      
      // Save to storage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.GAME_SESSION, JSON.stringify(session));
      }
      
      console.log("Joined game:", gameId);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to join game";
      setError(errorMessage);
      console.error("Error joining game:", err);
      return false;
    }
  }, [currentNitroliteChannel]);

  const leaveGame = useCallback(async (): Promise<boolean> => {
    if (!gameSession || !currentNitroliteChannel) {
      return true;
    }

    try {
      const leaveMessage = {
        type: "leave_game",
        data: { gameId: gameSession.gameId },
        timestamp: new Date().toISOString(),
      };

      await currentNitroliteChannel.sendMessage(leaveMessage);
      
      setGameSession(null);
      
      // Clear storage
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.GAME_SESSION);
      }
      
      console.log("Left game:", gameSession.gameId);
      return true;
    } catch (err) {
      console.error("Error leaving game:", err);
      return false;
    }
  }, [gameSession, currentNitroliteChannel]);

  // Event handler registration functions
  const onMessage = useCallback((handler: (message: any) => void) => {
    messageHandlers.current.add(handler);
    return () => {
      messageHandlers.current.delete(handler);
    };
  }, []);

  const onGameUpdate = useCallback((handler: (update: any) => void) => {
    gameUpdateHandlers.current.add(handler);
    return () => {
      gameUpdateHandlers.current.delete(handler);
    };
  }, []);

  const onPlayerJoin = useCallback((handler: (player: string) => void) => {
    playerJoinHandlers.current.add(handler);
    return () => {
      playerJoinHandlers.current.delete(handler);
    };
  }, []);

  const onPlayerLeave = useCallback((handler: (player: string) => void) => {
    playerLeaveHandlers.current.add(handler);
    return () => {
      playerLeaveHandlers.current.delete(handler);
    };
  }, []);

  return {
    // Connection state
    isConnected: wsConnected,
    isConnecting,
    error,
    
    // Channel state
    currentChannel: currentNitroliteChannel,
    channelMembers,
    
    // Game state
    gameSession,
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    joinGame,
    leaveGame,
    
    // Event handlers
    onMessage,
    onGameUpdate,
    onPlayerJoin,
    onPlayerLeave,
  };
};