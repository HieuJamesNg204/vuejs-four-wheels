import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
    const username = ref(localStorage.getItem('username') || '');
    const token = ref(localStorage.getItem('token') || '');
    
    // Watch for changes in authentication state
    watch([username, token], ([newUsername, newToken]) => {
        if (newUsername) {
            localStorage.setItem('username', newUsername);
        } else {
            localStorage.removeItem('username');
        }
        
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    });

    // Login function
    const login = (newUsername, newToken) => {
        username.value = newUsername;
        token.value = newToken;
    };

    // Logout function
    const logout = () => {
        username.value = '';
        token.value = '';
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!token.value;
    };

    return {
        username,
        token,
        login,
        logout,
        isAuthenticated
    };
});