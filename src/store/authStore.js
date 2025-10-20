import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../utils/httpCliente';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      
      login: async (email, password) => {
        set({ loading: true });
        try {
          const response = await authAPI.login(email, password);
          const { token, user } = response.data;
          
          set({ 
            user, 
            token,
            loading: false 
          });
          
          return { success: true };
        } catch (error) {
          set({ loading: false });
          return { 
            success: false, 
            message: error.response?.data?.message || 'Error de conexión' 
          };
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null 
        });
      },
      
      isAuthenticated: () => {
        return !!get().token;
      }
    }),
    {
      name: 'auth-storage', // nombre en localStorage
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      })
    }
  )
);