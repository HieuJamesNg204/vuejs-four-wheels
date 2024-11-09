<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/utils/errorHandler';

const auth = useAuthStore();

const router = useRouter();

const automakers = ref([]);
const cars = ref([]);
const selectedAutomaker = ref('');
const userRole = ref('');

const minPrice = ref('');
const maxPrice = ref('');

const currentPage = ref(1);
const itemsPerPage = 8;

const token = localStorage.getItem('token');

onMounted(async () => {
    document.title = 'Car collection - Four Wheels';
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
            handleApiError(error, auth, router);
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
        currentPage.value = 1;
    } catch (error) {
        handleApiError(error, auth, router);
    }
};

const totalPages = computed(() => Math.ceil(cars.value.length / itemsPerPage));

const paginatedCars = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return cars.value.slice(start, end);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const toFirst = () => {
    currentPage.value = 1;
};

const toLast = () => {
    currentPage.value = totalPages.value;
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
        <div v-if="totalPages > 1" class="text-center mb-4">
            <button 
                @click="toFirst" 
                :disabled="currentPage === 1" 
                class="mr-1 px-2 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition ease-in-out duration-200"
            >
                <<
            </button>
            <button 
                @click="prevPage" 
                :disabled="currentPage === 1" 
                class="mr-4 px-2 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition ease-in-out duration-200"
            >
                <
            </button>
            <span class="mr-4">Page {{ currentPage }} of {{ totalPages }}</span>
            <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class=" mr-1 px-2 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition ease-in-out duration-200"
            >
                >
            </button>
            <button 
                @click="toLast" 
                :disabled="currentPage === totalPages"
                class="px-2 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition ease-in-out duration-200"
            >
                >>
            </button>
        </div>
        <div v-if="cars.length === 0" class="text-center">
            Our collection is empty for now, but our upcoming cars will be added shortly. So come back soon!
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Cards -->
            <div v-for="car in paginatedCars" :key="car._id" class="max-w-sm rounded overflow-hidden shadow-lg bg-gray-200">
                <img 
                    class="w-full h-48 object-cover" 
                    :src="`http://localhost:3000/${car.image}`" 
                    :alt="`${car.automaker.name} ${car.model} ${car.year}`" 
                />
                <div class="p-4">
                    <h2 class="font-bold text-xl mb-2">{{ car.automaker.name }} {{ car.model }}</h2>
                    <p class="text-gray-700 text-base">Year: {{ car.year }}</p>
                    <p class="text-gray-900 font-semibold mt-2"><strong>Price:</strong> £{{ car.price }}</p>
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