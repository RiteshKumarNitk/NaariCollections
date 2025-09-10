
"use client";

import { motion } from 'framer-motion';
import { Logo } from './icons';

export function SplashScreen() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Logo className="h-20 w-auto text-foreground" />
      </motion.div>
    </div>
  );
}
