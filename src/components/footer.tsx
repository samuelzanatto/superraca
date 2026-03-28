"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="bg-white border-t border-black/4">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/">
                    <Image src="/logo.png" alt="Super Raça" width={50} height={50} className="brightness-0" />
                </Link>

                <p className="text-black/40 text-sm">
                    © {new Date().getFullYear()} Super Raça. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    )
}
