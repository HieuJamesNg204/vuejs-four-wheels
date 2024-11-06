<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const text = ref('');

const route = useRoute();
const router = useRouter();

const token = localStorage.getItem('token');

onMounted(async () => {
    if (!token) {
        alert('You need to log in to proceed');
        router.push('/fourwheels/login');
    }

    try {
        const userRes = await axios.get('http://localhost:3000/fourwheels/auth', {
            headers: {
                'x-auth-token': `${token}`
            }
        });

        const userRole = userRes.data.role;

        if (userRole === 'customer') {
            alert('Sorry. you don\'t have permission to access this page :(');
            router.back();
        }

        const automakerRes = await axios.get(
            `http://localhost:3000/fourwheels/automakers/${route.params.id}`,
            {
                headers: {
                    'x-auth-token': `${token}`
                }
            }
        );

        text.value = automakerRes.data.name;
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 401) {
                alert('Session Expired! Please log in again to proceed!');
                auth.logout();
                router.push('/fourwheels/login');
            } else if (statusCode === 404) {
                alert('Automaker not found!');
                router.back();
            } else {
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

const handleEdit = async () => {
    try {
        const res = await axios.put(
            `http://localhost:3000/fourwheels/automakers/${route.params.id}`,
            {
                name: text.value
            },
            {
                headers: {
                    'x-auth-token': `${token}`
                }
            }
        );

        console.log(res.data);
        alert('Automaker updated!');
        router.push('/fourwheels/automakers');
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 401) {
                alert('Session Expired! Please log in again to proceed!');
                auth.logout();
                router.push('/fourwheels/login');
            } else if (statusCode === 404) {
                alert('Automaker not found!');
                router.back();
            } else if (statusCode === 409) {
                alert('It looks like the new name for the automaker is coincident to another existing one');
            } else {
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
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Update Automaker</h1>
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
                        @click.prevent="handleEdit"   
                    >
                        Update automaker
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