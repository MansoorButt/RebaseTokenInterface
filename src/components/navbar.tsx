"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectKitButton } from "connectkit"
import { Menu, X } from "lucide-react"
import { cn } from "../lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Mint & Redeem", path: "/mint-redeem" },
    { name: "Cross-Chain", path: "/cross-chain" },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-[#FBF7BA]/80 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#F2FD7D] flex items-center justify-center mr-2">
                <span className="text-[#28443f] font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-[#28443f]">Rebase Token</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "text-[#28443f] hover:text-[#28443f] transition-colors relative py-2",
                    pathname === item.path ? "font-medium" : "text-[#28443f]/70 hover:text-[#28443f]",
                  )}
                >
                  {item.name}
                  {pathname === item.path && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F2FD7D]"></span>
                  )}
                </Link>
              ))}
            </div>
            <ConnectKitButton
              customTheme={{
                "--ck-connectbutton-background": "#28443f",
                "--ck-connectbutton-hover-background": "#1a2a27",
                "--ck-connectbutton-color": "white",
                "--ck-connectbutton-border-radius": "12px",
              }}
            />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <ConnectKitButton />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-[#28443f]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#FBF7BA]/95 backdrop-blur-md shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "block px-3 py-2 rounded-xl text-base font-medium transition-all",
                  pathname === item.path
                    ? "bg-[#F2FD7D]/30 text-[#28443f]"
                    : "text-[#28443f]/70 hover:bg-[#F2FD7D]/10 hover:text-[#28443f]",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

