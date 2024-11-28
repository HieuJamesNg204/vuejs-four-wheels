<script setup>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const phoneNumber = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const role = ref('admin');

const userErrorMessage = ref('');

onMounted(() => {
    if (auth.isAuthenticated()) {
        alert('Please log out if you wish to create a new account.');
        router.push('/fourwheels/cars');
        return;
    }
    
    document.title = 'Register - Four Wheels';
});

const register = async () => {
    if (password.value !== passwordConfirmation.value) {
        userErrorMessage.value = 'Passwords do not match.';
    } else {
        try {
            await axios.post('http://localhost:3000/fourwheels/auth/register', {
                username: username.value,
                phoneNumber: phoneNumber.value,
                password: password.value,
                role: role.value,
            });
            
            console.log(`Registration successful`);
            alert('Registration successful!');
            router.push('/fourwheels/login');
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;

                if (statusCode === 409) {
                    userErrorMessage.value = error.response.data;
                } else if (statusCode === 400) {
                    userErrorMessage.value = error.response.data.errors[0].msg;
                } else {
                    alert(error.response.data);
                }
            } else {
                alert('An unexpected network error occurred.');
            }
        }
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Register</h1>
            <form>
                <div class="mb-3">
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
                <div class="mb-3">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="phoneNumber">
                        Phone Number
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="phoneNumber"
                        type="text"
                        placeholder="Phone Number"
                        v-model="phoneNumber"
                    />
                </div>
                <div class="mb-3">
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
                <div class="mb-3">
                    <label
                        class="block text-gray-700 text-sm font-bold mb-2"
                        for="confirmPassword"
                    >
                        Confirm Password
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        v-model="passwordConfirmation"
                    />
                    <div v-if="userErrorMessage" class="text-red-500 text-sm">
                        {{ userErrorMessage }}
                    </div>
                </div>
                <div class="mb-3">
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
    </div>
</template>