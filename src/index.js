import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { GoogleOAuthProvider } from '@react-oauth/google';
//
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bcryptjs/dist/bcrypt';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';


import { UserProvider } from './contexts/UserContext';


// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
<GoogleOAuthProvider clientId="349595782448-43gvctriiege3k72basdtv2qhu3f1nbq.apps.googleusercontent.com"><UserProvider><CookiesProvider><App /></CookiesProvider></UserProvider></GoogleOAuthProvider>);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
