"use client";

import { motion } from "motion/react";

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}
