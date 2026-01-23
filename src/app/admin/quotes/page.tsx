"use client"

import { motion } from "motion/react"
import { Plus, Edit, Trash2, Eye, Quote, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type HeroQuote = {
    id: string
    book: string
    phrase: string
    author: string
    active: boolean
}

export default function QuotesCMSPage() {
    const [quotes, setQuotes] = useState<HeroQuote[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState<Partial<HeroQuote>>({
        active: true,
        author: "Rev. William Branham"
    })

    const fetchQuotes = async () => {
        try {
            const { data, error } = await supabase
                .from('landing_quotes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setQuotes(data || [])
        } catch (error) {
            console.error('Error fetching quotes:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchQuotes()
    }, [])

    const handleOpenModal = (quote?: HeroQuote) => {
        if (quote) {
            setFormData(quote)
        } else {
            setFormData({ active: true, book: '', phrase: '', author: 'Rev. William Branham' })
        }
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const dataToSave = {
                book: formData.book,
                phrase: formData.phrase,
                author: formData.author,
                active: formData.active
            }

            if (formData.id) {
                const { error } = await supabase
                    .from('landing_quotes')
                    .update(dataToSave)
                    .eq('id', formData.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('landing_quotes')
                    .insert([dataToSave])
                if (error) throw error
            }

            await fetchQuotes()
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error saving:', error)
            alert('Erro ao salvar')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta frase?')) return

        try {
            const { error } = await supabase.from('landing_quotes').delete().eq('id', id)
            if (error) throw error
            await fetchQuotes()
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Erro ao excluir')
        }
    }

    const toggleActive = async (quote: HeroQuote) => {
        try {
            await supabase.from('landing_quotes').update({ active: !quote.active }).eq('id', quote.id)
            fetchQuotes()
        } catch (error) { console.error(error) }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black">CMS de Frases</h1>
                    <p className="text-black/60 mt-1">Gerencie as citações exibidas na Hero Section</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-[#0a1628] hover:bg-[#0a1628]/90 text-white gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Frase
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-black/20" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {quotes.map((quote, index) => (
                        <motion.div
                            key={quote.id}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-black/5 hover:shadow-black/10 transition-shadow relative group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Quote className="w-5 h-5" />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => toggleActive(quote)} className={`p-2 rounded-full hover:bg-gray-100 ${quote.active ? 'text-green-600' : 'text-gray-400'}`}>
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleOpenModal(quote)} className="p-2 rounded-full hover:bg-gray-100 text-blue-600">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(quote.id)} className="p-2 rounded-full hover:bg-red-50 text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-500">{quote.book}</p>
                                <p className="text-gray-900 font-serif italic relative">
                                    "{quote.phrase}"
                                </p>
                                <p className="text-sm text-gray-400 text-right">— {quote.author}</p>
                            </div>

                            <div className="absolute top-6 right-6">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${quote.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                    {quote.active ? "Ativo" : "Inativo"}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={formData.id ? "Editar Frase" : "Nova Frase"}
                description="Adicione uma citação impactante."
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Livro / Data / Referência</Label>
                        <Input
                            value={formData.book || ''}
                            onChange={e => setFormData({ ...formData, book: e.target.value })}
                            placeholder="Ex: 1963.06.06 - MOSTRA - NOS O PAI"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Frase</Label>
                        <Textarea
                            value={formData.phrase || ''}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, phrase: e.target.value })}
                            placeholder="Digite a citação aqui..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Autor</Label>
                        <Input
                            value={formData.author || ''}
                            onChange={e => setFormData({ ...formData, author: e.target.value })}
                            placeholder="Ex: Rev. William Branham"
                        />
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
