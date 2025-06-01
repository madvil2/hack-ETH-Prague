import { ethers } from "ethers";

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

class SmartContractService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;

  async initialize(): Promise<boolean> {
    try {
      // Check if MetaMask is available
      if (typeof window !== "undefined" && window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);

        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Create contract instance
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          this.provider
        );

        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to initialize smart contract service:", error);
      return false;
    }
  }

  async getRandomNumber(min: number, max: number): Promise<number | null> {
    try {
      if (!this.contract) {
        const initialized = await this.initialize();
        if (!initialized) {
          return null;
        }
      }

      const result = await this.contract!.getRandomNumber(min, max);
      return Number(result);
    } catch (error) {
      console.error("Error calling getRandomNumber:", error);
      return null;
    }
  }

  async selectRandomItem(items: string[]): Promise<string | null> {
    try {
      if (!this.contract) {
        const initialized = await this.initialize();
        if (!initialized) {
          return null;
        }
      }

      const result = await this.contract!.selectRandomItem(items);
      return result;
    } catch (error) {
      console.error("Error calling selectRandomItem:", error);
      return null;
    }
  }

  async canFulfillRequest(requestId: number): Promise<boolean | null> {
    try {
      if (!this.contract) {
        const initialized = await this.initialize();
        if (!initialized) {
          return null;
        }
      }

      const result = await this.contract!.canFulfillRequest(requestId);
      return result;
    } catch (error) {
      console.error("Error calling canFulfillRequest:", error);
      return null;
    }
  }

  isConnected(): boolean {
    return this.provider !== null && this.contract !== null;
  }
}

// Export singleton instance
export const smartContractService = new SmartContractService();
