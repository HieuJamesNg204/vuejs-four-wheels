<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { handleApiError } from '@/utils/errorHandler';

const auth = useAuthStore();

const router = useRouter();
const route = useRoute();

const token = localStorage.getItem('token');

const car = ref({});
const user = ref({});

const address = ref('');
const city = ref('');
const postalCode = ref('');
const country = ref('');

const shippingAdress = ref({
    address: address.value,
    city: city.value,
    postalCode: postalCode.value,
    country: postalCode.value
});

onMounted(async () => {
    document.title = 'Order Form - Four Wheels';
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

            user.value = userRes.data;

            const userRole = user.value.role;

            if (userRole === 'admin') {
                alert('Sorry. This page is for customers only!');
                router.back();
                return;
            }

            const carRes = await axios.get(`http://localhost:3000/fourwheels/cars/${route.params.id}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            car.value = carRes.data;
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
});

const handleOrder = async () => {
    try {
        // const res = await axios.post('http://localhost:3000/fourwheels/orders', {
        //     car: car.value.id,
        //     shippingAddress: shippingAdress
        // }, {
        //     headers: {
        //         'x-auth-token': `${token}`
        //     }
        // });

        // console.log('Order created with status: ', res.status);
        // alert('Order created!');
        // router.push('/fourwheels/cars');
    } catch (error) {
        handleApiError(error, auth, router);
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-20xl bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold text-center mb-4">Order Form</h1>

            <div class="flex">
                <!-- Personal Details -->
                <div class="mr-20">
                    <img 
                        class="mr-4 w-full h-full rounded-lg object-cover" 
                        v-if="car.automaker"
                        :src="`http://localhost:3000/${car.image}`" 
                        :alt="`${car.automaker.name} ${car.model} ${car.year}`" 
                    />
                </div>

                <!-- Car and User Details -->
                <div class="mr-20">
                    <div class="mb-10">
                        <h2 class="text-xl font-bold mb-2">Car Details</h2>
                        <p v-if="car.automaker">
                            <strong>Model:</strong> {{ car.automaker.name }} {{ car.model }} {{ car.year }}
                        </p>
                        <p><strong>Price:</strong> £{{ car.price }}</p>
                        <p><strong>Body Style:</strong> {{ car.bodyStyle }}</p>
                        <p><strong>Colour:</strong> {{ car.colour }}</p>
                        <p><strong>Engine Type:</strong> {{ car.engineType }}</p>
                        <p><strong>Transmission:</strong> {{ car.transmission }}</p>
                        <p><strong>Mileage:</strong> {{ car.mileage }} km</p>
                        <p><strong>Seating Capacity:</strong> {{ car.seatingCapacity }} km</p>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold mb-2">User Details</h2>
                        <p><strong>Username:</strong> {{ user.username }}</p>
                        <p><strong>Phone Number:</strong> {{ user.phoneNumber }}</p>
                    </div>
                </div>

                <!-- Shipping Address Form -->
                <div>
                    <h2 class="text-xl font-bold mb-2">Shipping Address</h2>
                    <form>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
                                Address
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="address"
                                type="text"
                                placeholder="Address"
                                v-model="address"
                            >
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="city">
                                City
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="city"
                                type="text"
                                placeholder="City"
                                v-model="city"
                            >
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="postalCode">
                                Postal Code
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="postalCode"
                                type="text"
                                placeholder="Postal Code"
                                v-model="postalCode"
                            >
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-96 text-sm font-bold mb-2" for="country">
                                Country
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="country"
                                type="text"
                                placeholder="Country"
                                v-model="country"
                            >
                        </div>
                        <div class="flex items-center justify-between">
                            <button 
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                @click.prevent="handleOrder"
                            >
                                Proceed
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>