<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const handleLogout = () => {
    auth.logout();
    router.push('/fourwheels/login');
};
</script>

<template>
    <nav class="bg-blue-500 p-4">
        <div class="container mx-auto flex justify-between items-center">
            <div class="text-white font-bold text-xl">
                <router-link :to="auth.isAuthenticated() ? '/fourwheels/cars' : '/fourwheels/login'">Four Wheels</router-link>
            </div>
            <div class="text-white">
                <p v-if="auth.username !== ''">Welcome  {{ auth.username }}</p>
            </div>
            <div>
                <router-link to="/fourwheels/about" class="text-white mr-4">About</router-link>
                <router-link v-if="auth.isAuthenticated()" to="/fourwheels/automakers" class="text-white mr-4">Automakers</router-link>
                <button v-if="auth.isAuthenticated()" class="text-white mr-4" @click="handleLogout">Log out</button>
            </div>
        </div>
    </nav>
</template>