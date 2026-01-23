"use client"

import { motion } from "motion/react"
import { Plus, Edit, Trash2, Eye, Image as ImageIcon, Video, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

// Helper to extract YouTube ID
const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

type LandingCard = {
    id: string
    title: string
    type: 'image' | 'video'
    tag: string
    thumbnail: string
    active: boolean
}

export default function LandingCMSPage() {
    const [cards, setCards] = useState<LandingCard[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState<Partial<LandingCard>>({
        type: 'image',
        active: true
    })

    const fetchCards = async () => {
        try {
            const { data, error } = await supabase
                .from('landing_cards')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setCards(data || [])
        } catch (error) {
            console.error('Error fetching cards:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCards()
    }, [])

    const handleOpenModal = (card?: LandingCard) => {
        if (card) {
            setFormData(card)
        } else {
            setFormData({ type: 'image', active: true, title: '', tag: '', thumbnail: '' })
        }
        setIsModalOpen(true)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const { error: uploadError } = await supabase.storage
                .from('landing-assets')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('landing-assets')
                .getPublicUrl(fileName)

            setFormData(prev => ({ ...prev, thumbnail: publicUrl }))
        } catch (error) {
            console.error('Erro no upload:', error)
            alert('Erro ao fazer upload da imagem')
        } finally {
            setIsUploading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const dataToSave = {
                title: formData.title,
                type: formData.type,
                tag: formData.tag,
                thumbnail: formData.thumbnail,
                active: formData.active
            }

            if (formData.id) {
                const { error } = await supabase
                    .from('landing_cards')
                    .update(dataToSave)
                    .eq('id', formData.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('landing_cards')
                    .insert([dataToSave])
                if (error) throw error
            }

            await fetchCards()
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error saving:', error)
            alert('Erro ao salvar')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir?')) return

        try {
            const { error } = await supabase.from('landing_cards').delete().eq('id', id)
            if (error) throw error
            await fetchCards()
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Erro ao excluir')
        }
    }

    const toggleActive = async (card: LandingCard) => {
        try {
            await supabase.from('landing_cards').update({ active: !card.active }).eq('id', card.id)
            fetchCards()
        } catch (error) { console.error(error) }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black">Landing CMS</h1>
                    <p className="text-black/60 mt-1">Gerencie os cards do carrossel da Hero</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-[#0a1628] hover:bg-[#0a1628]/90 text-white gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Card
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-black/20" /></div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {cards.map((card, index) => {
                        const youtubeId = card.type === 'video' ? getYoutubeId(card.thumbnail) : null;

                        return (
                            <motion.div
                                key={card.id}
                                className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 group shadow-xl relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                style={{ aspectRatio: "2/3" }}
                            >
                                {card.type === 'image' || !youtubeId ? (
                                    <img src={card.thumbnail || '/placeholder.png'} alt={card.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
                                            className="absolute top-1/2 left-1/2 w-[300%] h-[150%] -translate-x-1/2 -translate-y-1/2 object-cover"
                                            title={card.title}
                                            style={{ pointerEvents: 'none' }}
                                        />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                                {/* Controls Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                                    <button onClick={() => toggleActive(card)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30 transition-colors">
                                        <Eye className={`w-5 h-5 ${!card.active && 'opacity-50'}`} />
                                    </button>
                                    <button onClick={() => handleOpenModal(card)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30 transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(card.id)} className="w-10 h-10 rounded-full bg-red-500/50 backdrop-blur text-white flex items-center justify-center hover:bg-red-500/70 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                    <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-medium flex items-center gap-1">
                                        {card.type === "video" ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                        {card.type === "video" ? "Vídeo" : "Imagem"}
                                    </span>
                                </div>

                                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${card.active ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                                        {card.active ? "Ativo" : "Inativo"}
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-none">
                                    <h3 className="font-semibold text-white text-sm truncate">{card.title}</h3>
                                    <p className="text-xs text-white/60 mt-0.5">{card.tag}</p>
                                </div>
                            </motion.div>
                        )
                    })}


                    <motion.button
                        onClick={() => handleOpenModal()}
                        className="bg-white/5 border-2 border-dashed border-black/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-black/40 hover:border-black/20 hover:text-black/60 hover:bg-black/5 transition-colors"
                        style={{ aspectRatio: "2/3" }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-10 h-10" />
                        <span className="font-medium text-sm">Adicionar Card</span>
                    </motion.button>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={formData.id ? "Editar Card" : "Novo Card"}
                description="Preencha as informações do card para a Hero Section."
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tipo de Conteúdo</Label>
                            <Select
                                value={formData.type || 'image'}
                                onValueChange={(v: any) => setFormData({ ...formData, type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="image">Imagem</SelectItem>
                                    <SelectItem value="video">Vídeo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tag</Label>
                            <Input
                                value={formData.tag || ''}
                                onChange={e => setFormData({ ...formData, tag: e.target.value })}
                                placeholder="#TAG"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Título</Label>
                        <Input
                            value={formData.title || ''}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ex: Super Raça Kids"
                        />
                    </div>

                    {formData.type === 'video' ? (
                        <div className="space-y-2">
                            <Label>Link do Vídeo (YouTube)</Label>
                            <Input
                                value={formData.thumbnail || ''}
                                onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                                placeholder="https://youtube.com/..."
                            />
                            <p className="text-xs text-black/40">Cole o link direto do vídeo.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label>Imagem / Capa</Label>
                            <div className="border border-input rounded-md p-3">
                                {formData.thumbnail && (
                                    <div className="mb-3 relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                                        <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                    />
                                    {isUploading && <Loader2 className="w-5 h-5 animate-spin text-black/50" />}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isSaving || isUploading} className="bg-[#0a1628] text-white">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
