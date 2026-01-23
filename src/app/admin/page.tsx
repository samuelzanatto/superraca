"use client"

import { motion } from "motion/react"
import { LayoutDashboard, ImageIcon, Video, BookOpen, Trophy, Users, TrendingUp, Clock, Camera } from "lucide-react"
import Link from "next/link"

const stats = [
    { label: "Cards na Landing", value: "12", icon: ImageIcon, change: "+2", href: "/admin/landing-cms" },
    { label: "Fotos Galeria", value: "40", icon: Camera, change: "+8", href: "/admin/photos" },
    { label: "Vídeos Kids", value: "48", icon: Video, change: "+5", href: "/admin/kids" },
    { label: "Usuários Ativos", value: "1.2k", icon: Users, change: "+128", href: "/admin/users" },
]

const recentActivity = [
    { action: "Novo vídeo adicionado", module: "Kids", time: "2 min atrás" },
    { action: "Card atualizado", module: "Landing CMS", time: "15 min atrás" },
    { action: "Mensagem da semana definida", module: "Mensagens", time: "1 hora atrás" },
    { action: "Novo usuário registrado", module: "Usuários", time: "2 horas atrás" },
]

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                <p className="text-black/60 mt-1">Bem-vindo ao painel administrativo Super Raça</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Link key={stat.label} href={stat.href}>
                        <motion.div
                            className="bg-white rounded-2xl p-6 border border-black/5 hover:shadow-lg transition-shadow cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2 }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-black/50">{stat.label}</p>
                                    <p className="text-3xl font-bold text-black mt-1">{stat.value}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#0a1628]/5 flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-[#0a1628]" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 font-medium">{stat.change}</span>
                                <span className="text-black/40">este mês</span>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <motion.div
                    className="bg-white rounded-2xl p-6 border border-black/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-lg font-semibold text-black mb-4">Ações Rápidas</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/admin/landing-cms">
                            <motion.div
                                className="flex items-center gap-3 p-4 rounded-xl bg-[#0a1628]/5 hover:bg-[#0a1628]/10 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ImageIcon className="w-5 h-5 text-[#0a1628]" />
                                <span className="font-medium text-sm text-black">Novo Card</span>
                            </motion.div>
                        </Link>
                        <Link href="/admin/kids">
                            <motion.div
                                className="flex items-center gap-3 p-4 rounded-xl bg-[#0a1628]/5 hover:bg-[#0a1628]/10 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Video className="w-5 h-5 text-[#0a1628]" />
                                <span className="font-medium text-sm text-black">Upload Vídeo</span>
                            </motion.div>
                        </Link>
                        <Link href="/admin/messages">
                            <motion.div
                                className="flex items-center gap-3 p-4 rounded-xl bg-[#0a1628]/5 hover:bg-[#0a1628]/10 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <BookOpen className="w-5 h-5 text-[#0a1628]" />
                                <span className="font-medium text-sm text-black">Nova Mensagem</span>
                            </motion.div>
                        </Link>
                        <Link href="/admin/ranking">
                            <motion.div
                                className="flex items-center gap-3 p-4 rounded-xl bg-[#0a1628]/5 hover:bg-[#0a1628]/10 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Trophy className="w-5 h-5 text-[#0a1628]" />
                                <span className="font-medium text-sm text-black">Ver Ranking</span>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    className="bg-white rounded-2xl p-6 border border-black/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-lg font-semibold text-black mb-4">Atividade Recente</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                <div className="w-2 h-2 mt-2 rounded-full bg-[#0a1628]" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-black">{activity.action}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-black/50">{activity.module}</span>
                                        <span className="text-xs text-black/30">•</span>
                                        <span className="text-xs text-black/40 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {activity.time}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
