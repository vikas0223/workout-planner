'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface User {
  id: string
  name: string
}

interface UserContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        console.log('[v0] Restored user from localStorage:', user.name)
        setCurrentUser(user)
      }
    } catch (error) {
      console.error('[v0] Error loading user from localStorage:', error)
    }
    setIsHydrated(true)
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      console.log('[v0] Saved user to localStorage:', currentUser.name)
    } else {
      localStorage.removeItem('currentUser')
      console.log('[v0] Cleared user from localStorage')
    }
  }, [currentUser])

  if (!isHydrated) {
    return <>{children}</>
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
