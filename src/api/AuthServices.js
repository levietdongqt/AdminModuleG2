import axios from 'axios';


export const Login = async (email, password)=>{
    console.log(`Email : ${email} - ${password}`)
    const isClient = false;
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`,{
        email,
        password,
        isClient
    });
    return response;
};