'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/user-context'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'

interface ExistingUser {
  id: string
  name: string
}

export default function UserEntry() {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<ExistingUser[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setCurrentUser } = useUser()
  const router = useRouter()

  // Fetch existing users based on input
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setSuggestions(data.users || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(inputValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, fetchSuggestions])

  const handleSelectUser = async (user: ExistingUser) => {
    setCurrentUser(user)
    setInputValue('')
    setSuggestions([])
    router.push('/dashboard')
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: inputValue.trim() }),
      })
      const data = await res.json()
      if (data.user) {
        setCurrentUser(data.user)
        setInputValue('')
        setSuggestions([])
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="w-full"
    >
      <Card className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/50 shadow-xl">
        <CardContent className="p-6 md:p-8 space-y-6">
          <motion.div
            className="text-center space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h2 
              variants={staggerItem}
              className="text-3xl md:text-4xl font-bold text-indigo-900"
            >
              Welcome Back
            </motion.h2>
            <motion.p 
              variants={staggerItem}
              className="text-lg text-indigo-700"
            >
              Enter your name to access your workout dashboard
            </motion.p>
          </motion.div>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="relative">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="text-lg py-6 px-4 bg-white/80 border-indigo-300 focus:border-indigo-500 focus:scale-105 placeholder:text-indigo-400 transition-transform"
                />
              </motion.div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-full mt-2 bg-white border border-indigo-200 rounded-lg shadow-lg overflow-hidden origin-top"
                >
                  {suggestions.map((user, index) => (
                    <motion.button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectUser(user)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: '#f3e8ff', paddingLeft: 20 }}
                      className="w-full text-left px-4 py-3 hover:bg-purple-100 transition-colors border-b last:border-b-0 border-indigo-100"
                    >
                      <p className="font-medium text-indigo-900">{user.name}</p>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  Loading...
                </motion.span>
              ) : (
                'Continue to Dashboard'
              )}
            </motion.button>
          </form>

          <motion.p
            variants={staggerItem}
            className="text-center text-sm text-indigo-600"
          >
            First time? Just enter your name and we&apos;ll create your profile!
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
