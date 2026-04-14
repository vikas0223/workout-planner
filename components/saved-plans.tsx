'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bookmark, Trash2 } from 'lucide-react'

interface SavedPlan {
  id: string
  user_id: string
  plan_name: string
  description: string | null
  saved_at: string
}

interface SavedPlansProps {
  plans: SavedPlan[]
}

export default function SavedPlans({ plans }: SavedPlansProps) {
  const handleDelete = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this saved plan?')) {
      try {
        await fetch(`/api/saved-plans/${planId}`, { method: 'DELETE' })
        // Optionally refresh the page or remove from state
      } catch (error) {
        console.error('Error deleting plan:', error)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/50 shadow-xl h-full">
        <CardHeader>
          <CardTitle className="text-indigo-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            Saved Plans
          </CardTitle>
          <CardDescription className="text-indigo-700">
            {plans.length} saved plan{plans.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-indigo-600 py-8 text-center text-sm"
            >
              No saved plans yet. Save your favorite workouts!
            </motion.p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-white/60 border border-indigo-200 hover:border-indigo-400 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {plan.plan_name}
                      </p>
                      {plan.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {plan.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Saved {new Date(plan.saved_at).toLocaleDateString()}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
