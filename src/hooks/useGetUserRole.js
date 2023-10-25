import {useState, useEffect} from 'react';

import { getUserById } from '../api/UserServices';

const useGetUserRole = (userId) => {
    const [admin,setAdmin]=useState(false);

    useEffect(()=>{
        if(userId.id !== undefined){
            getUserById(userId.id)
        .then((result)=>{
            console.log(result.result.role);
            if(result.result.role === 'admin'){               
                setAdmin(true);              
            }else{
                setAdmin(false);
            }
            
        });
        }       
    },[userId]);
  return [admin];
}

export default useGetUserRole;