import { createRouter, createWebHistory } from "vue-router";
import Login from '@/pages/Login.vue';
import Register from "@/pages/Register.vue";

const routes = [
    { path: '/fourwheels/login', component: Login },
    { path: '/fourwheels/register', component: Register },
    { path: '/', redirect: '/fourwheels/login' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;