import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: 'http://10.10.0.216:4296', // Replace with your base URL
    timeout: 5000,                      // Set a timeout (in milliseconds)
    headers: {
        'Content-Type': 'application/json',
    },
});