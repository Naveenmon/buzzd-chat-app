import axios from "axios";
const baseURL = import.meta.env.BASE_URL

export const axiosInstanace = axios.create({
    baseURL:baseURL,
    withCredentials: true
})