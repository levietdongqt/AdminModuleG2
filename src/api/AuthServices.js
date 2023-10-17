import axios from 'axios';
import  baseRequest  from '../contexts/AxiosContext';


export const Login = async (email, password)=>{
    console.log(`Email : ${email} - ${password}`)
    const isClient = false;
    const response = await baseRequest.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`,{
        email,
        password,
        isClient
    });
    return response;
};