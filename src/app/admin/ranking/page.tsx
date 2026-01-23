"use client"

import { motion } from "motion/react"
import { Trophy, Medal, TrendingUp, Crown, Loader2, User } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

type Profile = {
    id: string
    full_name: string
    score: number
    avatar_url: string | null
}

const getRankStyle = (rank: number) => {
    switch (rank) {
        case 1:
            return { bg: "bg-yellow-500", icon: Crown, color: "text-yellow-500" }
        case 2:
            return { bg: "bg-gray-400", icon: Medal, color: "text-gray-400" }
        case 3:
            return { bg: "bg-orange-400", icon: Medal, color: "text-orange-400" }
        default:
            return { bg: "bg-[#0a1628]/10", icon: null, color: "text-black/40" }
    }
}

export default function RankingPage() {
    const [ranking, setRanking] = useState<Profile[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchRanking = async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('id, full_name, score, avatar_url')
                .order('score', { ascending: false })
                .limit(100)

            if (error) throw error
            setRanking(data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRanking()
    }, [])

    const top1 = ranking[0]
    const top2 = ranking[1]
    const top3 = ranking[2]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-black">Ranking</h1>
                <p className="text-black/60 mt-1">Acompanhe o ranking dos usuários em tempo real</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-black/20" /></div>
            ) : ranking.length === 0 ? (
                <div className="text-center py-20 text-black/40">Nenhum usuário pontuado ainda.</div>
            ) : (
                <>
                    {/* Top 3 Podium */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        {/* Second Place */}
                        <motion.div
                            className="bg-white rounded-2xl p-6 border border-black/5 text-center md:order-1 order-2 mt-4 md:mt-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {top2 ? (
                                <>
                                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg">
                                        {top2.full_name?.charAt(0)}
                                    </div>
                                    <Medal className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <h3 className="font-semibold text-black truncate">{top2.full_name}</h3>
                                    <p className="text-2xl font-bold text-gray-400 mt-1">{top2.score?.toLocaleString()}</p>
                                    <p className="text-sm text-black/40">pontos</p>
                                </>
                            ) : <div className="p-4 text-sm text-black/30">Vazio</div>}
                        </motion.div>

                        {/* First Place */}
                        <motion.div
                            className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-center text-white relative md:order-2 order-1 transform md:-translate-y-4 shadow-xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {top1 ? (
                                <>
                                    <Crown className="w-8 h-8 text-white mx-auto mb-2 animate-bounce" />
                                    <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold mb-3 border-4 border-white/30 backdrop-blur-sm">
                                        {top1.full_name?.charAt(0)}
                                    </div>
                                    <h3 className="font-bold text-lg truncate">{top1.full_name}</h3>
                                    <p className="text-4xl font-bold mt-2 text-white">{top1.score?.toLocaleString()}</p>
                                    <p className="text-sm text-white/70">pontos</p>
                                </>
                            ) : <div>Vazio</div>}
                        </motion.div>

                        {/* Third Place */}
                        <motion.div
                            className="bg-white rounded-2xl p-6 border border-black/5 text-center md:order-3 order-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {top3 ? (
                                <>
                                    <div className="w-14 h-14 mx-auto rounded-full bg-orange-400 flex items-center justify-center text-white text-lg font-bold mb-3 shadow-lg">
                                        {top3.full_name?.charAt(0)}
                                    </div>
                                    <Medal className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                                    <h3 className="font-semibold text-black truncate">{top3.full_name}</h3>
                                    <p className="text-xl font-bold text-orange-400 mt-1">{top3.score?.toLocaleString()}</p>
                                    <p className="text-xs text-black/40">pontos</p>
                                </>
                            ) : <div className="p-4 text-sm text-black/30">Vazio</div>}
                        </motion.div>
                    </div>

                    {/* Full Ranking List */}
                    <motion.div
                        className="bg-white rounded-2xl border border-black/5 overflow-hidden mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="p-4 border-b border-black/5">
                            <h2 className="font-semibold text-black">Ranking Completo</h2>
                        </div>
                        <div className="divide-y divide-black/5">
                            {ranking.map((user, index) => {
                                const rank = index + 1
                                const rankStyle = getRankStyle(rank)
                                return (
                                    <motion.div
                                        key={user.id}
                                        className="flex items-center gap-4 p-4 hover:bg-black/[0.02] transition-colors"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                    >
                                        {/* Rank */}
                                        <div className={`w-10 h-10 rounded-full ${rankStyle.bg} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}>
                                            {rank <= 3 && rankStyle.icon ? (
                                                <rankStyle.icon className="w-5 h-5" />
                                            ) : (
                                                <span className="text-black/60">{rank}</span>
                                            )}
                                        </div>

                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-[#0a1628] flex items-center justify-center text-white font-semibold shrink-0">
                                            {user.full_name?.charAt(0) || <User className="w-5 h-5" />}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-black truncate">{user.full_name}</h3>
                                        </div>

                                        {/* Score */}
                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${rankStyle.color}`}>{user.score?.toLocaleString()}</p>
                                            <p className="text-xs text-black/40">pontos</p>
                                        </div>

                                        {/* Trend */}
                                        <TrendingUp className="w-5 h-5 text-green-500 opacity-50" />
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    )
}
