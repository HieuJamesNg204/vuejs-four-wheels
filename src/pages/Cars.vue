<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const router = useRouter();

const automakers = ref([]);
const cars = ref([]);
const selectedAutomaker = ref('');
const userRole = ref('');

const minPrice = ref('');
const maxPrice = ref('');

const token = localStorage.getItem('token');

onMounted(async () => {
    if (!token) {
        alert('You need to log in to proceed!');
        router.push('/fourwheels/login');
    } else {
        try {
            const userRes = await axios.get('http://localhost:3000/fourwheels/auth', {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            userRole.value = userRes.data.role;

            const automakerRes = await axios.get('http://localhost:3000/fourwheels/automakers', {
                headers: {
                    'x-auth-token': `${token}`
                }
            });
        
            console.log('Automakers:', automakerRes.data);
            automakers.value = automakerRes.data;

            fetchCars();
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;

                if (statusCode === 401) {
                    alert('Session Expired! Please log in again to proceed!');
                    auth.logout();
                    router.push('/fourwheels/login');
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

const fetchCars = async () => {
    let url = 'http://localhost:3000/fourwheels/cars' 
        + (selectedAutomaker.value ? `/getByAutomaker/${selectedAutomaker.value}` : '');
    
    if (minPrice.value && maxPrice.value) {
        url += `?minPrice=${minPrice.value}&maxPrice=${maxPrice.value}`;
    } else if (minPrice.value) {
        url += `?minPrice=${minPrice.value}`;
    } else if (maxPrice.value) {
        url += `?maxPrice=${maxPrice.value}`;
    }

    try {
        let carRes = await axios.get(url, {
            headers: {
                'x-auth-token': `${token}`
            }
        });
    
        console.log('Cars:', carRes.data);
        cars.value = carRes.data;
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 401) {
                alert('Session Expired! Please log in again to proceed!');
                auth.logout();
                router.push('/fourwheels/login');
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

const createCar = () => {
    router.push('/fourwheels/cars/create');
};

const viewCarInfo = (id) => {
    router.push(`/fourwheels/cars/${id}`);
};
</script>

<template>
    <div class="container mx-auto py-10">
        <h1 class="text-3xl font-bold mb-6 text-center">Car Collection</h1>
        <div class="flex mb-2">
            <h3 class="text-lg font-bold">Filter Cars by Automaker</h3>
        </div>
        <div class="flex mb-8">
            <select 
                v-model="selectedAutomaker"
                @change="fetchCars"
                name="automakerSelect" 
                id="automakerSelect"
                class="border px-2 py-1 rounded"
            >
                <option value="">All Automakers</option>
                <option v-for="automaker in automakers" :key="automaker._id" :value="automaker._id">
                    {{ automaker.name }}
                </option>
            </select>
        </div>

        <div class="flex mb-2">
            <h3 class="text-lg font-bold mb-2">Filter by Price Range (Enter at least one input, and leaving both empty will show all prices)</h3>
        </div>
        <div class="flex mb-8">
            <form class="flex items-center space-x-4">
                <div class="flex items-center">
                    <label for="minPrice" class="mr-2">Min:</label>
                    <input
                        type="number"
                        id="minPrice"
                        v-model="minPrice"
                        placeholder="Minimum price"
                        class="border px-2 py-1 rounded w-64"
                    />
                </div>
                <div class="flex items-center">
                    <label for="maxPrice" class="mr-2">Max:</label>
                    <input
                        type="number"
                        id="maxPrice"
                        v-model="maxPrice"
                        placeholder="Maximum price"
                        class="border px-2 py-1 rounded w-64"
                    />
                </div>
                <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    @click="fetchCars"
                >
                    Filter
                </button>
            </form>
        </div>

        <div v-if="userRole === 'admin'" class="flex mb-4">
            <button class="btn-primary" @click="createCar">
                Create Car
            </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Cards -->
            <div v-for="car in cars" :key="car._id" class="max-w-sm rounded overflow-hidden shadow-lg bg-gray-200">
                <img 
                    class="w-full h-48 object-cover" 
                    :src="`http://localhost:3000/${car.image}`" 
                    :alt="`${car.automaker.name} ${car.model} ${car.year}`" 
                />
                <div class="p-4">
                    <h2 class="font-bold text-xl mb-2">{{ car.automaker.name }} {{ car.model }}</h2>
                    <p class="text-gray-700 text-base">Year: {{ car.year }}</p>
                    <p class="text-gray-900 font-semibold mt-2"><strong>Price:</strong> {{ car.price }} VND</p>
                </div>

                <div class="ml-3 mb-3">
                    <button
                        class="btn-details"
                        @click="viewCarInfo(car._id)"
                    >
                        Details
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}

.btn-details {
    @apply bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mx-1;
}
</style>