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
    connections: [
      { id: 'c1', name: 'Alex Rivera', relation: 'Friend', synergy: 840, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'c2', name: 'Maria Doe', relation: 'Family', synergy: 1250, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150' }
    ]
  },
  setUser: (user) => set({ user }),
  incrementListeningTime: (secs) => set((state) => ({
    user: { ...state.user, listeningTime: state.user.listeningTime + secs }
  })),
  addConnection: (conn) => set((state) => ({
    user: { ...state.user, connections: [...state.user.connections, { ...conn, synergy: 0 }] }
  })),
  incrementSynergy: (connId, points) => set((state) => ({
    user: { 
      ...state.user, 
      connections: state.user.connections.map(c => c.id === connId ? { ...c, synergy: c.synergy + points } : c)
    }
  })),
  toggleRole: () => set((state) => ({
    user: {
      ...state.user,
      role: state.user.role === 'admin' ? 'user' : 'admin',
      name: state.user.role === 'admin' ? 'Jane Doe (User)' : 'Admin User'
    }
  }))
}))


