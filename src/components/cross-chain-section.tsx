"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia, arbitrumSepolia } from "wagmi/chains";
import { parseEther, formatEther } from "viem";
import { useReadContract, useWaitForTransactionReceipt } from "wagmi";
import {
  ArrowDown,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import Image from "next/image";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ConnectButton } from "../components/connect-button";
import { TokenBalance } from "../components/token-balance";
import { Stepper, Step } from "../components/stepper";
import * as CCIP from "@chainlink/ccip-js";
import { createPublicClient, createWalletClient, http, custom } from "viem";

// Contract ABIs
const rebaseTokenAbi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getInterestRate",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getUserInterestRate",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
];

const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
];

// Contract addresses
const CONTRACTS = {
  sepolia: {
    rebaseToken: "0xa98Dc8D48C96705c8EfB3557fE5acbD4402122cD",
    router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  },
  arbitrumSepolia: {
    rebaseToken: "0x26C67dEaBB66C7ada73659C628c994cfAb82166d",
    router: "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165",
    linkToken: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
  },
};

// Chain selectors
const CHAIN_SELECTORS = {
  sepolia: "16015286601757825753",
  arbitrumSepolia: "3478487238524512106",
};

// Stepper steps - updated to include LINK approval
const STEPS = [
  { id: 1, title: "Prepare Message" },
  { id: 2, title: "Approve Tokens" },
  { id: 3, title: "Bridge Tokens" },
];

// Helper function to format number with K suffix
interface FormatWithK {
  (value: number): string;
}

const formatWithK: FormatWithK = (value) => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toFixed(2);
};

