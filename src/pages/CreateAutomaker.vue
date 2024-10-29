<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const text = ref('');

const token = localStorage.getItem('token');

onMounted(() => {
    if (!token) {
        alert('You need to log in to proceed');
        router.push('/fourwheels/login');
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
    
        console.log(res.data);
        alert('Automaker created');
        router.push('/fourwheels/automakers');
    } catch (error) {
        localStorage.setItem('username', '');
        alert('Session Expired! Please log in again to proceed!');
        router.push('/fourwheels/login');
    }
};
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Add Automaker</h1>
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
            <div class="flex items-center justify-between">
                <button 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
</template>