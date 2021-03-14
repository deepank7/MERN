import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sports-app-back07.herokuapp.com'
})

export default api;