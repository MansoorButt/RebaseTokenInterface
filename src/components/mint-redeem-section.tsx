"use client"

import type React from "react"

import { useState } from "react"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { sepolia } from "wagmi/chains"
import { parseEther, formatEther } from "viem"
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Loader2, ArrowUpCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ConnectButton } from "../components/connect-button"
import { TokenBalance } from "../components/token-balance"

// Contract ABIs
const vaultAbi = [
  {
    name: "deposit",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    name: "redeem",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getRebaseTokenAddress",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
]

const rebaseTokenAbi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "principleBalanceOf",
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
]

// Contract addresses
const VAULT_ADDRESS = "0xF8f81233a37a4966337ec2707a5e221dC8b47ED5" // Replace with actual address
const TOKEN_ADDRESS = "0xa98Dc8D48C96705c8EfB3557fE5acbD4402122cD" // Sepolia token address

export function MintRedeemSection() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const [amount, setAmount] = useState("")
  const [activeTab, setActiveTab] = useState("mint")

  const { data: writeData, isPending: isWritePending, writeContract } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: writeData,
  })

  // Read token balance
  const { data: balanceData } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: rebaseTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  })

  // Read interest rate
  const { data: interestRateData } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: rebaseTokenAbi,
    functionName: "getInterestRate",
    query: { enabled: isConnected && !!address },
  })

  // Read user interest rate
  const { data: userInterestRateData } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: rebaseTokenAbi,
    functionName: "getUserInterestRate",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  })

  const balance = balanceData && typeof balanceData === "bigint" ? formatEther(balanceData) : "0"
  const interestRate = interestRateData ? Number(interestRateData) / 1e10 : 0
  const userInterestRate = userInterestRateData ? Number(userInterestRateData) / 1e10 : 0

  const handleMint = async () => {
    if (!amount) return

    try {
      writeContract({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        functionName: "deposit",
        value: parseEther(amount),
      })
    } catch (error) {
      console.error("Error minting tokens:", error)
    }
  }

  const handleRedeem = async () => {
    if (!amount) return

    try {
      const amountToRedeem =
        amount.toLowerCase() === "max"
          ? BigInt(2) ** BigInt(256) - BigInt(1) // MaxUint256
          : parseEther(amount)

      writeContract({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        functionName: "redeem",
        args: [amountToRedeem],
      })
    } catch (error) {
      console.error("Error redeeming tokens:", error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === "mint") {
      handleMint()
    } else {
      handleRedeem()
    }
  }

  const isWrongNetwork = chainId !== sepolia.id

  if (!isConnected) {
    return (
      <Card className="max-w-md mx-auto modern-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Connect Wallet</CardTitle>
          <CardDescription>Connect your wallet to mint or redeem Rebase tokens</CardDescription>
        </CardHeader>
        <CardFooter className="pt-3">
          <ConnectButton className="w-full" />
        </CardFooter>
      </Card>
    )
  }

  if (isWrongNetwork) {
    return (
      <Card className="max-w-md mx-auto modern-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Wrong Network</CardTitle>
          <CardDescription>Please switch to Sepolia network to mint or redeem tokens</CardDescription>
        </CardHeader>
        <CardFooter className="pt-3">
          <Button
            onClick={() => switchChain?.({ chainId: sepolia.id })}
            className="w-full gradient-btn text-white rounded-xl"
          >
            Switch to Sepolia
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <TokenBalance balance={balance} interestRate={interestRate} userInterestRate={userInterestRate} />

      <Card className="mt-6 modern-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#28443f] via-[#F2FD7D] to-[#28443f]"></div>
        <CardHeader className="pb-3">
          <Tabs defaultValue="mint" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-[#F2FD7D]/20 rounded-xl">
              <TabsTrigger
                value="mint"
                className={`rounded-lg py-2.5 ${activeTab === "mint" ? "bg-[#FBF7BA] shadow-sm" : ""}`}
              >
                Mint
              </TabsTrigger>
              <TabsTrigger
                value="redeem"
                className={`rounded-lg py-2.5 ${activeTab === "redeem" ? "bg-[#FBF7BA] shadow-sm" : ""}`}
              >
                Redeem
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {activeTab === "mint" ? "ETH Amount" : "RWT Amount"}
                </label>
                <div className="flex">
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={activeTab === "redeem" ? "Amount or 'max'" : "0.0"}
                    className="rounded-l-xl border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAmount("max")}
                    className="rounded-r-xl border-l-0 bg-[#F2FD7D]/20 hover:bg-[#F2FD7D]/30"
                  >
                    Max
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isWritePending || isConfirming || !amount}
                className={`w-full rounded-xl py-6 ${activeTab === "mint" ? "gradient-btn text-white" : "accent-btn"}`}
              >
                {isWritePending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isConfirming ? "Confirming..." : "Processing..."}
                  </>
                ) : activeTab === "mint" ? (
                  <>
                    Mint Tokens
                    <ArrowUpCircle className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  "Redeem Tokens"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        {writeData && (
          <CardFooter className="border-t border-[#28443f]/10 bg-[#F2FD7D]/10">
            <a
              href={`https://sepolia.etherscan.io/tx/${writeData}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#28443f] hover:underline w-full text-center flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View on Etherscan
            </a>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

