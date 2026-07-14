import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { loginRequest, meRequest, registerRequest } from '../api/auth';
import { extractApiError } from '../utils/api';
import { clearAuthStorage, getAuthToken, getStoredUser, setAuthStorage } from '../utils/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getStoredUser());
  const token = ref(getAuthToken());
  const loading = ref(false);
  const initialized = ref(false);

  const isAuthenticated = computed(() => Boolean(token.value && user.value));
  const isOwner = computed(() => user.value?.role === 'OWNER');
  const isRenter = computed(() => user.value?.role === 'RENTER');

  const persistAuth = (payload) => {
    user.value = payload.user;
    token.value = payload.token;
    setAuthStorage(payload);
  };

  const initialize = async () => {
    if (!token.value) {
      initialized.value = true;
      return;
    }

    try {
      const response = await meRequest();
      user.value = response.data;
      setAuthStorage({ token: token.value, user: response.data });
    } catch {
      logout();
    } finally {
      initialized.value = true;
    }
  };

  const login = async (payload) => {
    loading.value = true;

    try {
      const response = await loginRequest(payload);
      persistAuth(response.data);
      return response;
    } catch (error) {
      throw new Error(extractApiError(error));
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload) => {
    loading.value = true;

    try {
      const response = await registerRequest(payload);
      persistAuth(response.data);
      return response;
    } catch (error) {
      throw new Error(extractApiError(error));
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    clearAuthStorage();
  };

  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated,
    isOwner,
    isRenter,
    initialize,
    login,
    register,
    logout,
  };
});
