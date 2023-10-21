import  baseRequest  from '../contexts/AxiosContext';


export async function UpdateAllFeedBack(feedbacks){
    try{
        const response = await baseRequest.put(`${process.env.REACT_APP_API_BASE_URL}/FeedBack/UpdateAll`,feedbacks,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    }catch(error){
        return error.response;
    }
}

export async function GetFeedBacksByStatus(userId,isImportant){
    try{
        const response = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/FeedBack/GetByIsImportant?userId=${userId}&isImportant=${isImportant}`);
        return response;
    }catch(error){
        return error.response;
    }
}

export async function SendMail(email,subject,htmlhtmlMessage,type){
    try{
        const response = await baseRequest.post(`${process.env.REACT_APP_API_BASE_URL}/FeedBack/SendMail`,{
            email,
            subject,
            htmlhtmlMessage,
            type,
        });
        return response;
    }catch(error){
        return error.response;
    }
}