import { createContext, useContext, useState } from "react";
import { useCookies }  from 'react-cookie';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [cookies] = useCookies(['currentUser']);
    const [tokenCookie] = useCookies(['access_token']);
    const [currentUser, setCurrentUser] = useState(cookies.currentUser || '');
    const [accessToken,setToken]  = useState(tokenCookie.access_token || '');
    const values = {
        currentUser,
        setCurrentUser,
        accessToken,
        setToken
    }

    return <UserContext.Provider value={values}>{children}</UserContext.Provider>
};

export const useUserContext = () => useContext(UserContext);