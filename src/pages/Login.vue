<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const password = ref('');

const userErrorMessage = ref('');

onMounted(() => {
    document.title = 'Login - Four Wheels';
});

const handleLogin = async () => {
    const data = {
        username: username.value,
        password: password.value
    };

    try {
        const res = await axios.post('http://localhost:3000/fourwheels/auth/login', data);
        const token = res.data.token;
        auth.login(username.value, token);
        router.push('/fourwheels/cars');
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 400) {
                userErrorMessage.value = error.response.data.errors[0].msg;
            } else if (statusCode === 401) {
                userErrorMessage.value = error.response.data;
            } else {
                alert(error.response.data);
            }
        } else {
            alert('An unexpected network error occurred.');
        }
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Login</h1>
            <form>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                        Username
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Username"
                        v-model="username"
                    />
                </div>
                <div class="mb-6">
                    <label
                        class="block text-gray-700 text-sm font-bold mb-2"
                        for="password"
                    >
                        Password
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Password"
                        v-model="password"
                    />
                    <div v-if="userErrorMessage" class="text-red-500 text-sm">
                        {{ userErrorMessage }}
                    </div>
                    <router-link
                        to="/fourwheels/forgot-password"
                        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Forgot password?
                    </router-link>
                </div>
                <div class="flex items-center justify-between">
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click.prevent="handleLogin"
                    >
                        Log in
                    </button>
                    <router-link
                        to="/fourwheels/register"
                        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Don't have an account?
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>