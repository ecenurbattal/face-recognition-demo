import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8080/',
});

export const getDescriptions = () => {
    return instance.get('/users');
}

export const createDescription = (user) => {
    return instance.post(`/users`,user)
}