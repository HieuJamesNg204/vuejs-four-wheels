<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { handleApiError } from "@/utils/errorHandler";

const auth = useAuthStore();

const router = useRouter();

const automakers = ref([]);
const userRole = ref('');

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
            <table class="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th class="py-2 px-4 text-left border-b">ID</th>
                        <th class="py-2 px-4 text-left border-b">Name</th>
                        <th class="py-2 px-4 text-left border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="automaker in automakers" :key="automaker._id">
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