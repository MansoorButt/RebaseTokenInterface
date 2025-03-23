"use client"

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "../components/ui/button"

export function HeroSection() {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FBF7BA] via-[#f8f9fa] to-[rgba(242,253,125,0.2)]"></div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block mb-3 px-4 py-1 rounded-full bg-[#F2FD7D]/30 text-[#28443f] font-medium text-sm">
            Powered by Chainlink CCIP
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#28443f]">
            The Next Generation{" "}
            <span className="text-[#28443f] relative">
              <span className="relative z-10">Rebase Token</span>
              <span className="absolute bottom-1 left-0 w-full h-4 bg-[#F2FD7D] opacity-50 -z-10"></span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[#28443f]/80">
            Earn interest across multiple chains with our innovative cross-chain rebase token technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/mint-redeem")}
              className="gradient-btn text-white px-8 py-6 text-lg rounded-xl"
            >
              Start Minting
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => router.push("/cross-chain")}
              variant="outline"
              className="accent-btn px-8 py-6 text-lg rounded-xl"
            >
              Cross-Chain Transfer
            </Button>
          </div>
        </div>

        <div className="mt-16 fancy-border modern-card overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-[#F2FD7D]/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#28443f]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#28443f]">Earn Interest</h3>
                <p className="text-[#28443f]/70">
                  Automatically earn interest on your holdings through our rebase mechanism
                </p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-[#F2FD7D]/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#28443f]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#28443f]">Cross-Chain</h3>
                <p className="text-[#28443f]/70">
                  Seamlessly transfer your tokens between Ethereum and Arbitrum networks
                </p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-[#F2FD7D]/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#28443f]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#28443f]">Secure</h3>
                <p className="text-[#28443f]/70">
                  Built on Chainlink CCIP for secure and reliable cross-chain messaging
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

