<script setup>
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/utils/errorHandler';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const user = ref({})
const orders = ref([]);
const selectedStatus = ref('');
const userRole = ref('');

const token = localStorage.getItem('token');

onMounted(async () => {
    document.title = 'Current Orders - Four Wheels';
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

            userRole.value = user.value.role;
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
});

const fetchOrders = async () => {
    const url = 'http://localhost:3000/fourwheels/orders' 
        + (userRole === 'customer' ? `/users` : '')
        + (selectedStatus.value ? `?status=${selectedStatus.value}` : '');
    
    try {
        const orderRes = await axios.get(url, {
            headers: {
                'x-auth-token': `${token}`
            }
        });
        
        orders.value = orderRes.data;
    } catch (error) {
        handleApiError(error, auth, router);
    }
}
</script>

<template></template>