<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const automaker = ref({});

const router = useRouter();
const route = useRoute();

onMounted(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to log in to proceed');
        router.push('/fourwheels/login');
    }

    try {
        const id = route.params.id;
    
        const res = await axios.get(`http://localhost:3000/fourwheels/automakers/${id}`, {
            headers: {
                'x-auth-token': `${token}`
            }
        });
    
        console.log('Automaker:', res.data);
        automaker.value = res.data;
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 401) {
                alert('Session Expired! Please log in again to proceed!');
                auth.logout();
                router.push('/fourwheels/login');
            } else if (statusCode === 404) {
                alert('Automaker not found.');
                router.back();
            }
            else {
                console.error('An unexpected error occurred:', error);
                alert('An unexpected error occurred.');
                router.back();
            }
        } else {
            console.error('An unexpected error occurred:', error);
            alert('An unexpected error occurred.');
            router.back();
        }
    }
});
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold text-black mb-4 text-center">Automaker Details</h1>
            <div class="space-y-4">
                <div>
                    <label class="text-black font-semibold">Automaker ID:</label>
                    <p class="text-gray-800">{{ automaker._id }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Automaker Name:</label>
                    <p class="text-gray-800">{{ automaker.name }}</p>
                </div>
            </div>
            <button 
                @click="router.back()" 
                class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
            >
                Go Back
            </button>
        </div>
    </div>
</template>