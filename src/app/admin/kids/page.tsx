"use client"

import { motion } from "motion/react"
import { Plus, Upload, Play, Clock, Eye, MoreVertical, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type Video = {
    id: string
    title: string
    duration: string | null
    views: number
    thumbnail_url: string
    video_url: string
    status: "published" | "draft"
    created_at: string
}

export default function KidsVideosPage() {
    const [videos, setVideos] = useState<Video[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    // Form State
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
    const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [status, setStatus] = useState<"published" | "draft">("draft")
    const [duration, setDuration] = useState("")

    const videoInputRef = useRef<HTMLInputElement>(null)
    const thumbnailInputRef = useRef<HTMLInputElement>(null)

    // Fetch Videos
    const fetchVideos = async () => {
        try {
            const { data, error } = await supabase
                .from('kids_videos')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setVideos(data || [])
        } catch (error) {
            console.error("Error fetching videos:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchVideos()
    }, [])

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedVideo(file)
            setTitle(file.name.replace(/\.[^/.]+$/, "")) // Remove extension
            setIsModalOpen(true)

            // Try to get duration
            const video = document.createElement('video')
            video.preload = 'metadata'
            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src)
                const minutes = Math.floor(video.duration / 60)
                const seconds = Math.floor(video.duration % 60)
                setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`)
            }
            video.src = URL.createObjectURL(file)
        }
    }

    const handleUpload = async () => {
        if (!selectedVideo || !title) return

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const timestamp = Date.now()

            // 1. Upload Video
            const videoPath = `videos/${timestamp}_${selectedVideo.name.replace(/\s+/g, '-')}`
            const { data: videoUpload, error: videoError } = await supabase.storage
                .from('kids-videos')
                .upload(videoPath, selectedVideo)

            if (videoError) throw videoError

            const videoUrl = supabase.storage.from('kids-videos').getPublicUrl(videoPath).data.publicUrl

            // 2. Upload Thumbnail (if selected)
            let thumbnailUrl = ""
            if (selectedThumbnail) {
                const thumbPath = `thumbnails/${timestamp}_${selectedThumbnail.name.replace(/\s+/g, '-')}`
                const { error: thumbError } = await supabase.storage
                    .from('kids-videos')
                    .upload(thumbPath, selectedThumbnail)

                if (thumbError) throw thumbError

                thumbnailUrl = supabase.storage.from('kids-videos').getPublicUrl(thumbPath).data.publicUrl
            }

            // 3. Insert into DB
            const { error: dbError } = await supabase
                .from('kids_videos')
                .insert({
                    title,
                    video_url: videoUrl,
                    thumbnail_url: thumbnailUrl,
                    duration,
                    status,
                    views: 0
                })

            if (dbError) throw dbError

            // Reset and Refresh
            setIsModalOpen(false)
            setSelectedVideo(null)
            setSelectedThumbnail(null)
            setTitle("")
            setStatus("draft")
            fetchVideos()

        } catch (error) {
            console.error("Upload failed:", error)
            alert("Erro ao fazer upload. Verifique o console.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (id: string, videoUrl: string, thumbnailUrl: string) => {
        if (!confirm("Tem certeza que deseja excluir este vídeo?")) return

        try {
            // Delete DB Record first
            await supabase.from('kids_videos').delete().eq('id', id)

            // Try to delete files (optional, best effort)
            // Extract paths from URLs would be needed here, keeping it simple for now
            fetchVideos()
        } catch (error) {
            console.error("Delete failed:", error)
        }
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black">Super Raça Kids</h1>
                    <p className="text-black/60 mt-1">Gerencie os vídeos educativos</p>
                </div>
                <Button
                    onClick={() => videoInputRef.current?.click()}
                    className="bg-[#0a1628] hover:bg-[#0a1628]/90 text-white gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Upload Vídeo
                </Button>
                <input
                    type="file"
                    ref={videoInputRef}
                    className="hidden"
                    accept="video/*"
                    onChange={handleVideoSelect}
                />
            </div>

            {/* Upload Zone */}
            <motion.div
                className="bg-white border-2 border-dashed border-black/10 rounded-2xl p-8 text-center hover:border-[#0a1628]/30 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => videoInputRef.current?.click()}
            >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0a1628]/5 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-[#0a1628]/50" />
                </div>
                <h3 className="font-semibold text-black mb-2">Arraste e solte seus vídeos aqui</h3>
                <p className="text-sm text-black/50 mb-4">ou clique para selecionar arquivos</p>
                <p className="text-xs text-black/30">MP4, MOV até 500MB</p>
            </motion.div>

            {/* Videos Table */}
            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-black/20" /></div>
            ) : (
                <motion.div
                    className="bg-white rounded-2xl border border-black/5 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="p-4 border-b border-black/5">
                        <h2 className="font-semibold text-black">Vídeos ({videos.length})</h2>
                    </div>
                    <div className="divide-y divide-black/5">
                        {videos.length === 0 && (
                            <p className="p-8 text-center text-black/40">Nenhum vídeo encontrado.</p>
                        )}
                        {videos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                className="flex items-center gap-4 p-4 hover:bg-black/[0.02] transition-colors group"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                {/* Thumbnail */}
                                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    {video.thumbnail_url ? (
                                        <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <Play className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-black truncate">{video.title}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-black/50">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {video.duration || "--:--"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {video.views.toLocaleString()} views
                                        </span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${video.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                    {video.status === "published" ? "Publicado" : "Rascunho"}
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={() => handleDelete(video.id, video.video_url, video.thumbnail_url)}
                                    className="p-2 hover:bg-red-50 text-red-500/0 group-hover:text-red-500 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Upload Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => !isUploading && setIsModalOpen(false)}
                title="Novo Vídeo"
                description="Preencha os detalhes do vídeo."
            >
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Arquivo Selecionado</Label>
                        <div className="p-3 bg-slate-50 rounded-lg text-sm truncate font-medium border border-slate-200">
                            {selectedVideo?.name}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Título</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Aula 01" />
                    </div>

                    <div className="space-y-2">
                        <Label>Thumbnail (Capa)</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    checked={status === 'draft'}
                                    onChange={() => setStatus('draft')}
                                    className="accent-black"
                                />
                                <span className="text-sm">Rascunho</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    checked={status === 'published'}
                                    onChange={() => setStatus('published')}
                                    className="accent-black"
                                />
                                <span className="text-sm">Publicado</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isUploading}>
                            Cancelar
                        </Button>
                        <Button onClick={handleUpload} disabled={isUploading || !title} className="bg-[#0a1628] text-white">
                            {isUploading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Enviando...
                                </span>
                            ) : 'Salvar Vídeo'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
