<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/utils/errorHandler';

const auth = useAuthStore();

const name = ref('');

const route = useRoute();
const router = useRouter();

const token = auth.token;

onMounted(async () => {
    document.title = 'Edit automaker - Four Wheels';
    if (!auth.isAuthenticated()) {
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
                alert('Sorry. You don\'t have permission to access this page!');
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

            name.value = automakerRes.data.name;

            document.title = `Edit automaker ${name.value} - Four Wheels`;
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
});

const handleEdit = async () => {
    try {
        const res = await axios.put(
            `http://localhost:3000/fourwheels/automakers/${route.params.id}`,
            {
                name: name.value
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
        handleApiError(error, auth, router);
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
                        v-model="name"
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