export function CrossChainSection() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [amount, setAmount] = useState("");
  const [sendingAddress, setSendingAddress] = useState<`0x${string}` | null>(
    null
  );
  const [sourceChain, setSourceChain] = useState<"sepolia" | "arbitrumSepolia">(
    "sepolia"
  );
  const [destinationChain, setDestinationChain] = useState<
    "sepolia" | "arbitrumSepolia"
  >("arbitrumSepolia");
  const [txStatus, setTxStatus] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [ccipTxHash, setCcipTxHash] = useState<string | null>(null);
  const [ccipMessageId, setCcipMessageId] = useState<string | null>(null);
  const [ccipFee, setCcipFee] = useState<bigint | null>(null);
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | null>(
    null
  );
  const [transferTxHash, setTransferTxHash] = useState<`0x${string}` | null>(
    null
  );
  const [approvalComplete, setApprovalComplete] = useState(false);

  // CCIP client setup
  const [ccipClient, setCcipClient] = useState<any>(null);
  const [publicClient, setPublicClient] = useState<any>(null);
  const [walletClient, setWalletClient] = useState<any>(null);

  // Set current chain as source and the other as destination on initial load
  useEffect(() => {
    if (isConnected && chainId) {
      if (chainId === arbitrumSepolia.id) {
        setSourceChain("arbitrumSepolia");
        setDestinationChain("sepolia");
      } else {
        setSourceChain("sepolia");
        setDestinationChain("arbitrumSepolia");
      }
    }
  }, [isConnected, chainId]);

  // Set up CCIP client when connected
  useEffect(() => {
    if (isConnected && window.ethereum && address) {
      try {
        // Initialize CCIP-JS Client
        const client = CCIP.createClient();
        setCcipClient(client);

        // Initialize public client for the current chain
        const public_client = createPublicClient({
          chain: sourceChain === "sepolia" ? sepolia : arbitrumSepolia,
          transport: http(),
        });
        setPublicClient(public_client);

        // Initialize wallet client with account
        const wallet_client = createWalletClient({
          account: address as `0x${string}`,
          chain: sourceChain === "sepolia" ? sepolia : arbitrumSepolia,
          transport: custom(window.ethereum),
        });
        setWalletClient(wallet_client);
      } catch (error) {
        console.error("Error initializing CCIP client:", error);
      }
    }
  }, [isConnected, sourceChain, address]);

  // Update clients when source chain changes
  useEffect(() => {
    if (isConnected && window.ethereum && address) {
      try {
        // Update public client for the current chain
        const public_client = createPublicClient({
          chain: sourceChain === "sepolia" ? sepolia : arbitrumSepolia,
          transport: http(),
        });
        setPublicClient(public_client);

        // Update wallet client with account
        const wallet_client = createWalletClient({
          account: address as `0x${string}`,
          chain: sourceChain === "sepolia" ? sepolia : arbitrumSepolia,
          transport: custom(window.ethereum),
        });
        setWalletClient(wallet_client);
      } catch (error) {
        console.error("Error updating CCIP clients:", error);
      }
    }
  }, [sourceChain, isConnected, address]);

  // Wait for approve transaction receipt
  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({
      hash: approveTxHash ?? undefined,
    });

  // Wait for transfer transaction receipt
  const { isLoading: isTransferConfirming, isSuccess: isTransferConfirmed } =
    useWaitForTransactionReceipt({
      hash: transferTxHash ?? undefined,
    });

  useEffect(() => {
    if (isApproveConfirmed && currentStep === 2) {
      setApprovalComplete(true);
      setCurrentStep(3);
      setTxStatus("Approval successful! Ready to bridge tokens.");
    }
  }, [isApproveConfirmed, currentStep]);

  useEffect(() => {
    if (isTransferConfirmed && currentStep === 3) {
      setTxStatus(
        "Transaction submitted! Tokens are being transferred across chains. This process takes approximately 20 minutes to complete."
      );
    }
  }, [isTransferConfirmed, currentStep]);

  // Read token balance
  const { data: balanceData } = useReadContract({
    address: CONTRACTS[sourceChain].rebaseToken as `0x${string}`,
    abi: rebaseTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  // Read LINK token balance
  const { data: linkBalanceData } = useReadContract({
    address: CONTRACTS[sourceChain].linkToken as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  // Read interest rate
  const { data: interestRateData } = useReadContract({
    address: CONTRACTS[sourceChain].rebaseToken as `0x${string}`,
    abi: rebaseTokenAbi,
    functionName: "getInterestRate",
    query: { enabled: isConnected && !!address },
  });

  // Read user interest rate
  const { data: userInterestRateData } = useReadContract({
    address: CONTRACTS[sourceChain].rebaseToken as `0x${string}`,
    abi: rebaseTokenAbi,
    functionName: "getUserInterestRate",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  const balance =
    balanceData && typeof balanceData === "bigint"
      ? formatEther(balanceData)
      : "0";
  const linkBalance =
    linkBalanceData && typeof linkBalanceData === "bigint"
      ? formatEther(linkBalanceData)
      : "0";
  const interestRate = interestRateData ? Number(interestRateData) / 1e10 : 0;
  const userInterestRate = userInterestRateData
    ? Number(userInterestRateData) / 1e10
    : 0;

  // Format balance with K suffix
  const formattedBalance = formatWithK(parseFloat(balance));
  const formattedLinkBalance = formatWithK(parseFloat(linkBalance));

  const switchChains = () => {
    // Switch source and destination chains
    setSourceChain(destinationChain);
    setDestinationChain(sourceChain);

    // Reset transaction state when switching chains
    setTxStatus("");
    setCurrentStep(1);
    setCcipTxHash(null);
    setCcipMessageId(null);
    setCcipFee(null);
    setApproveTxHash(null);
    setTransferTxHash(null);
    setApprovalComplete(false);

    // If connected to wallet, try to switch the network to match the new source chain
    if (isConnected) {
      const targetChainId =
        destinationChain === "sepolia" ? sepolia.id : arbitrumSepolia.id;
      switchChain?.({ chainId: targetChainId });
    }
  };

  // Step 1: Prepare message and get fee
  const prepareMessage = async () => {
    if (!amount || !address || !ccipClient || !publicClient || !sendingAddress)
      return;

    try {
      setTxStatus("Preparing transfer and calculating CCIP fee...");
      const amountWei = parseEther(amount);

      // Get fee using CCIP-JS
      const fee = await ccipClient.getFee({
        client: publicClient,
        routerAddress: CONTRACTS[sourceChain].router,
        tokenAddress: CONTRACTS[sourceChain].rebaseToken,
        amount: amountWei,
        destinationAccount: sendingAddress,
        destinationChainSelector: CHAIN_SELECTORS[destinationChain],
        feeTokenAddress: CONTRACTS[sourceChain].linkToken,
      });

      setCcipFee(fee);
      setTxStatus(
        `CCIP fee calculated: ${formatEther(
          fee
        )} LINK sending to ${sendingAddress}`
      );
      setCurrentStep(2);
    } catch (error) {
      console.error("Error preparing message:", error);
      setTxStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  // Step 2: Approve all tokens required (both rebase tokens and LINK for fees)
  const approveAllTokens = async () => {
    if (!amount || !address || !ccipClient || !walletClient || !ccipFee) return;

    try {
      setTxStatus("Approving rebase tokens and LINK for transfer...");
      const amountWei = parseEther(amount);

      // Add buffer to token amount (10% extra)
      const tokenAmountWithBuffer = (amountWei * BigInt(110)) / BigInt(100);

      // First approve rebase tokens
      const { txHash: rebaseTxHash } = await ccipClient.approveRouter({
        client: walletClient,
        routerAddress: CONTRACTS[sourceChain].router,
        tokenAddress: CONTRACTS[sourceChain].rebaseToken,
        amount: tokenAmountWithBuffer,
        waitForReceipt: true,
      });

      setTxStatus("Rebase tokens approved! Now approving LINK for fees...");

      // Then approve LINK for fees
      const feesWithBuffer = (ccipFee * BigInt(110)) / BigInt(100);

      const { txHash: linkTxHash } = await ccipClient.approveRouter({
        client: walletClient,
        routerAddress: CONTRACTS[sourceChain].router,
        tokenAddress: CONTRACTS[sourceChain].linkToken,
        amount: feesWithBuffer,
        waitForReceipt: true,
      });

      setApproveTxHash(linkTxHash);
      setApprovalComplete(true);
      setCurrentStep(3);
      setTxStatus("All tokens approved successfully! Ready to bridge.");
    } catch (error) {
      console.error("Error approving tokens:", error);
      setTxStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  // Step 3: Bridge tokens using CCIP-JS
  const bridgeTokens = async () => {
    if (
      !amount ||
      !address ||
      !ccipClient ||
      !walletClient ||
      !ccipFee ||
      !sendingAddress
    )
      return;

    try {
      setTxStatus("Initiating cross-chain transfer...");
      const amountWei = parseEther(amount);

      // Transfer via CCIP-JS
      const { txHash, messageId } = await ccipClient.transferTokens({
        client: walletClient,
        routerAddress: CONTRACTS[sourceChain].router,
        tokenAddress: CONTRACTS[sourceChain].rebaseToken,
        amount: amountWei,
        destinationAccount: sendingAddress,
        destinationChainSelector: CHAIN_SELECTORS[destinationChain],
        feeTokenAddress: CONTRACTS[sourceChain].linkToken,
        writeContractParameters: {
          gas: BigInt(1000000),
          gasPrice: BigInt(1000000000),
        },
      });

      setTransferTxHash(txHash as `0x${string}`);
      setCcipTxHash(txHash);
      setCcipMessageId(messageId);
      setTxStatus(
        "Cross-chain transaction submitted! Waiting for confirmation..."
      );
    } catch (error) {
      console.error("Error bridging tokens:", error);
      setTxStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const isWrongNetwork =
    chainId !== (sourceChain === "sepolia" ? sepolia.id : arbitrumSepolia.id);

  if (!isConnected) {
    return (
      <Card className="max-w-xl mx-auto modern-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Connect Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to transfer tokens across chains
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-3">
          <ConnectButton className="w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (isWrongNetwork) {
    return (
      <Card className="max-w-xl mx-auto modern-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Wrong Network</CardTitle>
          <CardDescription>
            Please switch to{" "}
            {sourceChain === "sepolia" ? "Sepolia" : "Arbitrum Sepolia"} network
            to transfer tokens
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-3">
          <Button
            onClick={() =>
              switchChain?.({
                chainId:
                  sourceChain === "sepolia" ? sepolia.id : arbitrumSepolia.id,
              })
            }
            className="w-full gradient-btn text-white rounded-xl"
          >
            Switch to{" "}
            {sourceChain === "sepolia" ? "Sepolia" : "Arbitrum Sepolia"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-4 mb-6">
        <TokenBalance
          balance={formattedBalance}
          interestRate={interestRate}
          userInterestRate={userInterestRate}
        />
        <Card className="flex-1 modern-card p-4">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="font-medium text-lg">LINK Balance</h3>
              <p className="text-2xl mt-2 font-bold">{formattedLinkBalance}</p>
            </div>
            <div className="text-xs mt-4">
              <span className="text-[#28443f]/70">
                Required for cross-chain fees
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 modern-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#F2FD7D] via-[#28443f] to-[#F2FD7D]"></div>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Cross-Chain Transfer</CardTitle>
          <CardDescription>
            Transfer your Rebase tokens between Ethereum Sepolia and Arbitrum
            Sepolia
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Stepper steps={STEPS} currentStep={currentStep} className="mb-6" />

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <div className="flex items-center p-3 border rounded-xl bg-[#FBF7BA]/50 backdrop-blur-sm">
                <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full">
                  {sourceChain === "sepolia" ? (
                    <Image
                      src="/eth-logo.png"
                      alt="Ethereum Logo"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src="/arbitrum-logo.png"
                      alt="Arbitrum Logo"
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="text-white font-bold">
                    {sourceChain === "sepolia" ? "S" : "A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium block">
                    {sourceChain === "sepolia"
                      ? "Ethereum Sepolia"
                      : "Arbitrum Sepolia"}
                  </span>
                  <span className="text-xs text-[#28443f]/60">
                    {CONTRACTS[sourceChain].rebaseToken.substring(0, 6)}...
                    {CONTRACTS[sourceChain].rebaseToken.substring(38)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#F2FD7D]/20 blur-md rounded-full"></div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={switchChains}
                  className="relative rounded-full p-2 h-10 w-10 border-[#28443f]/20 bg-white hover:bg-[#F2FD7D]/20"
                  disabled={currentStep > 1}
                >
                  <ArrowDown className="h-5 w-5 text-[#28443f]" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <div className="flex items-center p-3 border rounded-xl bg-[#FBF7BA]/50 backdrop-blur-sm">
                <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full">
                  {destinationChain === "sepolia" ? (
                    <Image
                      src="/eth-logo.png"
                      alt="Ethereum Logo"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src="/arbitrum-logo.png"
                      alt="Arbitrum Logo"
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="text-white font-bold">
                    {destinationChain === "sepolia" ? "S" : "A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium block">
                    {destinationChain === "sepolia"
                      ? "Ethereum Sepolia"
                      : "Arbitrum Sepolia"}
                  </span>
                  <span className="text-xs text-[#28443f]/60">
                    {CONTRACTS[destinationChain].rebaseToken.substring(0, 6)}...
                    {CONTRACTS[destinationChain].rebaseToken.substring(38)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <div className="flex">
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="rounded-l-xl border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={currentStep > 1}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(balance)}
                  className="rounded-r-xl border-l-0 bg-[#F2FD7D]/20 hover:bg-[#F2FD7D]/30"
                  disabled={currentStep > 1}
                >
                  Max
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Receiver&apos;s Address
              </label>
              <Input
                type="text"
                value={sendingAddress ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSendingAddress(
                    value.startsWith("0x") ? (value as `0x${string}`) : null
                  );
                }}
                placeholder="0x..."
                className="rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={currentStep > 1}
              />
            </div>

            {currentStep === 1 && (
              <Button
                onClick={prepareMessage}
                disabled={
                  isApproveConfirming ||
                  isTransferConfirming ||
                  !amount ||
                  !sendingAddress
                }
                className="w-full gradient-btn text-white rounded-xl py-6"
              >
                {isApproveConfirming || isTransferConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  "Prepare Transaction"
                )}
              </Button>
            )}

            {currentStep === 2 && (
              <Button
                onClick={approveAllTokens}
                disabled={
                  isApproveConfirming || isTransferConfirming || !amount
                }
                className="w-full gradient-btn text-white rounded-xl py-6"
              >
                {isApproveConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  `Approve Tokens & LINK for Fees`
                )}
              </Button>
            )}

            {currentStep === 3 && !ccipTxHash && (
              <Button
                onClick={bridgeTokens}
                disabled={
                  isApproveConfirming || isTransferConfirming || !amount
                }
                className="w-full gradient-btn text-white rounded-xl py-6"
              >
                {isTransferConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bridging...
                  </>
                ) : (
                  `Bridge ${amount} Tokens`
                )}
              </Button>
            )}

            {ccipFee && (
              <div className="bg-[#F2FD7D]/20 p-3 rounded-xl text-sm">
                <div className="flex items-center mb-1">
                  <AlertCircle className="h-4 w-4 mr-2 text-[#28443f]" />
                  <span className="font-medium">CCIP Fee</span>
                </div>
                <p>
                  {formatWithK(parseFloat(formatEther(ccipFee)))} LINK required
                  for cross-chain transfer
                </p>
              </div>
            )}
          </div>
        </CardContent>

        {txStatus && (
          <CardFooter className="flex flex-col items-start border-t border-[#28443f]/10 bg-[#F2FD7D]/10 p-4">
            <div className="flex items-center mb-2 px-3 py-1.5 rounded-full bg-[#F2FD7D]/20">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isApproveConfirming || isTransferConfirming
                    ? "bg-yellow-400"
                    : "bg-green-400"
                }`}
              ></div>
              <p className="text-sm">{txStatus}</p>
            </div>

            {ccipTxHash && (
              <>
                <div className="bg-[#F2FD7D]/30 p-3 rounded-xl text-sm mt-3 w-full">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    <span className="font-medium">
                      Transaction Sent Successfully!
                    </span>
                  </div>
                  <p className="mb-2">
                    Your tokens are being transferred across chains. This
                    process takes approximately <b>20 minutes</b> to complete.
                  </p>

                  <div className="flex justify-between mt-4">
                    <a
                      href={`https://${
                        sourceChain === "sepolia"
                          ? "sepolia.etherscan.io"
                          : "sepolia-explorer.arbitrum.io"
                      }/tx/${ccipTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#28443f] hover:underline flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View on Explorer
                    </a>

                    {ccipMessageId && (
                      <a
                        href={`https://ccip.chain.link/msg/${ccipMessageId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#28443f] hover:underline flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Track on CCIP Explorer
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
