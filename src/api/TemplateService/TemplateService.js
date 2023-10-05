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

export async function GetAllTemplate(page,dataPerPage,filterOn,filterQuery,sortBy,isAscending){
    let response;
    try{       
        const useDefaultSort = sortBy === 'name' && isAscending === true;
        const sortField = useDefaultSort ? 'name' : sortBy;

        response = await GetAllTemplateAsync(page, dataPerPage, filterOn, filterQuery, sortField, useDefaultSort);
        return response;
    }catch(error){
        return AxiosError.ERR_BAD_REQUEST;
    }
}

const GetAllTemplateAsync = async (page,dataPerPage,filterOn,filterQuery,sortBy,isAscending)=> {
    const response = await apiClient.get(`/api/Template?filterOn=${filterOn}&filterQuery=${filterQuery}&sortBy=${sortBy}&isAscending=${isAscending}&pageNumber=${page}&pageSize=${dataPerPage}`)
    return response;
}


export async function GetAllCategories(){
    try{
        const response = await apiClient.get(`api/Category`);
        return response;
    }catch(error){
        return AxiosError.ERR_BAD_REQUEST;
    }
};

export async function GetAllSizes(){
    try{
        const response = await apiClient.get(`api/Size`);
        return response;
    }catch(error){
        return AxiosError.ERR_BAD_REQUEST;
    }
};

export async function AddTemplate(formData){
    try{
        const response = await apiClient.post(`/api/Template`,formData,{
            headers:{
                'Content-Type' : 'multipart/form-data',
            },
        });
        return response;
    }catch(error){
        return error.response;
    }
}

export async function DeleteTemplate(id){
    try{
        const response = await apiClient.delete(`/api/Template/${id}`);
        return response;
    }catch(error){
        return error.response;
    }
}

export async function DeleteAllTemplate(array){
    try{
        const response = await apiClient.put(`/api/Template`,array);
        return response;
    }catch(error){
        return error.response;
    }
}


