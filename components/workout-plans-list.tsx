'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Pause } from 'lucide-react'

interface WorkoutPlan {
  id: string
  user_id: string
  plan_name: string
  created_at: string
  status: 'active' | 'paused' | 'completed'
}

interface WorkoutPlansListProps {
  plans: WorkoutPlan[]
}

export default function WorkoutPlansList({ plans }: WorkoutPlansListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-50 border-blue-200'
      case 'paused':
        return 'bg-yellow-50 border-yellow-200'
      case 'completed':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-indigo-900">My Workout Plans</CardTitle>
          <CardDescription className="text-indigo-700">
            {plans.length} plan{plans.length !== 1 ? 's' : ''} created
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-indigo-600 py-8 text-center"
            >
              No workout plans yet. Create your first plan to get started!
            </motion.p>
          ) : (
            <div className="space-y-3">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${getStatusColor(plan.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(plan.status)}
                      <div>
                        <p className="font-semibold text-gray-900">{plan.plan_name}</p>
                        <p className="text-sm text-gray-600">
                          Created {new Date(plan.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/60 text-gray-700 capitalize">
                      {plan.status}
                    </span>
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
