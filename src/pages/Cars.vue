<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const automakers = ref([]);
const cars = ref([]);
const selectedAutomaker = ref('');

onMounted(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to log in to proceed!');
        router.push('/fourwheels/login');
    }

    try {
        const automakerRes = await axios.get('http://localhost:3000/fourwheels/automakers', {
            headers: {
                'x-auth-token': `${token}`
            }
        });
    
        console.log('Automakers:', automakerRes.data);
        automakers.value = automakerRes.data;
    
        let carRes;
    
        if (selectedAutomaker.value === '') {
            carRes = await axios.get('http://localhost:3000/fourwheels/cars', {
                headers: {
                    'x-auth-token': `${token}`
                }
            });
        } else {
            carRes = await axios.get(`http://localhost:3000/fourwheels/cars/getByAutomaker/${selectedAutomaker.value}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });
        }
    
        console.log('Cars:', carRes.data);
        cars.value = carRes.data;
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

const createCar = () => {
    //
}

const editCar = (id) => {
    //
}

const deleteCar = (id) => {
    //
}

const viewCarInfo = (id) => {
    //
}
</script>

<template>
        <div class="container mx-auto py-10">
            <h1 class="text-3xl font-bold mb-6 text-center">Car Collection</h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <CarCard v-for="car in cars" :key="car.id" :car="car" />
            </div>
        </div>
</template>

<script>
import CarCard from './CarCard.vue';
</script>

<style scoped>
/* Optional styling for page layout */
</style>
