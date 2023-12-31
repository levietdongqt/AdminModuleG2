import axios, { AxiosError } from "axios";
import  baseRequest  from '../contexts/AxiosContext';

export async function GetAllTemplate(page,dataPerPage,filterOn,filterQuery,sortBy,isAscending,status){
    let response;
    try{       
        const useDefaultSort = sortBy === 'name' && isAscending === true;
        const sortField = useDefaultSort ? 'name' : sortBy;
        if(sortField === 'name'){
            response = await GetAllTemplateAsync(page, dataPerPage, filterOn, filterQuery, sortField, useDefaultSort,status);
        }else{
            response = await GetAllTemplateAsync(page, dataPerPage, filterOn, filterQuery, sortField, isAscending,status);
        }       
        return response;
    }catch(error){
        return AxiosError.ERR_BAD_REQUEST;
    }
}

const GetAllTemplateAsync = async (page,dataPerPage,filterOn,filterQuery,sortBy,isAscending,status)=> {
    const response = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/Template?filterOn=${filterOn}&filterQuery=${filterQuery}&sortBy=${sortBy}&isAscending=${isAscending}&status=${status}&pageNumber=${page}&pageSize=${dataPerPage}`)
    return response;
}


export async function GetAllCategories(){
    try{
        const response = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/Category`);
        return response;
    }catch(error){
        return AxiosError.ERR_BAD_REQUEST;
    }
};

export async function GetAllSizes(){
    try{
        const response = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/Size`);
        return response;
    }catch(error){
        return AxiosError.ERR_BAD_REQUEST;
    }
};

export async function AddTemplate(formData){
    try{
        const response = await baseRequest.post(`${process.env.REACT_APP_API_BASE_URL}/Template`,formData,{
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
        const response = await baseRequest.delete(`${process.env.REACT_APP_API_BASE_URL}/Template/${id}`);
        return response;
    }catch(error){
        return error.response;
    }
}

export async function DeleteAllTemplate(array){
    try{
        const response = await baseRequest.put(`${process.env.REACT_APP_API_BASE_URL}/Template`,array);
        return response;
    }catch(error){
        return error.response;
    }
}

export async function GetTemplateById(id){
    try{
        const response = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/Template/${id}`);
        return response;
    }catch(error){
        return error.response;
    }
}

export async function UpdateTemplate(id,formData){
    try{
        const response = await baseRequest.put(`${process.env.REACT_APP_API_BASE_URL}/Template/${id}`,formData,{
            headers:{
                'Content-Type' : 'multipart/form-data',
            },
        });
        return response;
    }catch(error){
        return error.response;
    }
}

export async function AddSizeAsync(id,data){
    try{
        const response = await baseRequest.post(`${process.env.REACT_APP_API_BASE_URL}/Template/${id}/AddSize`,data);
        return response;
    }catch(error){
        return error.response;
    }
}

export async function DeleteImageById(id){
    try{
        const response = await baseRequest.delete(`${process.env.REACT_APP_API_BASE_URL}/Template/Image/${id}`);
        return response;
    }catch(error){
        return error.response;
    }
}
export async function DeleteImageAllById(arrayId){
    try{
        const response = await baseRequest.put(`${process.env.REACT_APP_API_BASE_URL}/Template/DeleteAllImages`,arrayId);
        return response;
    }catch(error){
        return error.response;
    }
}

