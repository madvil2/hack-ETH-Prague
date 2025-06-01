import { useState, useEffect, useCallback } from "react";
import type { Channel } from "@erc7824/nitrolite";
import { useNitroliteClient } from "../context/NitroliteClientWrapper";
import { useWebSocketContext } from "../context/WebSocketContext";
import { NITROLITE_CONFIG, STORAGE_KEYS } from "../config/nitrolite";
import type { ChannelInfo, GameSession } from "../types/nitrolite";

export const useNitroliteIntegration = () => {
  const { nitroliteClient, isReady: isNitroliteReady } = useNitroliteClient();
  const { 
    isConnected: isWebSocketConnected, 
    setNitroliteChannel,
    currentNitroliteChannel,
    connect: connectWebSocket 
  } = useWebSocketContext();
  
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  // Load existing channel from storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedChannelInfo = localStorage.getItem(STORAGE_KEYS.CHANNEL_INFO);
      if (savedChannelInfo) {
        try {
          const channelInfo: ChannelInfo = JSON.parse(savedChannelInfo);
          console.log("Found saved channel info:", channelInfo);
          // We'll recover the channel when Nitrolite client is ready
        } catch (e) {
          console.error("Failed to parse saved channel info:", e);
          localStorage.removeItem(STORAGE_KEYS.CHANNEL_INFO);
        }
      }
    }
  }, []);

  // Initialize or recover channel when Nitrolite client is ready
  useEffect(() => {
    const initializeChannel = async () => {
      if (!isNitroliteReady || !nitroliteClient || !isWebSocketConnected) {
        return;
      }

      if (currentChannel) {
        console.log("Channel already initialized");
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        // Try to recover existing channel first
        const savedChannelInfo = localStorage.getItem(STORAGE_KEYS.CHANNEL_INFO);
        let channel: Channel;

        if (savedChannelInfo) {
          try {
            const channelInfo: ChannelInfo = JSON.parse(savedChannelInfo);
            console.log("Attempting to recover channel:", channelInfo.channelId);
            
            // Try to recover the channel
            channel = await nitroliteClient.recoverChannel(channelInfo.channelId);
            console.log("Successfully recovered channel:", channelInfo.channelId);
          } catch (recoverError) {
            console.warn("Failed to recover channel, creating new one:", recoverError);
            // If recovery fails, create a new channel
            channel = await nitroliteClient.createChannel({
              name: NITROLITE_CONFIG.CHANNEL.NAME,
              description: NITROLITE_CONFIG.CHANNEL.DESCRIPTION,
            });
            console.log("Created new channel:", channel.id);
          }
        } else {
          // No saved channel, create a new one
          console.log("No saved channel found, creating new one");
          channel = await nitroliteClient.createChannel({
            name: NITROLITE_CONFIG.CHANNEL.NAME,
            description: NITROLITE_CONFIG.CHANNEL.DESCRIPTION,
          });
          console.log("Created new channel:", channel.id);
        }

        // Save channel info to storage
        const channelInfo: ChannelInfo = {
          channelId: channel.id,
          name: NITROLITE_CONFIG.CHANNEL.NAME,
          description: NITROLITE_CONFIG.CHANNEL.DESCRIPTION,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.CHANNEL_INFO, JSON.stringify(channelInfo));

        // Set the channel in both contexts
        setCurrentChannel(channel);
        setNitroliteChannel(channel);
        
        console.log("Channel initialization completed successfully");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Failed to initialize channel:", err);
        setError(errorMessage);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChannel();
  }, [isNitroliteReady, nitroliteClient, isWebSocketConnected, currentChannel, setNitroliteChannel]);

  // Create a new channel
  const createChannel = useCallback(async (name?: string, description?: string): Promise<Channel | null> => {
    if (!nitroliteClient) {
      setError("Nitrolite client not available");
      return null;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const channel = await nitroliteClient.createChannel({
        name: name || NITROLITE_CONFIG.CHANNEL.NAME,
        description: description || NITROLITE_CONFIG.CHANNEL.DESCRIPTION,
      });

      // Save channel info
      const channelInfo: ChannelInfo = {
        channelId: channel.id,
        name: name || NITROLITE_CONFIG.CHANNEL.NAME,
        description: description || NITROLITE_CONFIG.CHANNEL.DESCRIPTION,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.CHANNEL_INFO, JSON.stringify(channelInfo));

      setCurrentChannel(channel);
      setNitroliteChannel(channel);
      
      console.log("Created new channel:", channel.id);
      return channel;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create channel";
      setError(errorMessage);
      console.error("Error creating channel:", err);
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [nitroliteClient, setNitroliteChannel]);

  // Join an existing channel
  const joinChannel = useCallback(async (channelId: string): Promise<Channel | null> => {
    if (!nitroliteClient) {
      setError("Nitrolite client not available");
      return null;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const channel = await nitroliteClient.joinChannel(channelId);
      
      // Save channel info
      const channelInfo: ChannelInfo = {
        channelId: channel.id,
        name: "Joined Channel",
        description: "Joined existing channel",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.CHANNEL_INFO, JSON.stringify(channelInfo));

      setCurrentChannel(channel);
      setNitroliteChannel(channel);
      
      console.log("Joined channel:", channelId);
      return channel;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to join channel";
      setError(errorMessage);
      console.error("Error joining channel:", err);
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [nitroliteClient, setNitroliteChannel]);

  // Leave current channel
  const leaveChannel = useCallback(async (): Promise<boolean> => {
    if (!currentChannel) {
      return true;
    }

    try {
      // Clear local state
      setCurrentChannel(null);
      setNitroliteChannel(null as any); // Type assertion needed due to context type
      setGameSession(null);
      
      // Clear storage
      localStorage.removeItem(STORAGE_KEYS.CHANNEL_INFO);
      localStorage.removeItem(STORAGE_KEYS.GAME_SESSION);
      
      console.log("Left channel successfully");
      return true;
    } catch (err) {
      console.error("Error leaving channel:", err);
      return false;
    }
  }, [currentChannel, setNitroliteChannel]);

  // Send message to current channel
  const sendMessage = useCallback(async (message: any): Promise<boolean> => {
    if (!currentChannel) {
      setError("No active channel");
      return false;
    }

    try {
      await currentChannel.sendMessage(message);
      console.log("Message sent successfully");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("Error sending message:", err);
      return false;
    }
  }, [currentChannel]);

  // Initialize WebSocket connection if not connected
  const ensureConnection = useCallback(async (): Promise<boolean> => {
    if (!isWebSocketConnected) {
      console.log("WebSocket not connected, attempting to connect...");
      return await connectWebSocket();
    }
    return true;
  }, [isWebSocketConnected, connectWebSocket]);

  return {
    // State
    currentChannel,
    isInitializing,
    error,
    gameSession,
    isReady: !!currentChannel && isNitroliteReady && isWebSocketConnected,
    
    // Actions
    createChannel,
    joinChannel,
    leaveChannel,
    sendMessage,
    ensureConnection,
    
    // Setters
    setGameSession,
    setError,
  };
};