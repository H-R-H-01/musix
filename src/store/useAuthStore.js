import { create } from 'zustand'

// Mock state for now
export const useAuthStore = create((set) => ({
  user: {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'admin', // 'user' | 'admin'
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    listeningTime: 12450, // 207.5 minutes
  },
  setUser: (user) => set({ user }),
  incrementListeningTime: (secs) => set((state) => ({
    user: { ...state.user, listeningTime: state.user.listeningTime + secs }
  })),
  toggleRole: () => set((state) => ({
    user: {
      ...state.user,
      role: state.user.role === 'admin' ? 'user' : 'admin',
      name: state.user.role === 'admin' ? 'Jane Doe (User)' : 'Admin User'
    }
  }))
}))

