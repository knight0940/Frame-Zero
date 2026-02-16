import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, RegisterDto, LoginDto } from '@/lib/api';
import * as authApi from '@/lib/api/auth.service';

interface AuthState {
  // 状态
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 操作
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  loadUserFromStorage: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 初始状态
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 登录
      login: async (credentials: LoginDto) => {
        set({ isLoading: true, error: null });
        try {
          const { user, tokens } = await authApi.login(credentials);

          // 保存 token
          localStorage.setItem('access_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);

          set({
            user,
            accessToken: tokens.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || '登录失败';
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      // 注册
      register: async (data: RegisterDto) => {
        set({ isLoading: true, error: null });
        try {
          const { user, tokens } = await authApi.register(data);

          // 保存 token
          localStorage.setItem('access_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);

          set({
            user,
            accessToken: tokens.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || '注册失败';
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      // 登出
      logout: async () => {
        set({ isLoading: true });
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          await authApi.logout(refreshToken || undefined);

          // 清除 token
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');

          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // 即使 API 调用失败，也要清除本地状态
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');

          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // 从 localStorage 加载用户
      loadUserFromStorage: () => {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              accessToken: token,
              isAuthenticated: true,
            });
          } catch (error) {
            // 无效的用户数据，清除
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
          }
        }
      },

      // 清除错误
      clearError: () => set({ error: null }),

      // 设置用户（用于刷新后更新）
      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
