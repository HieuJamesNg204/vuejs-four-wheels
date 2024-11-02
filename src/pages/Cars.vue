<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const automakers = ref([]);
const cars = ref([]);
const selectedAutomaker = ref('');
const userRole = ref('');

const token = localStorage.getItem('token');

onMounted(async () => {
    if (!token) {
        alert('You need to log in to proceed!');
        router.push('/fourwheels/login');
    }

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
                localStorage.setItem('token', '');
                localStorage.setItem('username', '');
                alert('Session Expired! Please log in again to proceed!');
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
});

const fetchCars = async () => {
    const carRes = await axios.get(
        selectedAutomaker.value
            ? `http://localhost:3000/fourwheels/cars/getByAutomaker/${selectedAutomaker.value}`
            : 'http://localhost:3000/fourwheels/cars',
        {
            headers: {
                'x-auth-token': `${token}`
            }
        }
    );

    console.log('Cars:', carRes.data);
    cars.value = carRes.data;
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
        <div v-if="userRole === 'admin'" class="flex mb-4">
            <button class="btn-primary" @click="createCar">
                Create Car
            </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Cards -->
            <div v-for="car in cars" :key="car._id" class="max-w-sm rounded overflow-hidden shadow-lg bg-gray-200">
                <img class="w-full h-48 object-cover" src="https://www.toyota.com.vn//Resources/Images/011DEA3A01BBE6EFEEB74DCB69E50997.png" alt="Car image" />
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