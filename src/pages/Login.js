import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { styled } from '@mui/material/styles';
import { Box, FormControl, FormLabel, InputGroup, Input, Text, InputRightElement, Button, Checkbox, useToast } from '@chakra-ui/react';
import { Stack,TextField,InputLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';

import { useUserContext } from '../contexts/UserContext';
import LoginValidations from '../validations/LoginValidations';
import { Login as LogIn} from '../api/AuthServices';

const Login = () => {
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const {setCurrentUser,setToken } = useUserContext();
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
  const [tokenCookie, setTokenCookie, removeTokenCookie] = useCookies(['accessToken']);
  const navigate = useNavigate();
  const toast = useToast();
  const handldeResponse = (result,remember) => {
    if (result.data.status === 200 && result.data.role === 'admin') {
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
      if (remember && result.data.role === 'admin') {
        setCookie('currentUser', result.data.result, { path: '/app' });
        setTokenCookie('accessToken',result.data.token,{ path: '/app' })
      } else {
        removeCookie('currentUser', { path: '/app' });
        removeTokenCookie('accessToken',result.data.token,{ path: '/app' })
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
    <Stack
      display='flex'
      justifyContent='center'
      alignItems='center'
      width='100vw'
      height='75vh'
    >
      <Box width={{ base: '100vw', sm: '500px' }} p={2}>
        <Text textAlign='center' color={'facebook.500'} fontSize={32} fontWeight={600} mb={10} >Login</Text>
        <FormControl mt={3} >
          <InputLabel fontSize={20} >Email</InputLabel>
          <TextField
            name='email'
            placeholder='Enter Email'
            onChange={handleChange}
            value={values.email}
          />
        </FormControl>
        <FormControl mt={3}>
          <InputLabel fontSize={20} >Password</InputLabel>
          <InputGroup size='md'>
            <TextField
              name='password'
              pr='4.5rem'
              type={show ? 'text' : 'password'}
              placeholder='Enter password'
              onChange={handleChange}
              value={values.password}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' variant='ghost' onClick={() => setShow(!show)}>
                {show ? <VisibilityOff /> : <Visibility />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Checkbox value={remember} onChange={() => setRemember(!remember)} mt={5} >Remember me</Checkbox>
        <Button mt={5} width='100%' variant='solid' colorScheme='facebook' disabled={!isValid} onClick={handleSubmit} >Login</Button>
        <br />
      </Box>
    </Stack>
  )
}

export default Login;