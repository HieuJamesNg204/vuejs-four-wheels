<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const car = ref({});
const userRole = ref('');

const router = useRouter();
const route = useRoute();

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
    
        userRole.value = userRes.data.role;
    
        const id = route.params.id;
    
        const res = await axios.get(`http://localhost:3000/fourwheels/cars/${id}`, {
            headers: {
                'x-auth-token': `${token}`
            }
        });
    
        car.value = res.data;
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

const editCar = (id) => {
    router.push(`/fourwheels/cars/edit/${id}`);
};

const deleteCar = async (id) => {
    const isConfirmed = confirm('Are you sure to delete this car? This action can\'t be undone.');
    if (isConfirmed) {
        try {
            const res = await axios.delete(`http://localhost:3000/fourwheels/cars/${id}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });
    
            if (res.status === 204) {
                alert('Car successfully deleted!');
                router.push('/fourwheels/cars');
            }
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
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <img 
            class="mr-4 w-full h-full rounded-lg object-cover" 
            src="https://www.toyota.com.vn//Resources/Images/011DEA3A01BBE6EFEEB74DCB69E50997.png" 
            alt="Car image" 
        />
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 v-if="car.automaker" class="text-2xl font-bold text-black mb-4 text-center">
                {{ car.automaker.name }} {{ car.model }} {{ car.year }} - {{ car.price }} VND
            </h1>
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
            
            <div class="ml-3 mb-3">
                <button v-if="userRole === 'admin'" class="btn-edit" @click="editCar(car._id)">
                    Edit
                </button>
                <button
                    v-if="userRole === 'admin'"
                    class="btn-delete"
                    @click="deleteCar(car._id)"
                >
                    Delete
                </button>
                <button class="btn-goback" @click="router.back()">Go Back</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-edit {
    @apply bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mx-1;
}

.btn-delete {
    @apply bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mx-1;
}

.btn-goback {
    @apply bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 mx-1;
}
</style>