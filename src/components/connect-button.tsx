"use client"

import { ConnectKitButton } from "connectkit"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"

interface ConnectButtonProps {
  className?: string
}

export function ConnectButton({ className }: ConnectButtonProps) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, address, ensName }) => {
        return (
          <Button onClick={show} className={cn("gradient-btn text-white rounded-xl", className)}>
            {isConnected ? (
              <div className="flex items-center">
                <div className="w-2 h-2 text-white bg-green-400 rounded-full mr-2"></div>
                {ensName ?? `${address?.slice(0, 6)}...${address?.slice(-4)}`}
              </div>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}

