import { createRouter, createWebHistory } from "vue-router";
import Login from '@/pages/Login.vue';
import Register from "@/pages/Register.vue";
import ForgotPasswordUsernamePrompt from "@/pages/ForgotPasswordUsernamePrompt.vue";
import ResetPassword from "@/pages/ResetPassword.vue";
import About from "@/pages/About.vue";
import Automakers from "@/pages/Automakers.vue";
import CreateAutomaker from "@/pages/CreateAutomaker.vue";
import EditAutomaker from "@/pages/EditAutomaker.vue";
import AutomakerDetail from "@/pages/AutomakerDetail.vue";
import Cars from "@/pages/Cars.vue";
import CreateCar from "@/pages/CreateCar.vue";
import EditCar from "@/pages/EditCar.vue";
import NotFound from "@/pages/NotFound.vue";
import CarDetail from "@/pages/CarDetail.vue";

const routes = [
    { path: '/fourwheels/login', component: Login },
    { path: '/fourwheels/register', component: Register },
    { path: '/fourwheels/forgot-password', component: ForgotPasswordUsernamePrompt },
    { path: '/fourwheels/forgot-password/:username', component: ResetPassword },

    // Automakers routes
    { path: '/fourwheels/automakers', component: Automakers },
    { path: '/fourwheels/automakers/create', component: CreateAutomaker },
    { path: '/fourwheels/automakers/edit/:id', component: EditAutomaker },
    { path: '/fourwheels/automakers/:id', component: AutomakerDetail },

    // Cars routes
    { path: '/fourwheels/cars', component: Cars },
    { path: '/fourwheels/cars/create', component: CreateCar },
    { path: '/fourwheels/cars/edit/:id', component: EditCar },
    { path: '/fourwheels/cars/:id', component: CarDetail },

    { path: '/fourwheels/about', component: About },
    { path: '/fourwheels', redirect: '/fourwheels/cars' },
    { path: '/fourwheels/:pathMatch(.*)*', component: NotFound }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;