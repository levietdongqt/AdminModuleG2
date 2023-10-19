import  baseRequest  from '../contexts/AxiosContext';

export async function DeleteReview(id){
    try{
        const response = await baseRequest.delete(`${process.env.REACT_APP_API_BASE_URL}/Review/${id}`);
        return response;
    }catch(error){
        return error.response;
    }
}

export async function UpdateAllReview(reviews){
    try{
        const response = await baseRequest.put(`${process.env.REACT_APP_API_BASE_URL}/Review/UpdateAll`,reviews);
        return response;
    }catch(error){
        return error.response;
    }
}
