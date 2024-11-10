import { BASE_URL } from "./Constants";
import { getTokensFromLocalStorage } from "./StorageTokens";

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

const apiCall = async(url, method='GET', data=null, headers={}, params = {}) => {
    const queryParams = params && Object.keys(params).length
        ? `?${new URLSearchParams(params).toString()}`
        : '';
    const fullUrl = `${API_BASE_URL}${url}${queryParams}`;
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
    if (
        url.toLowerCase().includes("logout") || 
        url.toLowerCase().includes("profile") ||
        url.toLowerCase().includes("changePassword") ||
        url.toLowerCase().includes("address")
    ) {
        const tokens = getTokensFromLocalStorage();
        config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }

    // const response = await fetch(`${API_BASE_URL}${url}`, config);
    const response = await fetch(fullUrl, config);
    
    const responseData = await response.json();
    console.log("API response on API.js", responseData);
    console.log("API response on API.js", !response.ok);

    if (!response.ok) {
        throw new Error(
            responseData?.messages?.message || 
            responseData?.message || 
            responseData?.messages?.device_type || 
            responseData?.messages?.otp ||
            responseData?.messages?.error ||
            responseData?.error ||
            responseData?.messages?.otp_key ||
            responseData?.messages?.confirm_password ||
            responseData?.messages?.profile_pic 
        );
    }
    return responseData;
}

export const GET = (url, data, headers, params = {}) => apiCall(url, 'GET', data, headers, params);
export const POST = (url, data, headers, params = {}) => apiCall(url, 'POST', data, headers, params);
export const PUT = (url, data, headers, params = {}) => apiCall(url, 'PUT', data, headers, params);
export const DEL = (url, headers, params = {}) => apiCall(url, 'DELETE', null, headers, params);