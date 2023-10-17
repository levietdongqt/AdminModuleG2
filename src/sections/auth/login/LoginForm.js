import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
// @mui
import { useToast } from '@chakra-ui/react';
import {Stack, IconButton, InputAdornment, TextField,Checkbox,Box,InputLabel,Typography} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import Iconify from '../../../components/iconify';
// components



import { useUserContext } from '../../../contexts/UserContext';
import LoginValidations from '../../../validations/LoginValidations';
import { Login as LogIn} from '../../../api/AuthServices';


// ----------------------------------------------------------------------

export default function LoginForm() {
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const {setCurrentUser,setToken } = useUserContext();
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
  const [tokenCookie, setTokenCookie, removeTokenCookie] = useCookies(['accessToken']);
  const navigate = useNavigate();
  const toast = useToast();
  const handldeResponse = (result,remember) => {
    if (result.data.status === 200) {
      console.log(result.data)
      setCurrentUser(result.data.result);
      setToken(result.data.token);
      toast({
        title: 'Logged in.',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      navigate('/app');
      if (remember) {
        setCookie('currentUser', result.data.result, { path: '/' });
        setTokenCookie('accessToken',result.data.token,{ path: '/' })
      } else {
        removeCookie('currentUser', { path: '/' });
        removeTokenCookie('accessToken',result.data.token,{ path: '/' })
      };
    } else {
      resetForm();
      toast({
        title: 'Error!',
        description: 'Wrong email or password.',
        status: 'error',
        duration: 2000,
        isClosable: true
      });
    }


  }
  const { values, handleSubmit, handleChange, isValid, resetForm } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      LogIn(values.email, values.password)
        .then((result) => {
          handldeResponse(result,remember);
        });
    },
    validationSchema: LoginValidations
  });

  return (
    <>
      <Stack spacing={3}>
        <TextField
            label="Email"
            name='email'
            placeholder='Enter Email'
            onChange={handleChange}
            value={values.email}
          />
        <TextField
           label="Password"
           name='password'
           type={show ? 'text' : 'password'}
           placeholder='Enter password'
           onChange={handleChange}
           value={values.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow(!show)} edge="end">
                  <Iconify icon={show ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box padding={'checkbox'} display="flex" alignItems="center">
         <Checkbox checked={remember} onChange={() => setRemember(!remember)}/>
         <Typography variant="body1" color={'GrayText'}>Remember Me?</Typography>
         </Box>
      </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
        Login
      </LoadingButton>
    </>
  );
}
