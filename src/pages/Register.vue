<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const password = ref('');
const role = ref('admin');

const register = async () => {
    try {
        const response = await axios.post('http://localhost:3000/fourwheels/auth/register', {
            username: username.value,
            password: password.value,
            role: role.value,
        });
        console.log(`Registration successful: ${response.data}`);
        alert('Registration successful!');
        router.push('/fourwheels/login');
    } catch (error) {
        alert(`Error: ${error}`);
    }
};
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Register</h1>
        <form>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                    Email
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Email"
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
            <div class="mb-6">
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="role"
                >
                    Role
                </label>
                <select
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="role"
                    v-model="role"
                >
                    <option value="admin">Admin</option>
                    <option value="customer">Customer</option>
                </select>
            </div>
            <div class="flex items-center justify-between">
                <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    @click.prevent="register"
                >
                    Register
                </button>
                <router-link
                    to="/fourwheels/login"
                    class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >
                    Already have an account?
                </router-link>
            </div>
        </form>
    </div>
</template>