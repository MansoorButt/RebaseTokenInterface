"use client"

import { Card, CardContent } from "../components/ui/card"

interface TokenBalanceProps {
  balance: string
  interestRate: number
  userInterestRate: number
}

export function TokenBalance({ balance, interestRate, userInterestRate }: TokenBalanceProps) {
  return (
    <Card className="modern-card overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-[#28443f] to-[#F2FD7D]"></div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[#28443f]/70">Balance:</span>
            <div className="flex items-center">
              <span className="font-medium text-lg">{Number.parseFloat(balance).toFixed(4)}</span>
              <span className="ml-2 px-2 py-1 bg-[#F2FD7D]/20 rounded-full text-xs font-medium text-[#28443f]">
                RWT
              </span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#28443f]/10 to-transparent"></div>
          <div className="flex justify-between items-center">
            <span className="text-[#28443f]/70">Global Interest Rate:</span>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              <span className="font-medium">{interestRate.toFixed(2)}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#28443f]/70">Your Interest Rate:</span>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#F2FD7D] mr-2"></div>
              <span className="font-medium">{userInterestRate.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

