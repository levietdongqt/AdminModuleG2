import axios, { AxiosError } from "axios";

const apiClient = axios.create(
    {
        baseURL: 'https://localhost:5000'    }
);

  
const getToken = () => {
    return localStorage.getItem("token");
};

apiClient.interceptors.request.use((config) =>{
    const token = getToken();
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function LoginService(LoginRequestDTO){
    try{
        const response = await apiClient.post(`/api/Auth/Login`,LoginRequestDTO);
        return response;
    }catch(error){
        return error.response;
    }
};
export async function OAuth2Request(){
    try{
        console.log("Vooo OAuth")
        const response = await apiClient.get(`/api/auth/signin-google`,{
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
          });
        return response;
    }catch(error){
        return error.response;
    }
};
export async function TestAdmin(){
    try{
        const response = await apiClient.get(`/api/User/admins`);
        return response;
    }catch(error){
        return error.response;
    }
};
export async function GetAllRoles(){
    try{
        const response = await apiClient.get(`/api/Auth/Roles`);
        return response;
    }catch(error){
        return AxiosError.ERR_BAD_REQUEST;
    }
};

export async function RegisterService(RegisterRequestDTO){
    try{
        const response = await apiClient.post(`/api/Auth/Register`,RegisterRequestDTO);
        return response;
    }catch(error){
        return error.response;
    }
};

// export async function GetAllWalk(page,dataPerPage,filterOn,filterQuery,sortBy,isAscending){
//     let response;
//     try{       
//         if(filterOn === '' && filterQuery === ''){
//             if(sortBy === '' && isAscending === true){
//                 response = await GetAllWalkAsync(page,dataPerPage,null,null,'name',true);
//             }else{
//                 response = await GetAllWalkAsync(page,dataPerPage,null,null,sortBy,isAscending);
//             }          
//         }else{
//             if(sortBy === '' && isAscending === true){
//                 response = await GetAllWalkAsync(page,dataPerPage,filterOn,filterQuery,"name",true);
//             }else{
//                 response = await GetAllWalkAsync(page,dataPerPage,filterOn,filterQuery,sortBy,isAscending);
//             }          
//         }       
//         return response;
//     }catch(error){
//         return AxiosError.ERR_BAD_REQUEST;
//     }
// }

const GetAllWalkAsync = async (page,dataPerPage,filterOn,filterQuery,sortBy,isAscending)=> {
    const response = await apiClient.get(`/api/Walk?filterOn=${filterOn}&filterQuery=${filterQuery}&sortBy=${sortBy}&isAscending=${isAscending}&pageNumber=${page}&pageSize=${dataPerPage}`)
    return response;
}

