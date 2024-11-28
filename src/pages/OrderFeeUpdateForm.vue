<script setup>
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/utils/errorHandler';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const shippingFee = ref(0);
const orderId = ref(route.params.id);

const token = auth.token;

onMounted(async () => {
    document.title = `Update Order Fee - Four Wheels`;
    if (!auth.isAuthenticated()) {
        alert('You need to log in to proceed');
        router.push('/fourwheels/login');
    } else {
        try {
            const userRes = await axios.get('http://localhost:3000/fourwheels/auth', {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            if (userRes.data.role === 'customer') {
                alert('Sorry. You don\'t have permission to access this page.');
                router.back();
            }

            const orderRes = await axios.get(
                `http://localhost:3000/fourwheels/orders/${orderId.value}`,
                {
                    headers: {
                        'x-auth-token': `${token}`
                    }
                }
            );

            shippingFee.value = orderRes.data.shippingFee;
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
});

const handleUpdate = async () => {
    try {
        await axios.put(
            `http://localhost:3000/fourwheels/orders/${orderId.value}/feeUpdate`,
            {
                shippingFee: parseFloat(shippingFee.value)
            },
            {
                headers: {
                    'x-auth-token': `${token}`
                }
            }
        );

        alert('Fee updated!');
        router.back();
    } catch (error) {
        handleApiError(error, auth, router);
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Update Shipping Fee for Order ID {{ orderId }}</h1>
            <form>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb 2" for="shippingFee">
                        Shipping Fee
                    </label>
                    <input 
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id = "shippingFee"
                        type="text"
                        placeholder="Shipping fee"
                        v-model="shippingFee"
                    />
                </div>
                <div class="flex items-center">
                    <button 
                        class="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click.prevent="handleUpdate"   
                    >
                        Update Order Shipping Fee
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