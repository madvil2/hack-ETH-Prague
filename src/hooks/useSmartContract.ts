import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "./useMetaMask";

// ABI для смарт-контракта
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "uint64",
        name: "min",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "max",
        type: "uint64",
      },
    ],
    name: "getRandomNumber",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "items",
        type: "string[]",
      },
    ],
    name: "selectRandomItem",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "canFulfillRequest",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Адрес контракта
const CONTRACT_ADDRESS = "0x26E01df98033F10b8Fd44AFe0FD307af09737ffa";

interface SmartContractState {
  isLoading: boolean;
  error: string | null;
  lastResult: any;
}

export function useSmartContract() {
  const { provider, isConnected } = useMetaMask();
  const [state, setState] = useState<SmartContractState>({
    isLoading: false,
    error: null,
    lastResult: null,
  });

  // Функция для получения случайного числа
  const getRandomNumber = useCallback(
    async (min: number, max: number): Promise<number | null> => {
      if (!provider || !isConnected) {
        setState((prev) => ({ ...prev, error: "Wallet not connected" }));
        return null;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Создаем контракт
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        );

        // Вызываем функцию getRandomNumber
        const result = await contract.getRandomNumber(min, max);

        // Конвертируем BigInt в число
        const randomNumber = Number(result);

        setState((prev) => ({
          ...prev,
          isLoading: false,
          lastResult: randomNumber,
        }));

        return randomNumber;
      } catch (error: any) {
        console.error("Error calling getRandomNumber:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "Failed to get random number",
        }));
        return null;
      }
    },
    [provider, isConnected]
  );

  // Функция для выбора случайного элемента из массива
  const selectRandomItem = useCallback(
    async (items: string[]): Promise<string | null> => {
      if (!provider || !isConnected) {
        setState((prev) => ({ ...prev, error: "Wallet not connected" }));
        return null;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Создаем контракт
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        );

        // Вызываем функцию selectRandomItem
        const result = await contract.selectRandomItem(items);

        setState((prev) => ({
          ...prev,
          isLoading: false,
          lastResult: result,
        }));

        return result;
      } catch (error: any) {
        console.error("Error calling selectRandomItem:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "Failed to select random item",
        }));
        return null;
      }
    },
    [provider, isConnected]
  );

  // Функция для проверки возможности выполнения запроса
  const canFulfillRequest = useCallback(
    async (requestId: number): Promise<boolean | null> => {
      if (!provider || !isConnected) {
        setState((prev) => ({ ...prev, error: "Wallet not connected" }));
        return null;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Создаем контракт
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        );

        // Вызываем функцию canFulfillRequest
        const result = await contract.canFulfillRequest(requestId);

        setState((prev) => ({
          ...prev,
          isLoading: false,
          lastResult: result,
        }));

        return result;
      } catch (error: any) {
        console.error("Error calling canFulfillRequest:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "Failed to check request",
        }));
        return null;
      }
    },
    [provider, isConnected]
  );

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    lastResult: state.lastResult,

    // Functions
    getRandomNumber,
    selectRandomItem,
    canFulfillRequest,

    // Contract info
    contractAddress: CONTRACT_ADDRESS,
    isConnected,
  };
}
