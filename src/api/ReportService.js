import  baseRequest  from '../contexts/AxiosContext';

export const TotalUsersInMonth = async () =>{
    const response = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/report/TotalByMonth`);
    return response;
  }

  export const GetFeedBack5News = async () =>{
    const response = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/report/5News`);
    return response;
  }

  export const GetPurchaseMonth = async () =>{
    const response = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/report/Purchase`);
    return response;
  }

  export const GetReport = async () =>{
    const response = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/report`);
    return response;
  }
  