import { logoutAgent, refreshTokenAgent, sessionAgent } from "@/lib/api/agent";
import {
  LoginSchema,
  RefreshTokenResponseSchema,
  RegisterSchema,
  SessionResponseSchema,
} from "@/lib/proto/auth";
import {
  clearCookie,
  setEncryptedCookie,
} from "@/state/persisted/cookie-manager";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
// State & Actions
interface AuthState {
  isLoading: boolean;
  error: string | null;
  loginPayload: LoginSchema;
  registerPayload: RegisterSchema;
  accessToken: string | null;
  isAuthenticated: boolean | null;
}
interface AuthActions {
  logout: () => Promise<void>;
  validateLogin: () => boolean;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setIsAuthenticated: (authticate: boolean) => void;
  login: () => Promise<SessionResponseSchema>;
  register: () => Promise<SessionResponseSchema>;
  setAccessToken: (token: string | null) => string;
  refreshAccessToken: (token: string) => Promise<RefreshTokenResponseSchema>;
  setLogin: <K extends keyof LoginSchema>(
    field: K,
    value: LoginSchema[K]
  ) => void;
  setRegister: <K extends keyof RegisterSchema>(
    field: K,
    value: RegisterSchema[K]
  ) => void;
}
export const useAuth = create<AuthState & AuthActions>()(
  devtools((set, get) => ({
    user: null,
    token: null,
    error: null,
    isLoading: false,
    loginPayload: {
      email: "apago@admin.com",
      password: "password",
      phone: "080 *** *** ****",
    },
    registerPayload: {
      name: "John Doe",
      email: "apago@admin.com",
      password: "password",
    },
    accessToken: null,
    isAuthenticated: false,
    setError: (error) => set({ error }),
    setLoading: (isLoading) => set({ isLoading }),
    setAccessToken: (accessToken) => set({ accessToken }),
    setIsAuthenticated: (authticate) => set({ isAuthenticated: authticate }),
    setLogin: <K extends keyof LoginSchema>(
      field: K,
      value: LoginSchema[K]
    ) => {
      const { loginPayload } = get();
      set({
        loginPayload: {
          ...loginPayload,
          [field]: value,
        },
      });
    },

    setRegister: <K extends keyof LoginSchema>(
      field: K,
      value: LoginSchema[K]
    ) => {
      const { registerPayload } = get();
      set({
        registerPayload: {
          ...registerPayload,
          [field]: value,
        },
      });
    },

    login: async () => {
      const { setLoading, loginPayload, setAccessToken, setIsAuthenticated } =
        get();
      setLoading(true);
      try {
        const response = await sessionAgent(loginPayload);
        const week = new Date(
          Date.now() + response.data.refresh_expires_in * 1000
        );
        setEncryptedCookie("_r_t", { data: response.data }, week);
        setAccessToken(response.data.token);
        setIsAuthenticated(true);
        return response;
      } catch (err) {
        const error = err as Error;
        throw new Error(error.message);
      } finally {
        setLoading(false);
      }
    },

    register: async () => {
      const {
        setLoading,
        registerPayload,
        setAccessToken,
        setIsAuthenticated,
      } = get();
      setLoading(true);
      try {
        const response = await sessionAgent(registerPayload);
        const week = new Date(
          Date.now() + response.data.refresh_expires_in * 1000
        );
        setEncryptedCookie("_r_t", { data: response.data }, week);
        setAccessToken(response.data.token);
        setIsAuthenticated(true);
        return response;
      } catch (err) {
        const error = err as Error;
        throw new Error(error.message);
      } finally {
        setLoading(false);
      }
    },

    refreshAccessToken: async (token: string) => {
      const { setAccessToken } = get();
      try {
        const response = await refreshTokenAgent({
          token: token,
        });
        // Update the access token in the store
        setAccessToken(response.data.token);
        return response;
      } catch (err) {
        const error = err as Error;
        console.error("Failed to refresh access token:", error);
        throw new Error(error.message);
      }
    },
    // Handle logout action
    logout: async () => {
      const { setAccessToken, setIsAuthenticated } = get();
      const response = await logoutAgent();
      if (response) {
        clearCookie("_r_t");
        setAccessToken(null);
        setIsAuthenticated(false);
        window.location.replace("/auth/signin");
      }
    },
    validateLogin: (): boolean => {
      const { loginPayload } = get();
      const isValid = !!loginPayload.email && !!loginPayload.password;

      return isValid;
    },
  }))
);
