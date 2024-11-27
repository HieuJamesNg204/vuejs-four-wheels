<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { handleApiError } from '@/utils/errorHandler';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const phoneNumber = ref('');

const token = localStorage.getItem('token');

onMounted(async () => {
    document.title = 'Update user phone - Four Wheels';
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

            phoneNumber.value = userRes.data.phoneNumber;
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
});

const handleEdit = async () => {
    try {
        const res = await axios.put(
            `http://localhost:3000/fourwheels/auth/${route.params.id}/phoneNumbers/update`,
            {
                phoneNumber: phoneNumber.value
            },
            {
                headers: {
                    'x-auth-token': `${token}`
                }
            }
        );

        console.log('Phone number updated with status: ', res.status);
        alert('Phone number updated!');
        router.push('/fourwheels/profile');
    } catch (error) {
        console.log(error);
        handleApiError(error, auth, router);
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Update Phone Number</h1>
            <form>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb 2" for="name">
                        Phone Number
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "name"
                        type="text"
                        placeholder="Automaker name"
                        v-model="phoneNumber"
                    />
                </div>
                <div class="flex items-center">
                    <button 
                        class="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click.prevent="handleEdit"   
                    >
                        Update
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