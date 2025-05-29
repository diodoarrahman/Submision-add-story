const BASE_URL = 'https://story-api.dicoding.dev/v1';  

async function registerUser({ name, email, password }) {  
    const response = await fetch(`${BASE_URL}/register`, {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({ name, email, password }),  
    });  
    return response.json();  
}  

async function loginUser({ email, password }) {  
    const response = await fetch(`${BASE_URL}/login`, {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({ email, password }),  
    });  
    return response.json();  
}  

async function getStories(token, { page = 1, size = 10, location = 0 } = {}) {  
    const response = await fetch(`${BASE_URL}/stories?page=${page}&size=${size}&location=${location}`, {  
        headers: {  
            'Authorization': `Bearer ${token}`  
        }  
    });  
    return response.json();  
}  

async function getStoryDetail(token, id) {  
    const response = await fetch(`${BASE_URL}/stories/${id}`, {  
        headers: {  
            'Authorization': `Bearer ${token}`  
        }  
    });  
    return response.json();  
}  

async function addStory(token, formData) {  
    const response = await fetch(`${BASE_URL}/stories`, {  
        method: 'POST',  
        headers: {  
            'Authorization': `Bearer ${token}`  
        },  
        body: formData  
    });  
    return response.json();  
}  

export {  
    registerUser,  
    loginUser,  
    getStories,  
    getStoryDetail,  
    addStory,  
    //...  
};  