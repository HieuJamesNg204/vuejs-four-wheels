<script setup>
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/utils/errorHandler';
import axios from 'axios';
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const auth = useAuthStore();

const order = ref({});
const userRole = ref('');
const status = ref('');

const router = useRouter();
const route = useRoute();

const token = auth.token;

onMounted(async () => {
    document.title = 'Order Details - Four Wheels';
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
        
            userRole.value = userRes.data.role;

            const orderRes = await axios.get(`http://localhost:3000/fourwheels/orders/${route.params.id}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            order.value = orderRes.data;
            status.value = order.value.status;
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
});

const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy, HH:mm:ss');
};

const setStatus = async () => {
    if (status.value === 'delivered') {
        const isConfirmed = confirm(
            'You are marking this order as completed. '
            + 'Please make sure to confirm this once the ordered car has successfully delivered to the customer!'
        );

        if (!isConfirmed) {
            status.value = order.value.status;
            return;
        }
    }

    try {
        await axios.put(
            `http://localhost:3000/fourwheels/orders/${route.params.id}/statusUpdate`, 
            {
                status: status.value
            },
            {
                headers: {
                    'x-auth-token': `${token}`
                }
            }
        );

        if (status.value === 'delivered') {
            alert('The order has been successfully completed');
            router.push('/fourwheels/orders');
        }
    } catch (error) {
        handleApiError(error, auth, router);
    }
};

const updateFee = () => {
    router.push(`/fourwheels/orders/feeUpdate/${route.params.id}`);
};

const deleteOrder = async () => {
    const isConfirmed = confirm('Are you sure to delete this order? This action can\'t be undone.');
    if (isConfirmed) {
        try {
            const res = await axios.delete(`http://localhost:3000/fourwheels/orders/${route.params.id}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            if (res.status === 204) {
                alert('Order successfully deleted!');
                router.push('/fourwheels/orders');
            }
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
};

const viewCarDetails = (id) => {
    router.push(`/fourwheels/cars/${id}`);
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-3xl bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold text-black mb-4 text-center">
                Order ID: {{ order._id }}
            </h1>

            <div class="space-y-4 mb-2">
                <div>
                    <div class="flex flex-col items-center justify-center">
                        <img 
                            v-if="order.car"
                            class="mb-4 w-full rounded-lg object-cover" 
                            :src="`http://localhost:3000/${order.car.image}`" 
                            :alt="`${order.car.automaker.name} ${order.car.model} ${order.car.year}`" 
                        />
                        <div class="text-center font-semibold">
                            <p v-if="order.car" class="text-gray-800">
                                {{ order.car.automaker.name }} {{ order.car.model }} {{ order.car.year }}
                            </p>
                            <button class="btn-details" @click="viewCarDetails(order.car._id)">View Car Details</button>
                        </div>
                    </div>
                </div>
                <div v-if="userRole === 'admin'">
                    <label class="text-black font-semibold">Customer:</label>
                    <p v-if="order.user" class="text-gray-800">{{ order.user.username }} - {{ order.user.phoneNumber }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Order Date:</label>
                    <p v-if="order.orderDate" class="text-gray-800">{{ formatDate(order.orderDate) }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Shipping Address:</label>
                    <p v-if="order.shippingAddress" class="text-gray-800"> - Address: {{ order.shippingAddress.address }}</p>
                    <p v-if="order.shippingAddress" class="text-gray-800"> - City: {{ order.shippingAddress.city }}</p>
                    <p v-if="order.shippingAddress" class="text-gray-800"> - Postal Code: {{ order.shippingAddress.postalCode }}</p>
                    <p v-if="order.shippingAddress" class="text-gray-800"> - Country: {{ order.shippingAddress.country }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold mr-2">Status:</label>
                    <select 
                        v-if="userRole === 'admin' && order.status !== 'delivered'" 
                        v-model="status"
                        @change="setStatus"
                        name="statusSelect" 
                        id="statusSelect"
                        class="border px-2 py-1 rounded"
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipping">Shipping</option>
                        <option value="delivered">Delivered (Completed)</option>
                    </select>
                    <p v-if="userRole === 'customer' || order.status === 'delivered'" class="text-gray-800">{{ order.status }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Shipping Fee:</label>
                    <p class="text-gray-800">{{ order.shippingFee }}</p>
                </div>
                <div>
                    <label class="text-black font-semibold">Total Price:</label>
                    <p class="text-gray-800">{{ order.totalPrice }}</p>
                </div>
            </div>
            
            <div>
                <button v-if="userRole === 'admin' && order.status !== 'delivered'" class="btn-edit" @click="updateFee">
                    Update Fee
                </button>
                <button
                    v-if="userRole === 'admin' && order.status !== 'delivered'"
                    class="btn-delete"
                    @click="deleteOrder"
                >
                    Delete
                </button>
                <button class="btn-goback" @click="router.back()">Go Back</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-details {
    @apply bg-green-500 text-white mt-2 px-2 py-1 rounded hover:bg-green-600 mx-1;
}

.btn-delete {
    @apply bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mx-1;
}

.btn-edit {
    @apply bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mx-1;
}

.btn-goback {
    @apply bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 mx-1;
}
</style>