import { motion, useReducedMotionConfig } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Scroll reveal that respects BOTH the OS "reduce motion" setting and the
 * reader's own toggle in the dock (via <MotionConfig reducedMotion> in App).
 */
export default function Reveal({ children, delay = 0, y = 32, className }: RevealProps) {
  const reducedMotion = useReducedMotionConfig();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reducedMotion ? 0 : 1, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
