'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/user-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LogOut, Plus, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import EnhancedDashboard from '@/components/enhanced-dashboard'
import type { UserProfile } from '@/lib/recommendation-engine'
import { FavoritesProvider } from '@/components/favorites-context'
import { WorkoutCompletionProvider, useWorkoutCompletion } from '@/contexts/workout-completion-context'

function DashboardContent() {
  const { currentUser, setCurrentUser } = useUser()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isOfflineMode } = useWorkoutCompletion()

  useEffect(() => {
    if (!currentUser) {
      router.push('/')
      return
    }
    
    const savedUserProfile = localStorage.getItem('userProfile')
    if (savedUserProfile) {
      setUserProfile(JSON.parse(savedUserProfile))
    }
    setIsLoading(false)
  }, [currentUser, router])

  const handleLogout = () => {
    setCurrentUser(null)
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-indigo-200 via-purple-200 to-indigo-300 min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-900 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-200 via-purple-200 to-indigo-300 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900">
              Welcome, {currentUser?.name}
            </h1>
            <p className="text-indigo-700 mt-2">Your personalized fitness dashboard</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              New Workout
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {isOfflineMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-700" />
              <AlertTitle className="text-amber-800">Offline Mode</AlertTitle>
              <AlertDescription className="text-amber-700">
                Data is stored locally and will sync when connected.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Dashboard Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {userProfile ? (
            <EnhancedDashboard userProfile={userProfile} />
          ) : (
            <Card className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-indigo-900">Get Started with Your Workout Plan</CardTitle>
                <CardDescription className="text-indigo-700">
                  Create and track your personalized fitness journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-600 mb-6">
                  Your dashboard will populate once you create and complete workouts. Every workout you complete will be tracked here.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create Workout Plan
                </motion.button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <WorkoutCompletionProvider>
      <FavoritesProvider>
        <DashboardContent />
      </FavoritesProvider>
    </WorkoutCompletionProvider>
  )
}
