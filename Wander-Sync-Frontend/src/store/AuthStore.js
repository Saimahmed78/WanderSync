import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import apiClient from "../../services/apiClient";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set, get) => {
      let checkAuthPromise = null; // Deduplication for checkAuth
      let loginPromise = null; // Deduplication for login

      return {
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        _hasHydrated: false,
        theme: "dark", 
        
        setTheme: (theme) => {
          set({ theme });
          // Apply theme to document
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.style.colorScheme = "dark";
          } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.style.colorScheme = "light";
          }
        },
        
        toggleTheme: () => {
          const currentTheme = get().theme;
          const newTheme = currentTheme === "dark" ? "light" : "dark";
          get().setTheme(newTheme);
        },


        setHasHydrated: (state) => {
          set({ _hasHydrated: state });
        },

        checkAuth: async () => {
          // If checkAuth is already running, return the same promise
          if (checkAuthPromise) {
            return checkAuthPromise;
          }

          set({ isCheckingAuth: true });

          // Create a new promise for this call
          checkAuthPromise = (async () => {
            try {
              const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Auth request timed out")), 5000)
              );
              const userData = await Promise.race([apiClient.getMe(), timeoutPromise]);
              set({ user: userData.data, isAuthenticated: true, isCheckingAuth: false });
              return userData;
            } catch (error) {
              set({ user: null, isAuthenticated: false, isCheckingAuth: false });
              return null; // do NOT throw to prevent loader from hanging
            } finally {
              checkAuthPromise = null;
            }
          })();

          return checkAuthPromise;
        },

        login: async (email, password) => {
          // If login is already running, return the same promise
          if (loginPromise) {
            return loginPromise;
          }

          loginPromise = (async () => {
            try {
              const response = await apiClient.login(email, password);

              // Set user directly from login response
              if (response.data) {
                set({
                  user: response.data,
                  isAuthenticated: true,
                });
              }

              toast.success("Logged in successfully!");
              return response;
            }  finally {
              loginPromise = null;
            }
          })();

          return loginPromise;
        },

        logout: async () => {
          try {
            await apiClient.logOut();
          } finally {
            set({ user: null, isAuthenticated: false });
          }
        },
      };
    },
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);