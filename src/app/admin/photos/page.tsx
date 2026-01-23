"use client"

import { motion } from "motion/react"
import { Plus, Edit, Trash2, Eye, Loader2, Link as LinkIcon, Camera, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type GalleryPhoto = {
    id: string
    url: string
    alt: string
    row: number
    position: number
    active: boolean
    object_position: string // "x y" format, e.g. "50 50"
    created_at?: string
}

// Parse position string to x,y values
const parsePosition = (pos: string): { x: number; y: number } => {
    const [x, y] = (pos || '50 50').split(' ').map(Number)
    return { x: isNaN(x) ? 50 : x, y: isNaN(y) ? 50 : y }
}

// Convert x,y to CSS object-position
const toObjectPosition = (x: number, y: number) => `${x}% ${y}%`

export default function PhotosPage() {
    const [photos, setPhotos] = useState<GalleryPhoto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState<Partial<GalleryPhoto>>({
        active: true,
        url: '',
        alt: '',
        object_position: '50 50'
    })
    const [imageError, setImageError] = useState(false)

    // Drag state
    const [isDragging, setIsDragging] = useState(false)
    const [dragPosition, setDragPosition] = useState({ x: 50, y: 50 })
    const previewRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 })

    const fetchPhotos = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_photos')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setPhotos(data || [])
        } catch (error) {
            console.error('Error fetching photos:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPhotos()
    }, [])

    // Update drag position when form data changes
    useEffect(() => {
        const pos = parsePosition(formData.object_position || '50 50')
        setDragPosition(pos)
    }, [formData.object_position])

    const handleOpenModal = (photo?: GalleryPhoto) => {
        if (photo) {
            setFormData(photo)
            setDragPosition(parsePosition(photo.object_position))
        } else {
            setFormData({ active: true, url: '', alt: '', object_position: '50 50' })
            setDragPosition({ x: 50, y: 50 })
        }
        setImageError(false)
        setImageNaturalSize({ width: 0, height: 0 })
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        if (!formData.url) {
            alert('Por favor, insira um link de imagem')
            return
        }

        setIsSaving(true)
        try {
            const dataToSave = {
                url: formData.url,
                alt: formData.alt || '',
                row: 1, // Default value for compatibility
                active: formData.active,
                object_position: `${Math.round(dragPosition.x)} ${Math.round(dragPosition.y)}`
            }

            if (formData.id) {
                const { error } = await supabase
                    .from('gallery_photos')
                    .update(dataToSave)
                    .eq('id', formData.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('gallery_photos')
                    .insert([dataToSave])
                if (error) throw error
            }

            await fetchPhotos()
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error saving:', error)
            alert('Erro ao salvar')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta foto?')) return

        try {
            const { error } = await supabase.from('gallery_photos').delete().eq('id', id)
            if (error) throw error
            await fetchPhotos()
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Erro ao excluir')
        }
    }

    const toggleActive = async (photo: GalleryPhoto) => {
        try {
            await supabase.from('gallery_photos').update({ active: !photo.active }).eq('id', photo.id)
            fetchPhotos()
        } catch (error) { console.error(error) }
    }

    // Handle drag to position
    const handleDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !previewRef.current) return

        const rect = previewRef.current.getBoundingClientRect()
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        // Calculate percentage position
        let x = ((clientX - rect.left) / rect.width) * 100
        let y = ((clientY - rect.top) / rect.height) * 100

        // Clamp values
        x = Math.max(0, Math.min(100, x))
        y = Math.max(0, Math.min(100, y))

        setDragPosition({ x, y })
    }, [isDragging])

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault()
        setIsDragging(true)
        handleDrag(e)
    }

    const handleDragEnd = () => {
        setIsDragging(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black">Fotos Galeria</h1>
                    <p className="text-black/60 mt-1">Gerencie as fotos da galeria (distribuição aleatória)</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-[#0a1628] hover:bg-[#0a1628]/90 text-white gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Foto
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-black/20" /></div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {/* Add Photo Button as First Item */}
                    <motion.button
                        onClick={() => handleOpenModal()}
                        className="aspect-[8/5] rounded-xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center gap-2 text-black/30 hover:border-black/20 hover:text-black/50 hover:bg-black/5 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-8 h-8" />
                        <span className="text-sm font-medium">Adicionar Foto</span>
                    </motion.button>

                    {photos.map((photo, index) => {
                        const pos = parsePosition(photo.object_position)
                        return (
                            <motion.div
                                key={photo.id}
                                className="aspect-[8/5] rounded-xl overflow-hidden bg-gray-200 relative group shadow-sm border border-black/5"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -4, scale: 1.02, zIndex: 10 }}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.alt}
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: toObjectPosition(pos.x, pos.y) }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ddd" width="100" height="100"/><text fill="%23999" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12">Erro</text></svg>'
                                    }}
                                />

                                {/* Status Badge */}
                                <div className="absolute top-2 right-2 z-10">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${photo.active ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                                        {photo.active ? "Ativo" : "Off"}
                                    </span>
                                </div>

                                {/* Hover Controls */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                                    <button onClick={() => toggleActive(photo)} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30 transition-colors">
                                        <Eye className={`w-4 h-4 ${!photo.active && 'opacity-50'}`} />
                                    </button>
                                    <button onClick={() => handleOpenModal(photo)} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(photo.id)} className="w-8 h-8 rounded-full bg-red-500/50 backdrop-blur text-white flex items-center justify-center hover:bg-red-500/70 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={formData.id ? "Editar Foto" : "Nova Foto"}
                description="Adicione uma foto da galeria usando um link de imagem."
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Link da Imagem</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                                <Input
                                    value={formData.url || ''}
                                    onChange={e => {
                                        setFormData({ ...formData, url: e.target.value })
                                        setImageError(false)
                                        setImageNaturalSize({ width: 0, height: 0 })
                                    }}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-black/40">Cole o link direto de uma imagem (JPG, PNG, WebP)</p>
                    </div>

                    {formData.url && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                    <Move className="w-4 h-4" />
                                    Arraste para posicionar
                                </Label>
                                <span className="text-xs text-black/40">
                                    {Math.round(dragPosition.x)}% × {Math.round(dragPosition.y)}%
                                </span>
                            </div>

                            {/* Card Preview with exact proportions - DRAGGABLE */}
                            <div
                                ref={previewRef}
                                className="relative bg-gray-100 border-2 border-black/10 rounded-2xl overflow-hidden mx-auto cursor-move select-none"
                                style={{ width: '384px', height: '240px', maxWidth: '100%' }}
                                onMouseDown={handleDragStart}
                                onMouseMove={handleDrag}
                                onMouseUp={handleDragEnd}
                                onMouseLeave={handleDragEnd}
                                onTouchStart={handleDragStart}
                                onTouchMove={handleDrag}
                                onTouchEnd={handleDragEnd}
                            >
                                {imageError ? (
                                    <div className="w-full h-full flex items-center justify-center text-red-500 text-sm">
                                        <Camera className="w-5 h-5 mr-2" />
                                        Erro ao carregar imagem
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            ref={imageRef}
                                            src={formData.url}
                                            alt="Preview"
                                            className="w-full h-full object-cover pointer-events-none transition-all duration-75"
                                            style={{ objectPosition: toObjectPosition(dragPosition.x, dragPosition.y) }}
                                            onError={() => setImageError(true)}
                                            onLoad={(e) => {
                                                const img = e.target as HTMLImageElement
                                                setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
                                            }}
                                            draggable={false}
                                        />

                                        {/* Crosshair indicator */}
                                        <div
                                            className="absolute w-6 h-6 pointer-events-none transition-all duration-75"
                                            style={{
                                                left: `${dragPosition.x}%`,
                                                top: `${dragPosition.y}%`,
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        >
                                            <div className="w-full h-full rounded-full border-2 border-white shadow-lg bg-white/30 backdrop-blur-sm" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white shadow" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Corner labels */}
                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/50 backdrop-blur text-white text-xs pointer-events-none">
                                    384 × 240px
                                </div>
                                {imageNaturalSize.width > 0 && (
                                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/50 backdrop-blur text-white text-xs pointer-events-none">
                                        Original: {imageNaturalSize.width} × {imageNaturalSize.height}
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-black/40 text-center">
                                Clique e arraste na imagem para ajustar o enquadramento
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Texto Alternativo</Label>
                        <Input
                            value={formData.alt || ''}
                            onChange={e => setFormData({ ...formData, alt: e.target.value })}
                            placeholder="Descrição da foto"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isSaving || !formData.url} className="bg-[#0a1628] text-white">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
