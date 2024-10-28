<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
        const carById = await axios.get(
            `http://localhost:3000/fourwheels/automakers/${route.params.id}`,
            {
                headers: {
                    'x-auth-token': token
                }
            }
        );

        text.value = carById.data.name;
    } catch (error) {
        alert('Automaker not found :(');
        router.push('/fourwheels/automakers');
    }
})

const handleEdit = async () => {
    try {
        const res = await axios.put(
            `http://localhost:3000/fourwheels/automakers/${route.params.id}`,
            {
                name: text.value
            },
            {
                headers: {
                    'x-auth-token': `${localStorage.getItem('token')}`
                }
            }
        );

        console.log(res.data);
        alert('Automaker updated');
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
        <h1 class="text-2xl font-bold mb-4">Edit Automaker</h1>
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
                    @click.prevent="handleEdit"   
                >
                    Update automaker
                </button>
                <button 
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    @click="router.push('/fourwheels/automakers')"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
</template>