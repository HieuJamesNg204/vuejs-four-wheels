<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/utils/errorHandler';

const auth = useAuthStore();

const automaker = ref({});

const router = useRouter();
const route = useRoute();

onMounted(async () => {
    document.title = 'Automaker Details - Four Wheels';
    const token = auth.token;
    if (!auth.isAuthenticated()) {
        alert('You need to log in to proceed');
        router.push('/fourwheels/login');
    } else {
        try {
            const id = route.params.id;
        
            const res = await axios.get(`http://localhost:3000/fourwheels/automakers/${id}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });
        
            console.log('Automaker:', res.data);
            automaker.value = res.data;
            document.title = `${automaker.value.name} - Four Wheels`;
        } catch (error) {
            handleApiError(error, auth, router);
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