"use client"
import { SessionProvider } from "next-auth/react"
import React, { ReactElement, ReactHTMLElement } from "react"
export default function AuthProvider({
    children,
}: { children: React.ReactNode }) {
    return (
        <SessionProvider >
            {children}
        </SessionProvider>
    )
}