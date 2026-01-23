"use client"

import { motion } from "motion/react"
import Link from "next/link"

const footerLinks = {
    empresa: [
        { label: "Sobre Nós", href: "#sobre" },
        { label: "Serviços", href: "#servicos" },
        { label: "Galeria", href: "#galeria" },
        { label: "Contato", href: "#contato" },
    ],
    suporte: [
        { label: "FAQ", href: "#" },
        { label: "Ajuda", href: "#" },
        { label: "Termos de Uso", href: "#" },
        { label: "Privacidade", href: "#" },
    ],
    social: [
        { label: "Instagram", href: "#" },
        { label: "Facebook", href: "#" },
        { label: "WhatsApp", href: "#" },
        { label: "YouTube", href: "#" },
    ],
}

export function Footer() {
    return (
        <footer className="relative bg-white text-black pt-20 pb-8 overflow-hidden border-t border-black/5">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/5 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <motion.div
                                className="relative w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <span className="text-white font-black text-lg">SR</span>
                            </motion.div>
                            <span className="text-xl font-bold text-black tracking-tight">
                                Super Raça
                            </span>
                        </Link>
                        <p className="text-black/60 text-sm leading-relaxed mb-6">
                            Transformando experiências com qualidade premium e atendimento
                            excepcional. Junte-se a milhares de clientes satisfeitos.
                        </p>
                        <div className="flex gap-3">
                            {["📧", "📱", "📍"].map((icon, i) => (
                                <motion.div
                                    key={i}
                                    className="w-10 h-10 rounded-lg bg-black/5 border border-black/10 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {icon}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-6">
                                {category}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-black/60 hover:text-black text-sm transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter Section */}
                <motion.div
                    className="border-t border-black/10 pt-12 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-black mb-2">
                                Fique por dentro das novidades
                            </h3>
                            <p className="text-black/60 text-sm">
                                Receba ofertas exclusivas e atualizações diretamente no seu email.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Seu melhor email"
                                className="flex-1 md:w-64 px-4 py-3 bg-black/5 border border-black/10 rounded-lg text-black placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-colors"
                            />
                            <motion.button
                                className="px-6 py-3 bg-black hover:bg-black/80 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Inscrever
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                >
                    <p className="text-black/40 text-sm">
                        © {new Date().getFullYear()} Super Raça. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="#"
                            className="text-black/40 hover:text-black text-sm transition-colors"
                        >
                            Termos
                        </Link>
                        <Link
                            href="#"
                            className="text-black/40 hover:text-black text-sm transition-colors"
                        >
                            Privacidade
                        </Link>
                        <Link
                            href="#"
                            className="text-black/40 hover:text-black text-sm transition-colors"
                        >
                            Cookies
                        </Link>
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}
