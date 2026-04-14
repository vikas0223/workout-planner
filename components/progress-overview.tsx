'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface Progress {
  id: string
  user_id: string
  plan_id: string
  week: number
  completion_percentage: number
  last_updated: string
}

interface WorkoutPlan {
  id: string
  user_id: string
  plan_name: string
  created_at: string
  status: 'active' | 'paused' | 'completed'
}

interface ProgressOverviewProps {
  progress: Progress[]
  plans: WorkoutPlan[]
}

export default function ProgressOverview({ progress, plans }: ProgressOverviewProps) {
  const avgCompletion = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.completion_percentage, 0) / progress.length)
    : 0

  const totalWorkouts = progress.length
  const activePlans = plans.filter(p => p.status === 'active').length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-indigo-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Progress Overview
          </CardTitle>
          <CardDescription className="text-indigo-700">
            Your current fitness metrics and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Average Completion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200"
            >
              <p className="text-blue-600 text-sm font-medium mb-2">Avg Completion</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl font-bold text-blue-900"
              >
                {avgCompletion}%
              </motion.p>
              <div className="mt-3 h-2 bg-blue-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${avgCompletion}%` }}
                  transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                />
              </div>
            </motion.div>

            {/* Total Workouts */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200"
            >
              <p className="text-purple-600 text-sm font-medium mb-2">Total Workouts</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-4xl font-bold text-purple-900"
              >
                {totalWorkouts}
              </motion.p>
              <p className="text-purple-700 text-sm mt-3">
                {totalWorkouts === 0 ? 'Start your journey' : 'Keep going!'}
              </p>
            </motion.div>

            {/* Active Plans */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200"
            >
              <p className="text-green-600 text-sm font-medium mb-2">Active Plans</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-4xl font-bold text-green-900"
              >
                {activePlans}
              </motion.p>
              <p className="text-green-700 text-sm mt-3">
                {activePlans === 0 ? 'Create a new plan' : 'Plans in progress'}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
