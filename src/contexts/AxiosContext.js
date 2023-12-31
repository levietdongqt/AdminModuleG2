import axios from 'axios';

const  GetToken = () => {
  // const [tokenCookie] = useCookies(['access_token']);
  // console.log(tokenCookie)
  const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [name, value] = cookie.split('=');
    acc[name] = value;
    return acc;
  }, {});
  const accessToken = cookies.accessToken;
  return accessToken;
}
const baseRequest = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
   // timeout: 5000, // Thời gian timeout cho mỗi yêu cầu
});
baseRequest.interceptors.request.use((config) =>{
  const token = GetToken();
  console.log(token);
  if(token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;    
});
export default baseRequest;