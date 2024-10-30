<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const token = localStorage.getItem('token');

onMounted(() => {
    name.value = localStorage.getItem('username');
});

const handleLogout = () => {
    localStorage.setItem('token', '');
    localStorage.setItem('username', '');
    name.value = '';
    router.push('/fourwheels/login');
};
</script>


<template>
    <nav class="bg-blue-500 p-4">
        <div class="container mx-auto flex justify-between items-center">
            <div class="text-white font-bold text-xl">
                <router-link :to="token? '/fourwheels/cars' : '/fourwheels/login'">Four Wheels</router-link>
            </div>
            <div class="text-white">
                <p v-if="name !== ''">Welcome  {{ name }}</p>
            </div>
            <div>
                <router-link to="/fourwheels/about" class="text-white mr-4">About</router-link>
                <router-link to="/fourwheels/automakers" class="text-white mr-4">Automakers</router-link>
                <button v-if="name !== ''" class="text-white mr-4" @click="handleLogout">Log out</button>
            </div>
        </div>
    </nav>
</template>