<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white">
        <img class="w-full h-48 object-cover" src="https://th.bing.com/th/id/OIP.Xl_dFGb88jRMmM8aWYPxoQHaHa?rs=1&pid=ImgDetMain" alt="Car image" />
        <div class="p-4">
            <h2 class="font-bold text-xl mb-2">{{ car.automaker.name }} {{ car.model }}</h2>
            <p class="text-gray-700 text-base">Year: {{ car.year }}</p>
            <p class="text-gray-900 font-semibold mt-2"><strong>Price:</strong> {{ car.price }} VND</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        car: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
/* Optional styles */
</style>
