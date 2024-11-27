<script setup>
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/utils/errorHandler';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

const userErrorMessage = ref('');

const token = localStorage.getItem('token');

onMounted(() => {
    document.title = 'Reset password - Four Wheels';
    if (!token) {
        alert('You need to log in to proceed');
        router.push('/fourwheels/login');
    }
});

const handlePasswordChange = async () => {
    if (newPassword.value !== confirmNewPassword.value) {
        userErrorMessage.value = 'Passwords do not match';
    } else {
        try {
            const res = await axios.put(`http://localhost:3000/fourwheels/auth/${route.params.id}/passwords/update`, {
                currentPassword: currentPassword.value,
                newPassword: newPassword.value
            }, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            console.log('Password changed successfully with status code: ', res.status);
            alert('Password successfully changed!');
            router.push('/fourwheels/profile');
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Reset Password</h1>
            <form>
                <div class="mb-6">
                    <label
                        class="block text-gray-700 text-sm font-bold mb-2"
                        for="currentPassword"
                    >
                        Current Password
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="currentPassword"
                        type="password"
                        placeholder="Current Password"
                        v-model="currentPassword"
                    />
                </div>
                <div class="mb-6">
                    <label
                        class="block text-gray-700 text-sm font-bold mb-2"
                        for="newPassword"
                    >
                        New Password
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="newPassword"
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
                    <div v-if="userErrorMessage" class="text-red-500 text-sm">
                        {{ userErrorMessage }}
                    </div>
                </div>
                <div class="items-center justify-between">
                    <button
                        class="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click.prevent="handlePasswordChange"
                    >
                        Update Password
                    </button>
                    <button
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click="router.back"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>