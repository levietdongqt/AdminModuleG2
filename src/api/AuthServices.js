import axios from 'axios';
import bcrypt  from 'bcryptjs/dist/bcrypt';
import  baseRequest  from '../contexts/AxiosContext';



export const Login = async (email, password)=>{
    console.log(`Email22222 : ${email} - ${password}`)
    const salt = "$2a$10$tpe4SRcMCzhG0xHhUFAs1.";
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const isClient = false;
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`,{
        email,
        password:hashedPassword,
        isClient
    });
    return response;
};