"use client";

import { LazyMotion, domAnimation } from "framer-motion";

// A teljes `motion` helyett csak a szükséges animációs funkciók töltődnek be.
// A `strict` miatt hibát dob, ha valahol mégis a nagy `motion` komponenst használnánk – helyette `m`.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
