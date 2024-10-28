<script setup>
import { ref } from 'vue';


const name = ref('')

const localName = localStorage.getItem('username');

name.value = localName;

</script>


<template>
    <nav class="bg-blue-500 p-4">
        <div class="container mx-auto flex justify-between items-center">
            <div class="text-white font-bold text-xl">Four Wheels</div>
            <div class="text-white">
                <p v-if="name !== '' ">Welcome  {{ name }}</p>
            </div>
            <div>
                <router-link to="/fourwheels" class="text-white mr-4">Home</router-link>
                <router-link to="/fourwheels/about" class="text-white">About</router-link>
            </div>
        </div>
    </nav>
</template>