<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/utils/errorHandler';

const auth = useAuthStore();
const router = useRouter();

const user = ref({});

const token = localStorage.getItem('token');

onMounted(async () => {
    document.title = 'User Details - Four Wheels';
    if (!token) {
        alert('You need to log in to proceed');
        router.push('/fourwheels/login');
    } else {
        try {
            const userRes = await axios.get('http://localhost:3000/fourwheels/auth', {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            user.value = userRes.data;
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
});

const updatePhone = () => {
    router.push(`/fourwheels/profile/update/${user.value._id}/phoneNumber`);
};

const updatePassword = () => {
    router.push(`/fourwheels/profile/update/${user.value._id}/password`);
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold text-black mb-4 text-center">User Details</h1>
            <div class="space-y-4">
                <div>
                    <label class="text-black font-semibold">User ID:</label>
                    <p class="text-gray-800">{{ user._id }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Username:</label>
                    <p class="text-gray-800">{{ user.username }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Phone Number:</label>
                    <p class="text-gray-800">{{ user.phoneNumber }}</p>
                </div>
            </div>
            <button 
                @click="updatePhone" 
                class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
            >
                Update phone number
            </button>
            <button
                @click="updatePassword"
                class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-200"
            >
                Update password
            </button>
            <button 
                @click="router.back()" 
                class="mt-3 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md transition duration-200"
            >
                Go Back
            </button>
        </div>
    </div>
</template>