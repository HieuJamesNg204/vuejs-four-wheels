<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const automakers = ref([]);

onMounted(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to log in to proceed!");
        router.push("/fourwheels/login");
    }

    try {
        const res = await axios.get("http://localhost:3000/fourwheels/automakers", {
        headers: {
            "x-auth-token": `${token}`,
        },
        });
        console.log("Automakers response:", res.data);
        automakers.value = res.data;
        console.log(res);
    } catch (error) {
        console.log("ERROR");
        localStorage.setItem("username", "");
        alert("Session Expiered! Please log in again to proceed!");
        router.push("/fourwheels/login");
    }
});

const createAutomaker = () => {
    router.push("/fourwheels/automakers/create");
};

const editAutomaker = (id) => {
    alert(`You'll soon be able to edit automaker with id ${id}`);
};

const deleteAutomaker = (id) => {
    alert(`You'll soon be able to delete automaker with id ${id}`);
};

const viewAutomakerInfo = (id) => {
    alert(`You'll soon be able to view automaker with id ${id}`);
};
</script>

<template>
    <div class="container mx-auto p-4">
        <div class="flex mb-4">
        <button class="btn-primary" @click="createAutomaker">
            Create Automaker
        </button>
        </div>

        <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300">
            <thead>
            <tr>
                <th class="py-2 px-4 border-b">ID</th>
                <th class="py-2 px-4 border-b">Name</th>
                <th class="py-2 px-4 border-b">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="automaker in automakers" :key="automaker._id">
                <td class="py-2 px-4 border-b">{{ automaker._id }}</td>
                <td class="py-2 px-4 border-b">{{ automaker.name }}</td>
                <td class="py-2 px-4 border-b">
                <button class="btn-edit" @click="editAutomaker(automaker._id)">
                    Edit
                </button>
                <button
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