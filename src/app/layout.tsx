import type React from "react"
import { Inter } from "next/font/google"
import { Providers } from "../components/providers"
import { Navbar } from "../components/navbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Rebase Token App",
  description: "A modern web3 application for Rebase Token",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} animated-bg`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

