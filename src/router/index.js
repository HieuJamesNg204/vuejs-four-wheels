import { createRouter, createWebHistory } from "vue-router";
import Login from '@/pages/Login.vue';
import Register from "@/pages/Register.vue";
import About from "@/pages/About.vue";
import Automakers from "@/pages/Automakers.vue";
import CreateAutomaker from "@/pages/CreateAutomaker.vue";
import EditAutomaker from "@/pages/EditAutomaker.vue";
import AutomakerDetail from "@/pages/AutomakerDetail.vue";
import NotFound from "@/pages/NotFound.vue";

const routes = [
    { path: '/fourwheels/login', component: Login },
    { path: '/fourwheels/register', component: Register },

    // Automakers routes
    { path: '/fourwheels/automakers', component: Automakers },
    { path: '/fourwheels/automakers/create', component: CreateAutomaker },
    { path: '/fourwheels/automakers/edit/:id', component: EditAutomaker },
    { path: '/fourwheels/automakers/:id', component: AutomakerDetail },

    { path: '/fourwheels/about', component: About },
    { path: '/fourwheels', redirect: '/fourwheels/login' },
    { path: '/fourwheels/:pathMatch(.*)*', component: NotFound }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;