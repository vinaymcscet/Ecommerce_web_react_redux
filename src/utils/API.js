import { BASE_URL, BASIC_AUTH_KEY } from "./Constants";

const API_BASE_URL = BASE_URL;

const apiCall = async(url, method='GET', data=null, headers={}) => {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': BASIC_AUTH_KEY,
            ...headers
        },
        body: data ? JSON.stringify(data) : null,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if(!response.ok) throw new Error(`Error: ${response.statusText}`);

    return response.json();
}

export const GET = (url, headers) => apiCall(url, 'GET', null, headers);
export const POST = (url, data, headers) => apiCall(url, 'POST', data, headers);
export const PUT = (url, data, headers) => apiCall(url, 'PUT', data, headers);
export const DEL = (url, data, headers) => apiCall(url, 'DELETE', null, headers);