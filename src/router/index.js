import { createRouter, createWebHistory } from "vue-router";
import Login from '@/pages/Login.vue';
import Register from "@/pages/Register.vue";
import About from "@/pages/About.vue";

const routes = [
    { path: '/fourwheels/login', component: Login },
    { path: '/fourwheels/register', component: Register },
    { path: '/fourwheels/about', component: About },
    { path: '/fourwheels', redirect: '/fourwheels/login' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;