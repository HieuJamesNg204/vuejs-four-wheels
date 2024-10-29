<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const automakers = ref([]);
const cars = ref([]);
const selectedAutomaker = ref('');

onMounted(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to log in to proceed!');
        router.push('/fourwheels/login');
    }

    try {
        const automakerRes = await axios.get('http://localhost:3000/fourwheels/automakers', {
            headers: {
                'x-auth-token': `${token}`
            }
        });
    
        console.log('Automakers:', automakerRes.data);
        automakers.value = automakerRes.data;
    
        let carRes;
    
        if (selectedAutomaker.value === '') {
            carRes = await axios.get('http://localhost:3000/fourwheels/cars', {
                headers: {
                    'x-auth-token': `${token}`
                }
            });
        } else {
            carRes = await axios.get(`http://localhost:3000/fourwheels/cars/getByAutomaker/${selectedAutomaker.value}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });
        }
    
        console.log('Cars:', carRes.data);
        cars.value = carRes.data;
    } catch (error) {
        console.log('Error');
    }
});

const createCar = () => {
    //
}

const editCar = (id) => {
    //
}

const deleteCar = (id) => {
    //
}

const viewCarInfo = (id) => {
    //
}
</script>

<template>
    <div class="car-list">
        <h1>Used Car Collection</h1>

        <label for="automaker-select">Select Automaker</label>
        <select name="automaker-select" id="automaker-select" v-model="selectedAutomaker">
            <option value="">All</option>
            <option v-for="automaker in automakers" :key="automaker._id" :value="automaker._id">
                {{ automaker.name }}
            </option>
        </select>

        <div class="car-grid">
            <div v-for="car in cars" :key="car._id" class="car-card">
                <img src="https://cdn0.iconfinder.com/data/icons/cars-c/512/Car1-1024.png" alt="Car image" class="car-image" />
                <div class="car-details">
                    <h3>{{ car.automaker.name }} {{ car.model }}</h3>
                    <p>Year: {{ car.year }}</p>
                    <p><strong>Price</strong>: ${{ car.price }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.car-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.car-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.car-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* .car-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
} */

h1 {
  text-align: center;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

select {
  padding: 8px;
  font-size: 1em;
  margin-bottom: 20px;
  display: block;
  width: 100%;
  max-width: 200px;
}
</style>