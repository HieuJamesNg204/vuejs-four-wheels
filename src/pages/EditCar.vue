<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const automakerList = ref([]);

const automaker = ref('');
const model = ref('');
const year = ref(0);
const bodyStyle = ref('');
const price = ref(0);
const colour = ref('');
const engineType = ref('');
const transmission = ref('');
const mileage = ref(0);
const seatingCapacity = ref(0);

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
            alert('Sorry. You don\'t have permission to access this page.');
            router.back();
        }

        const automakerRes = await axios.get('http://localhost:3000/fourwheels/automakers', {
            headers: {
                'x-auth-token': `${token}`
            }
        });
        
        automakerList.value = automakerRes.data;

        const carRes = await axios.get(
            `http://localhost:3000/fourwheels/cars/${route.params.id}`,
            {
                headers: {
                    'x-auth-token': `${token}`
                }
            }
        );

        automaker.value = carRes.data.automaker;
        model.value = carRes.data.model;
        year.value = carRes.data.year;
        bodyStyle.value = carRes.data.bodyStyle;
        price.value = carRes.data.price;
        colour.value = carRes.data.colour;
        engineType.value = carRes.data.engineType;
        transmission.value = carRes.data.transmission;
        mileage.value = carRes.data.mileage;
        seatingCapacity.value = carRes.data.seatingCapacity;
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 401) {
                alert('Session Expired! Please log in again to proceed!');
                auth.logout();
                router.push('/fourwheels/login');
            } else if (statusCode === 404) {
                alert('Car not found!');
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
            `http://localhost:3000/fourwheels/cars/${route.params.id}`,
            {
                automaker: automaker.value,
                model: model.value,
                year: year.value,
                bodyStyle: bodyStyle.value,
                price: price.value,
                colour: colour.value,
                engineType: engineType.value,
                transmission: transmission.value,
                mileage: mileage.value,
                seatingCapacity: seatingCapacity.value
            },
            {
                headers: {
                    'x-auth-token': `${token}`
                }
            }
        );

        console.log(res.data);
        alert('Car updated!');
        router.back();
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 401) {
                alert('Session Expired! Please log in again to proceed!');
                auth.logout();
                router.push('/fourwheels/login');
            } else if (statusCode === 404) {
                alert('Car not found!');
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
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-5xl bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Update Car</h1>
            <form>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="automaker">
                        Automaker
                    </label>
                    <select v-model="automaker" name="automaker" id="automaker" class="w-full p-2 border border-gray-300 rounded">
                        <option v-for="automaker in automakerList" :key="automaker._id" :value="automaker._id">
                            {{ automaker.name }}
                        </option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="model">
                        Model
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "model"
                        type="text"
                        placeholder="Car model"
                        v-model="model"
                    >
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="year">
                        Year
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "year"
                        type="number"
                        placeholder="Year of manufacture"
                        v-model="year"
                    >
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="bodyStyle">
                        Body Style (Sedan, Hatchback, etc)
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "bodyStyle"
                        type="text"
                        placeholder="Body Style (Sedan, Hatchback, etc)"
                        v-model="bodyStyle"
                    >
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
                        Price
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "price"
                        type="number"
                        placeholder="Price"
                        v-model="price"
                    >
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="colour">
                        Colour
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "colour"
                        type="text"
                        placeholder="Colour"
                        v-model="colour"
                    >
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="engineType">
                        Engine Type (Petrol, Diesel, etc)
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "engineType"
                        type="text"
                        placeholder="Engine Type (Petrol, Diesel, etc)"
                        v-model="engineType"
                    >
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="transmission">
                        Transmission
                    </label>
                    <select v-model="transmission" name="transmission" id="transmission" class="w-full p-2 border border-gray-300 rounded">
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="mileage">
                        Mileage In Kilometres
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "mileage"
                        type="number"
                        placeholder="Mileage In Kilometres"
                        v-model="mileage"
                    >
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="seatingCapacity">
                        Seating Capacity
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "seatingCapacity"
                        type="number"
                        placeholder="Seating Capacity"
                        v-model="seatingCapacity"
                    >
                </div>
                <div class="flex items-center">
                    <button 
                        class="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click.prevent="handleEdit"   
                    >
                        Update Car
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