"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import FrozenRouter from "./frozen-route";

export default function TransitionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    /* Exclude /admin routes from transition */
    if (pathname.startsWith("/admin")) {
        return <>{children}</>;
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                className="w-full"
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(20px)" }}
                transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1], // Custom slow ease
                }}
                onAnimationComplete={() => {
                    if (typeof window !== "undefined") {
                        window.scrollTo({ top: 0, behavior: "instant" });
                    }
                }}
            >
                <FrozenRouter>{children}</FrozenRouter>
            </motion.div>
        </AnimatePresence>
    );
}
