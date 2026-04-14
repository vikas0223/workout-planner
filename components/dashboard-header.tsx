'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface DashboardHeaderProps {
  userName: string
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl p-6 md:p-8 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-lg"
        >
          <User className="w-8 h-8 text-white" />
        </motion.div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-indigo-700 mt-1">Your fitness dashboard overview</p>
        </div>
      </div>
    </motion.div>
  )
}
