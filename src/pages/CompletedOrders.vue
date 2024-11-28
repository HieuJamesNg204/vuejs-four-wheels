<script setup>
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/utils/errorHandler';
import axios from 'axios';
import { format } from 'date-fns';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const user = ref({});
const orders = ref([]);
const userRole = ref('');

const itemsPerPage = 8;
const currentPage = ref(1);

const token = auth.token;

onMounted(async () => {
    document.title = 'Current Orders - Four Wheels';
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

            user.value = userRes.data;

            userRole.value = user.value.role;
            fetchOrders();
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
});

const fetchOrders = async () => {
    const url = 'http://localhost:3000/fourwheels/orders' 
        + (userRole.value === 'customer' ? `/users` : '')
        + '?status=delivered';
    
    try {
        const orderRes = await axios.get(url, {
            headers: {
                'x-auth-token': `${token}`
            }
        });
        
        orders.value = orderRes.data;
        currentPage.value = 1;
    } catch (error) {
        handleApiError(error, auth, router);
    }
};

const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage));

const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return orders.value.slice(start, end);
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

const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy, HH:mm:ss');
};

const viewCurrentOrders = () => {
    router.push('/fourwheels/orders');
};

const viewOrderDetails = (id) => {
    router.push(`/fourwheels/orders/${id}`);
};
</script>

<template>
    <div class="container mx-auto py-10">
        <h1 class="text-3xl font-bold mb-6 text-center">Order History</h1>

        <div class="text-center mb-8">
            <button 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                @click="viewCurrentOrders"
            >
                Go to current orders
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
        <div v-if="orders.length === 0" class="text-center">
            <p v-if="userRole === 'admin'">There are no orders at the moment.</p>
            <p v-if="userRole === 'customer'">
                You haven't placed an order before. Continue browsing our collection and order the car as you wish.
            </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
            <!-- Cards -->
            <div v-for="order in paginatedOrders" :key="order._id" class="max-w-full rounded overflow-hidden shadow-lg bg-gray-200">
                <div class="flex p-4">
                    <div class="mr-4">
                        <img 
                            class="w-full h-full rounded object-cover" 
                            :src="`http://localhost:3000/${order.car.image}`" 
                            :alt="`${order.car.automaker.name} ${order.car.model} ${order.car.year}`" 
                        />
                    </div>
                    <div>
                        <h2 class="font-bold text-xl mb-2">Order ID: {{ order._id }}</h2>
                        <p v-if="userRole === 'admin'" class="text-gray-700 text-base">Customer: {{ order.user.username }}</p>
                        <p class="text-gray-700 text-base">
                            Ordered Car: {{ order.car.automaker.name }} {{ order.car.model }} {{ order.car.year }}
                        </p>
                        <p class="text-gray-700 text-base">Order Date: {{ formatDate(order.orderDate) }}</p>
                        <p class="text-gray-900 font-semibold mt-2"><strong>Status:</strong> {{ order.status }}</p>
                        <p class="text-gray-900 font-semibold mt-2"><strong>Shipping Fee:</strong> £{{ order.shippingFee }}</p>
                        <p class="text-gray-900 font-semibold mt-2"><strong>Total:</strong> £{{ order.totalPrice }}</p>
                        <button
                            class="btn-details"
                            @click="viewOrderDetails(order._id)"
                        >
                            Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-details {
    @apply bg-green-500 text-white mt-2 px-2 py-1 rounded hover:bg-green-600 mx-1;
}
</style>