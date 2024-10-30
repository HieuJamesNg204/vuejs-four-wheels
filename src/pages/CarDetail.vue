<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const car = ref({});

const router = useRouter();
const route = useRoute();

onMounted(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to log in to proceed');
        router.push('/fourwheels/login');
    }

    const id = route.params.id;

    const res = await axios.get(`http://localhost:3000/fourwheels/cars/${id}`, {
        headers: {
            'x-auth-token': `${token}`
        }
    });

    car.value = res.data;
});
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <img class="w-full h-48 object-cover" src="https://th.bing.com/th/id/OIP.Xl_dFGb88jRMmM8aWYPxoQHaHa?rs=1&pid=ImgDetMain" alt="Car image" />
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold text-black mb-4 text-center">{{ car.automaker.name }} {{ car.model }} {{ car.year }} - {{ car.price }} VND</h1>
            <div class="space-y-4">
                <div>
                    <label class="text-black font-semibold">Year of Manufacture:</label>
                    <p class="text-gray-800">{{ car.year }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Body Style:</label>
                    <p class="text-gray-800">{{ car.bodyStyle }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Colour:</label>
                    <p class="text-gray-800">{{ car.colour }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Engine Type:</label>
                    <p class="text-gray-800">{{ car.engineType }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Transmission:</label>
                    <p class="text-gray-800">{{ car.transmission }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Mileage:</label>
                    <p class="text-gray-800">{{ car.mileage }} km</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Seating Capacity:</label>
                    <p class="text-gray-800">{{ car.seatingCapacity }}</p>
                </div>
            </div>
        </div>
    </div>
</template>