<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { handleApiError } from "@/utils/errorHandler";

const auth = useAuthStore();

const router = useRouter();

const automakers = ref([]);
const userRole = ref('');

const currentPage = ref(1);
const itemsPerPage = 10;

onMounted(async () => {
    document.title = 'Automakers - Four Wheels';
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to log in to proceed!');
        router.push('/fourwheels/login');
        return;
    } else {
        try {
            const userRes = await axios.get('http://localhost:3000/fourwheels/auth', {
                headers: {
                    'x-auth-token': `${token}`,
                },
            });

            userRole.value = userRes.data.role;

            const res = await axios.get('http://localhost:3000/fourwheels/automakers', {
                headers: {
                    'x-auth-token': `${token}`,
                },
            });

            console.log('Automakers:', res.data);
            automakers.value = res.data;
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
});

const totalPages = computed(() => Math.ceil(automakers.value.length / itemsPerPage));

const paginatedAutomakers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return automakers.value.slice(start, end);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const toFirst = () => {
    currentPage.value = 1;
};

const toLast = () => {
    currentPage.value = totalPages.value;
};

const createAutomaker = () => {
    router.push('/fourwheels/automakers/create');
};

const editAutomaker = (id) => {
    router.push(`/fourwheels/automakers/edit/${id}`);
};

const deleteAutomaker = async (id) => {
    const isConfirmed = confirm('Deleting this automaker may also delete its associated cars. Are you sure to proceed?');
    if (isConfirmed) {
        try {
            const res = await axios.delete(`http://localhost:3000/fourwheels/automakers/${id}`, {
                headers: {
                    'x-auth-token': `${localStorage.getItem('token')}`
                }
            });

            if (res.status === 204) {
                alert('Automaker successfully deleted!');
                automakers.value = automakers.value.filter(
                    (automaker) => automaker._id !== id
                );
            }
        } catch (error) {
            handleApiError(error, auth, router);
        }
    }
};

const viewAutomakerInfo = (id) => {
    router.push(`/fourwheels/automakers/${id}`);
};
</script>

<template>
    <div class="container mx-auto p-4">
        <div v-if="userRole === 'admin'" class="flex mb-4">
            <button class="btn-primary" @click="createAutomaker">
                Create Automaker
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-300 mb-2">
                <thead>
                    <tr>
                        <th class="py-2 px-4 text-left border-b">ID</th>
                        <th class="py-2 px-4 text-left border-b">Name</th>
                        <th class="py-2 px-4 text-left border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="automaker in paginatedAutomakers" :key="automaker._id">
                        <td class="py-2 px-4 border-b">{{ automaker._id }}</td>
                        <td class="py-2 px-4 border-b">{{ automaker.name }}</td>
                        <td class="py-2 px-4 border-b">
                            <button v-if="userRole === 'admin'" class="btn-edit" @click="editAutomaker(automaker._id)">
                                Edit
                            </button>
                            <button
                                v-if="userRole === 'admin'"
                                class="btn-delete"
                                @click="deleteAutomaker(automaker._id)"
                            >
                                Delete
                            </button>
                            <button
                                class="btn-details"
                                @click="viewAutomakerInfo(automaker._id)"
                            >
                                Details
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="totalPages > 1" class="text-center mb-4">
                <button 
                    @click="toFirst" 
                    :disabled="currentPage === 1" 
                    class="mr-1 px-2 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition ease-in-out duration-200"
                >
                    <<
                </button>
                <button 
                    @click="prevPage" 
                    :disabled="currentPage === 1" 
                    class="mr-4 px-2 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition ease-in-out duration-200"
                >
                    <
                </button>
                <span class="mr-4">Page {{ currentPage }} of {{ totalPages }}</span>
                <button 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages"
                    class=" mr-1 px-2 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition ease-in-out duration-200"
                >
                    >
                </button>
                <button 
                    @click="toLast" 
                    :disabled="currentPage === totalPages"
                    class="px-2 py-1 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition ease-in-out duration-200"
                >
                    >>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}

.btn-edit {
    @apply bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mx-1;
}

.btn-delete {
    @apply bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mx-1;
}

.btn-details {
    @apply bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mx-1;
}
</style>