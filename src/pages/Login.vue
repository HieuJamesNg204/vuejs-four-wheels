<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
    const data = {
        username: username.value,
        password: password.value
    };
    
    try {
        const res = await axios.post('http://localhost:3000/fourwheels/auth/login', data);
        alert('Login successful');
        console.log('Login successful:', res.data.token);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', username.value);

        router.push('/fourwheels/cars');
    } catch (error) {
        alert(`Error: ${error}`);
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