import axios from "axios";
import auth from './authService';

const url = import.meta.env.VITE_APP_BACKEND_URL


axios.interceptors.response.use(null, error => {
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;
    if (!expectedError) console.log("Logging the error", error)
    return Promise.reject(error);
});

// calling protcted api
function setJwtHeaders() {
    let token = auth.getJWT();
    token = JSON.parse(token)
    return {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token?.token}`
        }
    };
}
export function setURL() {
    return url.concat('/api/v1/')
}

export function setFileURL() {
    return url
}


const instance = axios.create({
    baseURL: setURL(),
    headers: {
        'content-type': 'application/json',
        "Accept": "application/json",
        Authorization: auth.getCurrentUser()
    },
});
const http = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwtHeaders,
    setURL: setURL(),
    setFileURL: setFileURL(),
    instance: instance,
};
export default http;