import api from '../api/axios.js';

export const signupUser = (data) =>{
    return api.post('/auth/signup', data);
}

export const loginUser = (data) =>{
    return api.post('/auth/login', data, { withCredentials: true });
}

export const logoutUser = ()=>{
    return api.post('/auth/logout', {}, {withCredentials: true});
}

export const verifyOTPUser = (data) => {
    return api.post('/auth/verify-otp', data, { withCredentials: true });
}
