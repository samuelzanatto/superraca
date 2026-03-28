"use client"

import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/stores/auth-store"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { initialize, isAuthenticated } = useAuthStore()

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/admin")
        }
    }, [isAuthenticated, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) {
                throw signInError
            }

            // Sync auth store
            await initialize()

            // Refresh to pick up new cookies, then redirect
            router.refresh()
            router.push("/admin")
        } catch (err: any) {
            console.error("Login failed:", err)
            setError(err.message || "Falha ao entrar na conta")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/40 blur-[100px]" />
            </div>

            <motion.div
                className="relative z-10 w-full max-w-md px-6"
                initial={{ opacity: 0, scale: 0.95, y: 30, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <motion.img
                            src="/logo.png"
                            alt="Logo"
                            className="h-12 w-auto mx-auto mb-6 invert opacity-90"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.9 }}
                            transition={{ delay: 0.4 }}
                        />
                        <h1 className="text-2xl font-bold text-black/80 mb-2">Bem-vindo de volta</h1>
                        <p className="text-sm text-black/50">Acesse sua conta para continuar</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="peer w-full bg-black/5 border border-transparent focus:border-black/10 rounded-xl px-4 pt-6 pb-1 outline-none transition-all placeholder-transparent text-black"
                                    placeholder="Email"
                                    id="email"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 top-4 text-xs text-black/40 transition-all 
                                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-black/40
                                    peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-black/60
                                    peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]"
                                >
                                    Email
                                </label>
                            </div>

                            <div className="group relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="peer w-full bg-black/5 border border-transparent focus:border-black/10 rounded-xl px-4 pt-6 pb-1 outline-none transition-all placeholder-transparent text-black"
                                    placeholder="Senha"
                                    id="password"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-4 top-4 text-xs text-black/40 transition-all 
                                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-black/40
                                    peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-black/60
                                    peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]"
                                >
                                    Senha
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            disabled={isLoading}
                            className="w-full bg-black hover:bg-black/90 text-white h-12 rounded-xl text-base font-medium transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Entrar na Conta"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Back Button - Below Card */}
                <Link href="/" className="flex items-center justify-center mt-6 text-sm text-black/40 hover:text-black transition-colors group">
                    <div className="flex items-center">
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-2" />
                        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out">
                            Voltar para o início
                        </span>
                    </div>
                </Link>
            </motion.div>
        </div>
    )
}
