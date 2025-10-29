import {authClient} from "@/lib/auth-client";
import axios from "axios";
import {Configuration, LocationApi, LocationProductApi, ProductApi} from "@/generated-api";

const axiosInstance = axios.create({
    timeout: 3 * 60 * 1000,
    timeoutErrorMessage: "timeout",
});

axiosInstance.interceptors.request.use((config) => {
    const cookie = authClient.getCookie();
    if (cookie) {
        config.headers.Cookie = cookie;
    } else {
        delete config.headers.Cookie;
    }
    return config;
});

const configuration = new Configuration();

export const api = {
    location: new LocationApi(configuration, process.env.EXPO_PUBLIC_API_URL, axiosInstance),
    product: new ProductApi(configuration, process.env.EXPO_PUBLIC_API_URL, axiosInstance),
    locationProduct: new LocationProductApi(configuration, process.env.EXPO_PUBLIC_API_URL, axiosInstance),
};