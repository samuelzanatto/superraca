"use client"

import { motion } from "motion/react"
import { Plus, Star, MoreVertical, BookOpen, Calendar, Edit, Trash2, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Modal } from "@/components/ui/modal"

type Message = {
    id: string
    title: string
    book: string
    is_weekly: boolean
    created_at: string
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [formData, setFormData] = useState<Partial<Message>>({
        is_weekly: false
    })

    const fetchMessages = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('is_weekly', { ascending: false }) // Weekly first
                .order('created_at', { ascending: false })

            if (error) throw error
            setMessages(data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleOpenModal = (msg?: Message) => {
        if (msg) {
            setFormData(msg)
        } else {
            setFormData({ title: '', book: '', is_weekly: false })
        }
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const payload = {
                title: formData.title,
                book: formData.book,
                is_weekly: formData.is_weekly
            }

            if (formData.id) {
                await supabase.from('messages').update(payload).eq('id', formData.id)
            } else {
                await supabase.from('messages').insert([payload])
            }

            await fetchMessages()
            setIsModalOpen(false)
        } catch (error) {
            alert('Erro ao salvar')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir mensagem?')) return
        try {
            await supabase.from('messages').delete().eq('id', id)
            await fetchMessages()
        } catch (e) { alert('Erro ao excluir') }
    }

    // Filter
    const filtered = messages.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.book?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const weeklyMessage = messages.find(m => m.is_weekly)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black">Mensagens</h1>
                    <p className="text-black/60 mt-1">Gerencie as mensagens do aplicativo</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-[#0a1628] hover:bg-[#0a1628]/90 text-white gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Mensagem
                </Button>
            </div>

            {/* Weekly Highlight */}
            {weeklyMessage && (
                <motion.div
                    className="bg-gradient-to-br from-[#0a1628] to-[#1a2f4e] rounded-2xl p-6 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                            <Star className="w-6 h-6 text-yellow-400" fill="currentColor" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-white/60 mb-1">Mensagem da Semana</p>
                            <h2 className="text-xl font-bold">{weeklyMessage.title}</h2>
                            <p className="text-white/70 mt-2 text-sm">{weeklyMessage.book}</p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() => handleOpenModal(weeklyMessage)}
                        >
                            Alterar
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
                <input
                    type="text"
                    placeholder="Buscar mensagens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#0a1628]/30 transition-colors"
                />
            </div>

            {/* List */}
            <motion.div
                className="bg-white rounded-2xl border border-black/5 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="p-4 border-b border-black/5">
                    <h2 className="font-semibold text-black">Todas as Mensagens</h2>
                </div>
                {isLoading ? (
                    <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-black/20" /></div>
                ) : (
                    <div className="divide-y divide-black/5">
                        {filtered.map((msg, index) => (
                            <motion.div
                                key={msg.id}
                                className="flex items-center gap-4 p-4 hover:bg-black/[0.02] transition-colors group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#0a1628]/5 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-6 h-6 text-[#0a1628]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-black truncate">{msg.title}</h3>
                                        {msg.is_weekly && <Star className="w-4 h-4 text-yellow-500 shrink-0" fill="currentColor" />}
                                    </div>
                                    <p className="text-sm text-black/50 truncate mt-1">{msg.book}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-black/40">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(msg.created_at).toLocaleDateString("pt-BR")}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenModal(msg)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(msg.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="p-8 text-center text-black/40">Nenhuma mensagem encontrada.</div>
                        )}
                    </div>
                )}
            </motion.div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={formData.id ? "Editar Mensagem" : "Nova Mensagem"}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-black/70 mb-1">Título</label>
                        <input
                            value={formData.title || ''}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-black/10 focus:outline-none focus:border-black/30"
                            placeholder="Ex: A Fé Perfeita"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black/70 mb-1">Livro / Referência</label>
                        <input
                            value={formData.book || ''}
                            onChange={e => setFormData({ ...formData, book: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-black/10 focus:outline-none focus:border-black/30"
                            placeholder="Ex: 1963.05.01"
                        />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            checked={formData.is_weekly || false}
                            onChange={e => setFormData({ ...formData, is_weekly: e.target.checked })}
                            id="weekly"
                            className="w-5 h-5 rounded border-gray-300 text-[#0a1628] focus:ring-[#0a1628]"
                        />
                        <label htmlFor="weekly" className="text-sm font-medium text-black">
                            Marcar como Mensagem da Semana ⭐
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isSaving} className="bg-[#0a1628] text-white">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
