<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const router = useRouter();

const text = ref('');

const token = localStorage.getItem('token');

onMounted(async () => {
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

            const userRole = userRes.data.role;

            if (userRole === 'customer') {
                alert('Sorry. You don\'t have permission to access this page.');
                router.back();
            }
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;

                if (statusCode === 401) {
                    alert('Session Expired! Please log in again to proceed!');
                    auth.logout();
                    router.push('/fourwheels/login');
                } else if (statusCode === 409) {
                    alert('It looks like an automaker with this name already exists.');
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
});

const handleCreate = async () => {
    try {
        const res = await axios.post(
            'http://localhost:3000/fourwheels/automakers', 
            {
                name: text.value
            },
            {
                headers: {
                    'x-auth-token': `${token}`
                }
            }
        );
    
        console.log('Automaker created:', res.data);
        alert('Automaker created!');
        router.push('/fourwheels/automakers');
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 401) {
                alert('Session Expired! Please log in again to proceed!');
                auth.logout();
                router.push('/fourwheels/login');
            } else if (statusCode === 400) {
                alert('Bad request. Please check your input.');
            } else {
                console.error('An unexpected error occurred:', error);
                alert('An unexpected error occurred.');
            }
        } else {
            console.error('An unexpected error occurred:', error);
            alert('An unexpected error occurred.');
        }
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Add Automaker</h1>
            <form>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb 2" for="name">
                        Name
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "name"
                        type="text"
                        placeholder="Automaker name"
                        v-model="text"
                    />
                </div>
                <div class="flex items-center">
                    <button 
                        class="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click.prevent="handleCreate"   
                    >
                        Add automaker
                    </button>
                    <button 
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click="router.back()"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>