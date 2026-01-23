"use client"

import { motion } from "motion/react"
import { Save, Bell, Lock, Palette, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true)
    const [darkMode, setDarkMode] = useState(false)

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-black">Configurações</h1>
                <p className="text-black/60 mt-1">Gerenciar preferências do sistema</p>
            </div>

            {/* Notifications */}
            <motion.div
                className="bg-white rounded-2xl border border-black/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0a1628]/5 flex items-center justify-center shrink-0">
                        <Bell className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-black">Notificações</h3>
                        <p className="text-sm text-black/50 mt-1">Receber notificações sobre atividades importantes</p>
                    </div>
                    <button
                        onClick={() => setNotifications(!notifications)}
                        className={cn(
                            "w-12 h-7 rounded-full transition-colors relative",
                            notifications ? "bg-[#0a1628]" : "bg-black/10"
                        )}
                    >
                        <motion.div
                            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
                            animate={{ left: notifications ? 26 : 4 }}
                            transition={{ duration: 0.2 }}
                        />
                    </button>
                </div>
            </motion.div>

            {/* Appearance */}
            <motion.div
                className="bg-white rounded-2xl border border-black/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0a1628]/5 flex items-center justify-center shrink-0">
                        <Palette className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-black">Modo Escuro</h3>
                        <p className="text-sm text-black/50 mt-1">Alternar entre tema claro e escuro</p>
                    </div>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={cn(
                            "w-12 h-7 rounded-full transition-colors relative",
                            darkMode ? "bg-[#0a1628]" : "bg-black/10"
                        )}
                    >
                        <motion.div
                            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
                            animate={{ left: darkMode ? 26 : 4 }}
                            transition={{ duration: 0.2 }}
                        />
                    </button>
                </div>
            </motion.div>

            {/* Security */}
            <motion.div
                className="bg-white rounded-2xl border border-black/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0a1628]/5 flex items-center justify-center shrink-0">
                        <Lock className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-black">Segurança</h3>
                        <p className="text-sm text-black/50 mt-1">Alterar senha e configurações de segurança</p>
                    </div>
                    <Button variant="outline" className="border-black/10 hover:bg-black/5 text-black/70">
                        Alterar Senha
                    </Button>
                </div>
            </motion.div>

            {/* Language */}
            <motion.div
                className="bg-white rounded-2xl border border-black/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0a1628]/5 flex items-center justify-center shrink-0">
                        <Globe className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-black">Idioma</h3>
                        <p className="text-sm text-black/50 mt-1">Selecionar o idioma do sistema</p>
                    </div>
                    <select className="px-4 py-2 border border-black/10 rounded-lg bg-white text-black focus:outline-none focus:border-[#0a1628]/30">
                        <option value="pt-BR">Português (BR)</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Button className="bg-[#0a1628] hover:bg-[#0a1628]/90 text-white gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Preferências
                </Button>
            </motion.div>
        </div>
    )
}
