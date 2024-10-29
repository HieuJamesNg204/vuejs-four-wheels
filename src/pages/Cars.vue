<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const cars = ref([]);

onMounted(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to log in to proceed!');
        router.push('/fourwheels/login');
    }

    const res = await axios.get('http://localhost:3000/fourwheels/cars', {
        headers: {
            'x-auth-token': `${token}`
        }
    });

    console.log('Cars response:', res.data);
    cars.value = res.data;
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