"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const initial =
    direction === "up"    ? { y: 40, opacity: 0 } :
    direction === "left"  ? { x: -40, opacity: 0 } :
    direction === "right" ? { x: 40, opacity: 0 } :
                            { opacity: 0 };

  const animate =
    direction === "up"    ? { y: 0, opacity: 1 } :
    direction === "left"  ? { x: 0, opacity: 1 } :
    direction === "right" ? { x: 0, opacity: 1 } :
                            { opacity: 1 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}