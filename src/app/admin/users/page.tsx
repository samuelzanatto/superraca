"use client"

import { motion } from "motion/react"
import { Plus, Search, MoreVertical, User, Shield, Edit2, Mail, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { Modal } from "@/components/ui/modal"

type Profile = {
    id: string
    full_name: string
    email: string
    role: 'admin' | 'editor' | 'user'
    status: string
    score: number
    created_at: string
}

const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    editor: "bg-blue-100 text-blue-700",
    user: "bg-gray-100 text-gray-700",
}

const roleLabels: Record<string, string> = {
    admin: "Administrador",
    editor: "Editor",
    user: "Usuário",
}

export default function UsersPage() {
    const [users, setUsers] = useState<Profile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<Profile | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const filteredUsers = users.filter(
        (user) =>
            (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (user: Profile) => {
        setEditingUser(user)
        setIsEditModalOpen(true)
    }

    const handleSaveUser = async () => {
        if (!editingUser) return
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    full_name: editingUser.full_name,
                    role: editingUser.role,
                    score: editingUser.score,
                    status: editingUser.status
                })
                .eq('id', editingUser.id)

            if (error) throw error
            await fetchUsers()
            setIsEditModalOpen(false)
        } catch (error) {
            alert('Erro ao atualizar usuário')
        } finally {
            setIsSaving(false)
        }
    }

    const handleInvite = async (email: string) => {
        // Mock invite for now
        alert(`Convite enviado para ${email} (Simulado - Requer configuração de SMTP)`)
        setIsInviteModalOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black">Usuários</h1>
                    <p className="text-black/60 mt-1">Gerencie usuários, funções e pontuações</p>
                </div>
                <Button onClick={() => setIsInviteModalOpen(true)} className="bg-[#0a1628] hover:bg-[#0a1628]/90 text-white gap-2">
                    <Plus className="w-4 h-4" />
                    Convidar Usuário
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Total de Usuários", value: users.length, icon: User },
                    { label: "Administradores", value: users.filter((u) => u.role === "admin").length, icon: Shield },
                    { label: "Editores", value: users.filter((u) => u.role === "editor").length, icon: Edit2 },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className="bg-white rounded-xl p-5 border border-black/5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0a1628]/5 flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-[#0a1628]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-black">{stat.value}</p>
                                <p className="text-sm text-black/50">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                <input
                    type="text"
                    placeholder="Buscar usuários..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#0a1628]/30 transition-colors"
                />
            </div>

            {/* Table */}
            <motion.div
                className="bg-white rounded-2xl border border-black/5 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {isLoading ? (
                    <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-black/20" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-black/5 bg-gray-50/50">
                                    <th className="text-left p-4 font-medium text-black/50 text-sm">Usuário</th>
                                    <th className="text-left p-4 font-medium text-black/50 text-sm">Email</th>
                                    <th className="text-left p-4 font-medium text-black/50 text-sm">Função</th>
                                    <th className="text-left p-4 font-medium text-black/50 text-sm">Pontos</th>
                                    <th className="text-left p-4 font-medium text-black/50 text-sm">Status</th>
                                    <th className="text-left p-4 font-medium text-black/50 text-sm">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-black/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#0a1628] flex items-center justify-center text-white font-semibold transform transition-transform hover:scale-110">
                                                    {(user.full_name || 'U').charAt(0)}
                                                </div>
                                                <span className="font-medium text-black">{user.full_name || 'Sem nome'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-black/60 text-sm">{user.email}</td>
                                        <td className="p-4">
                                            <span className={cn("px-3 py-1 rounded-full text-xs font-medium", roleColors[user.role] || roleColors.user)}>
                                                {roleLabels[user.role] || user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-black/70">
                                            {user.score?.toLocaleString() || 0}
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-medium",
                                                user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                            )}>
                                                {user.status === "active" ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => handleEdit(user)} className="p-2 hover:bg-black/5 rounded-lg text-black/40 hover:text-black">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Usuário"
            >
                {editingUser && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-black/70 mb-1">Nome Completo</label>
                            <input
                                value={editingUser.full_name || ''}
                                onChange={e => setEditingUser({ ...editingUser, full_name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-black/10"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black/70 mb-1">Função</label>
                                <select
                                    value={editingUser.role}
                                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value as any })}
                                    className="w-full px-4 py-2 rounded-lg border border-black/10 bg-white"
                                >
                                    <option value="user">Usuário</option>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black/70 mb-1">Pontuação</label>
                                <input
                                    type="number"
                                    value={editingUser.score || 0}
                                    onChange={e => setEditingUser({ ...editingUser, score: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 rounded-lg border border-black/10"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black/70 mb-1">Status</label>
                            <select
                                value={editingUser.status || 'active'}
                                onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-black/10 bg-white"
                            >
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                                <option value="blocked">Bloqueado</option>
                            </select>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                            <Button onClick={handleSaveUser} disabled={isSaving} className="bg-[#0a1628] text-white">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Invite Modal - Simple Visual */}
            <Modal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                title="Convidar Usuário"
                description="Envie um convite por email para um novo membro."
            >
                <div>
                    <input className="w-full px-4 py-2 rounded-lg border border-black/10 mb-4" placeholder="email@exemplo.com" />
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>Cancelar</Button>
                        <Button onClick={() => handleInvite('user@email')} className="bg-[#0a1628] text-white">Enviar Convite</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
