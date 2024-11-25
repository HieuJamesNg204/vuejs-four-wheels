<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/utils/errorHandler';

const auth = useAuthStore();

const router = useRouter();

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
const imagePath = ref('');

const token = localStorage.getItem('token');

onMounted(async () => {
    document.title = 'Add car - Four Wheels';
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
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
});

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imagePath.value = reader.result;
        }
        reader.readAsDataURL(file);
    }
};

const handleCreate = async () => {
    try {
        const formData = new FormData();
        formData.append('automaker', automaker.value);
        formData.append('model', model.value);
        formData.append('year', year.value);
        formData.append('bodyStyle', bodyStyle.value);
        formData.append('price', price.value);
        formData.append('colour', colour.value);
        formData.append('engineType', engineType.value);
        formData.append('transmission', transmission.value);
        formData.append('mileage', mileage.value);
        formData.append('seatingCapacity', seatingCapacity.value);
        formData.append('image', document.querySelector('input[type="file"]').files[0]);
        
        const res = await axios.post(
            'http://localhost:3000/fourwheels/cars',
            formData,
            {
                headers: {
                    'x-auth-token': `${token}`
                }
            }
        );

        console.log('Car created:', res.data);
        alert('Car created!');
        router.push('/fourwheels/cars');
    } catch (error) {
        handleApiError(error, auth, router);
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-5xl bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Add Car</h1>
            <form>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="automaker">
                        Automaker
                    </label>
                    <select v-model="automaker" name="automaker" id="automaker" class="w-full p-2 border border-gray-300 rounded" required>
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
                    >
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="transmission">
                        Transmission
                    </label>
                    <select v-model="transmission" name="transmission" id="transmission" class="w-full p-2 border border-gray-300 rounded" required>
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
                        required
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
                        required
                    >
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Car Image</label>
                    <img :src="imagePath" class="uploading-image" alt="Image Preview" v-if="imagePath" />
                    <input type="file" accept="image/*" @change="handleImageUpload" required>
                </div>
                <div class="flex items-center">
                    <button 
                        class="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click.prevent="handleCreate"   
                    >
                        Add car
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

<style scoped>
.uploading-image {
    display: flex;
}
</style>