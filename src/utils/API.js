import { BASE_URL } from "./Constants";

const API_BASE_URL = BASE_URL;

const jsonToFormData = (json, formData = new FormData(), parentKey = null) => {
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const value = json[key];
            const formKey = parentKey ? `${parentKey}[${key}]` : key;

            if (value instanceof Date) {
                formData.append(formKey, value.toISOString());
            } else if (typeof value === 'object' && !(value instanceof File)) {
                // Recursively call for nested objects and arrays
                jsonToFormData(value, formData, formKey);
            } else {
                formData.append(formKey, value);
            }
        }
    }

    return formData;
};

const apiCall = async(url, method='GET', data=null, headers={}) => {
    const config = {
        method,
        headers: {
            // 'Content-Type': 'application/json',
            //'Authorization': BASIC_AUTH_KEY,
            ...headers
        },
        // body: data ? JSON.stringify(data) : null,
        body: data ? jsonToFormData(data) : null,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    const responseData = await response.json();
    console.log("API response on API.js", responseData);

    if (!response.ok) {
        throw new Error(responseData.messages?.error || responseData.message);
    }
    return responseData;
}

export const GET = (url, headers) => apiCall(url, 'GET', null, headers);
export const POST = (url, data, headers) => apiCall(url, 'POST', data, headers);
export const PUT = (url, data, headers) => apiCall(url, 'PUT', data, headers);
export const DEL = (url, data, headers) => apiCall(url, 'DELETE', null, headers);