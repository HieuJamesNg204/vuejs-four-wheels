<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
    <div class="not-found">
        <h1>404 :(</h1>
        <p>Oops! The page you are looking for doesn't exist</p>
        <button @click="router.back()" class="back-link">Go back</button>
    </div>
</template>

<style scoped>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    color: #555;
}

h1 {
    font-size: 6rem;
    color: #ff6b6b;
    margin: 0;
}

p {
    font-size: 1.5rem;
    margin: 1rem 0;
}

.back-link {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s;
}

.home-link:hover {
    background-color: #0056b3;
}
</style>