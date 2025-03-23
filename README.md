# Cross-Chain Rebase Token Platform

## 🚀 Overview
This project is an advanced decentralized application (dApp) that enables seamless cross-chain transfers of rebase tokens while automatically earning interest. It leverages **Chainlink CCIP** for secure cross-chain messaging and is deployed on **Ethereum Sepolia** and **Arbitrum Sepolia** testnets. The dApp allows users to mint, redeem, and transfer rebase tokens across chains efficiently.

## 🌟 Key Features
### 🔗 **Cross-Chain Transfers with Chainlink CCIP**
- Utilizes **Chainlink's Cross-Chain Interoperability Protocol (CCIP)** for secure and reliable token transfers.
- Supports **Ethereum Sepolia** and **Arbitrum Sepolia** for cross-chain functionality.
- Implements a **multi-step transaction flow** with transaction tracking.

### 💰 **Rebase Token Mechanism**
- Users earn interest on their token holdings through a **rebase mechanism**.
- Interest is dynamically calculated using **on-chain interest rate functions**.
- Implements **`getUserInterestRate()`** and **`getInterestRate()`** smart contract functions to fetch dynamic interest rates.

### 🔄 **Mint & Redeem Rebase Tokens**
- Users can **mint** new rebase tokens by depositing ETH.
- Tokens can be **redeemed** back to ETH with interest-based calculations.
- Implements **gas-efficient transaction handling** using **Viem & Wagmi**.

### 🔄 **Cross-Chain Bridging Flow**
1. **Prepare Transaction:** Calculates required **CCIP fees** and sets up the transfer.
2. **Approve Tokens:** Approves **both rebase tokens and LINK** (for CCIP fee payment).
3. **Bridge Tokens:** Initiates **cross-chain transfer** with secure tracking via **CCIP Explorer**.

### 🔧 **Advanced Technical Implementations**
- **CCIP Integration:** Uses **@chainlink/ccip-js** for seamless **cross-chain messaging**.
- **Gas Optimization:** Efficient use of **Viem for contract interactions**.
- **Dynamic UI Updates:** Real-time status updates on transactions.
- **Multiple Wallet Support:** Built with **Wagmi hooks** for flexible authentication.

## 📌 Technologies Used
- **Smart Contracts:** Solidity, Ethereum Sepolia, Arbitrum Sepolia
- **Frontend:** Next.js, React, TypeScript, Wagmi, Viem
- **Cross-Chain Messaging:** Chainlink CCIP
- **Blockchain Interactions:** Viem, Wagmi
- **UI Components:** Tailwind CSS, Lucide Icons

## 📖 Project Structure
```
📦 src
 ┣ 📂 components
 ┃ ┣ 📜 connect-button.tsx    # Wallet connection UI
 ┃ ┣ 📜 token-balance.tsx     # Token balance display
 ┃ ┣ 📜 stepper.tsx           # Multi-step process component
 ┣ 📂 sections
 ┃ ┣ 📜 mint-redeem-section.tsx # Mint & Redeem logic
 ┃ ┣ 📜 cross-chain-section.tsx # Cross-chain transfer logic
 ┃ ┣ 📜 hero-section.tsx        # Landing page UI
 ┣ 📂 utils
 ┃ ┣ 📜 constants.ts            # Contract addresses & ABIs
 ┃ ┣ 📜 helpers.ts              # Utility functions
```

## 📜 Smart Contracts Used
### 🏦 **Vault Contract (Mint & Redeem)**
- `deposit()` – Allows users to deposit ETH and mint rebase tokens.
- `redeem(uint256 amount)` – Redeems rebase tokens back to ETH.
- `getRebaseTokenAddress()` – Returns the rebase token contract address.

### 🔄 **Rebase Token Contract**
- `balanceOf(address account)` – Fetches user token balance.
- `principleBalanceOf(address account)` – Shows principal token balance.
- `getInterestRate()` – Returns global interest rate.
- `getUserInterestRate(address user)` – Fetches interest rate for a specific user.

### 🔁 **Cross-Chain Router Contract**
- `transferTokens()` – Handles secure cross-chain transfers via CCIP.
- `approveRouter()` – Approves token spending for bridging.
- `getFee()` – Calculates CCIP fees in LINK before bridging.

## 🔧 Setup & Installation
### Prerequisites
- **Node.js v16+**
- **Yarn / npm**
- **MetaMask Wallet** (connected to Sepolia & Arbitrum Sepolia)



## 📜 License
This project is open-source under the **MIT License**.

---

This README is designed to be recruiter-friendly while showcasing your **technical expertise** in cross-chain development, smart contracts, and decentralized finance (DeFi). Let me know if you want to add more details!

