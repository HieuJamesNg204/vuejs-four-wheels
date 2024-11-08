<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const newPassword = ref('');
const confirmNewPassword = ref('');

onMounted(() => {
    document.title = 'Reset password - Four Wheels';
});

const handlePasswordChange = async () => {
    if (newPassword.value !== confirmNewPassword.value) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const res = await axios.put(`http://localhost:3000/fourwheels/auth/${route.params.username}`, {
            newPassword: newPassword.value
        });

        console.log('Password changed:', res.data);
        alert('Password successfully changed!');
        router.push('/fourwheels/login');
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 404) {
                alert('Username not found!');
            } else {
                console.error('An unexpected error occurred:', error);
                alert('An unexpected error occurred.');
            }
        } else {
            console.error('An unexpected error occurred:', error);
            alert('An unexpected error occurred.');
        }
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Reset Password</h1>
            <form>
                <div class="mb-6">
                    <label
                        class="block text-gray-700 text-sm font-bold mb-2"
                        for="password"
                    >
                        New Password
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="New Password"
                        v-model="newPassword"
                    />
                </div>
                <div class="mb-6">
                    <label
                        class="block text-gray-700 text-sm font-bold mb-2"
                        for="confirmNewPassword"
                    >
                        Confirm New Password
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirmNewPassword"
                        type="password"
                        placeholder="Confirm New Password"
                        v-model="confirmNewPassword"
                    />
                </div>
                <div class="flex items-center justify-between">
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click.prevent="handlePasswordChange"
                    >
                        Update Password
                    </button>
                    <router-link
                        to="/fourwheels/login"
                        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Finally remember password?
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>