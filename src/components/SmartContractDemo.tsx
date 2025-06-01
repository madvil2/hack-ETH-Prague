import React, { useState } from "react";
import { useSmartContract } from "../hooks/useSmartContract";
import { useMetaMask } from "../hooks/useMetaMask";

const SmartContractDemo: React.FC = () => {
  const { isConnected } = useMetaMask();
  const {
    isLoading,
    error,
    lastResult,
    getRandomNumber,
    selectRandomItem,
    canFulfillRequest,
    contractAddress,
  } = useSmartContract();

  const [minValue, setMinValue] = useState<number>(1);
  const [maxValue, setMaxValue] = useState<number>(100);
  const [itemsInput, setItemsInput] = useState<string>(
    "apple,banana,orange,grape"
  );
  const [requestId, setRequestId] = useState<number>(1);

  const handleGetRandomNumber = async () => {
    if (minValue >= maxValue) {
      alert("Min value must be less than max value");
      return;
    }
    await getRandomNumber(minValue, maxValue);
  };

  const handleSelectRandomItem = async () => {
    const items = itemsInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    if (items.length === 0) {
      alert("Please enter at least one item");
      return;
    }
    await selectRandomItem(items);
  };

  const handleCanFulfillRequest = async () => {
    await canFulfillRequest(requestId);
  };

  if (!isConnected) {
    return (
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          margin: "20px",
        }}
      >
        <h3>Smart Contract Demo</h3>
        <p>Please connect your wallet to use smart contract functions.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        margin: "20px",
      }}
    >
      <h3>Smart Contract Demo</h3>
      <p>
        <strong>Contract Address:</strong> {contractAddress}
      </p>

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            borderRadius: "4px",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {lastResult !== null && (
        <div
          style={{
            color: "green",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#e6ffe6",
            borderRadius: "4px",
          }}
        >
          <strong>Last Result:</strong>{" "}
          {typeof lastResult === "boolean" ? lastResult.toString() : lastResult}
        </div>
      )}

      {/* Get Random Number Section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f9f9f9",
          borderRadius: "4px",
        }}
      >
        <h4>Get Random Number</h4>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Min Value:
          </label>
          <input
            type="number"
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value))}
            style={{ padding: "5px", marginRight: "10px", width: "100px" }}
          />
          <label
            style={{ display: "block", marginBottom: "5px", marginTop: "10px" }}
          >
            Max Value:
          </label>
          <input
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
            style={{ padding: "5px", width: "100px" }}
          />
        </div>
        <button
          onClick={handleGetRandomNumber}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Loading..." : "Get Random Number"}
        </button>
      </div>

      {/* Select Random Item Section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f9f9f9",
          borderRadius: "4px",
        }}
      >
        <h4>Select Random Item</h4>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Items (comma-separated):
          </label>
          <input
            type="text"
            value={itemsInput}
            onChange={(e) => setItemsInput(e.target.value)}
            placeholder="apple,banana,orange,grape"
            style={{ padding: "5px", width: "300px" }}
          />
        </div>
        <button
          onClick={handleSelectRandomItem}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: isLoading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Loading..." : "Select Random Item"}
        </button>
      </div>

      {/* Can Fulfill Request Section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f9f9f9",
          borderRadius: "4px",
        }}
      >
        <h4>Check Request Fulfillment</h4>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Request ID:
          </label>
          <input
            type="number"
            value={requestId}
            onChange={(e) => setRequestId(Number(e.target.value))}
            style={{ padding: "5px", width: "100px" }}
          />
        </div>
        <button
          onClick={handleCanFulfillRequest}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: isLoading ? "#ccc" : "#ffc107",
            color: "black",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Loading..." : "Check Request"}
        </button>
      </div>

      <div style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
        <p>
          <strong>Note:</strong> These are view functions that don't require gas
          fees.
        </p>
        <p>
          Make sure you're connected to the correct Ethereum network where the
          contract is deployed.
        </p>
      </div>
    </div>
  );
};

export default SmartContractDemo;
