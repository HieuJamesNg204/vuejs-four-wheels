<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');

const userErrorMessage = ref('');

onMounted(() => {
    document.title = 'Forgot password - Four Wheels';
});

const redirectToPasswordReset = async () => {
    if (username.value) {
        try {
            const res = await axios.get(`http://localhost:3000/fourwheels/auth/get/username`, {
                params: { username: username.value }
            });

            const user = res.data;
            router.push(`/fourwheels/forgot-password/${user._id}`);
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;

                if (statusCode === 404) {
                    userErrorMessage.value = 'User not found.';
                } else {
                    alert(error.response.data);
                }
            } else {
                alert('An unexpected network error occurred.');
            }
        }
    } else {
        userErrorMessage.value = 'Username is required.';
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-white p-4">
        <div class="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl text-center font-bold mb-4">Reset Password</h1>
            <form>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                        Username
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Username"
                        v-model="username"
                    />
                    <div v-if="userErrorMessage" class="text-red-500 text-sm">
                        {{ userErrorMessage }}
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        @click.prevent="redirectToPasswordReset"
                    >
                        Proceed
                    </button>
                    <router-link
                        to="/fourwheels/login"
                        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Finally remember password?
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>