import axios from "axios";

// Create axios instance with configurations
const HttpService = axios.create({
    baseURL: "http://localhost:7000",
    timeout: 10000,
    headers: {
        'Authorization': "Bearer QlVfQUxWSU5BX05PXzE=",
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor
HttpService.interceptors.request.use(
    config => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
HttpService.interceptors.response.use(
    response => {
        console.log(`API Response: ${response.status} from ${response.config.url}`);
        return response;
    },
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout. Server might be down or unreachable.');
        } else if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(`Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default HttpService;