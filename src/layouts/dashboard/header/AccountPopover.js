import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Button,Tooltip } from '@mui/material';

import { useToast } from '@chakra-ui/react';
import LogoutIcon from '@mui/icons-material/Logout';
import Iconify from '../../../components/iconify';
import  UserDetails  from '../../../sections/@dashboard/user/UserDetails';

// mocks_

import { useUserContext } from '../../../contexts/UserContext';


// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { currentUser } = useUserContext();
  const [open, setOpen] = useState(null);
  const { setCurrentUser, setToken } = useUserContext();
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
  const [tokenCookie, setTokenCookie, removeTokenCookie] = useCookies(['accessToken']);
  const navigate = useNavigate();
  const [openDialog, setOpenDiaLog] = useState(false);
  const toast = useToast();

  console.log(currentUser);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleLogout = () => {
    setOpen(null);
    removeCookie('currentUser', { path: '/app' });
    removeTokenCookie('accessToken', tokenCookie, { path: '/app' });
    navigate('/login');
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleHome = () =>{
    setOpen(null);
    navigate('/app')
  }

  const handleProfile = () =>{
    setOpenDiaLog(true);
  }

  const handleCloseDialog = () => {
    setOpenDiaLog(false);
  };
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={`${process.env.REACT_APP_API_BASE_IMAGE}${currentUser.avatar}`} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
            backgroundColor:'whitesmoke',
            letterSpacing: "0.05em"
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5,textAlign: 'right' }}>
          <Typography variant="subtitle2" noWrap>
            {currentUser.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {currentUser.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={handleHome} sx={{ m: 1, color: 'success.main' }}>
            <Iconify icon={'solar:home-bold-duotone'} sx={{ mr: 1 }} />

            <Button variant="text" fullWidth sx={{letterSpacing:"0.05em"}} >Home</Button>
          </MenuItem>
          <MenuItem onClick={handleProfile} sx={{ m: 1,color: 'info.main' }}>
            <Iconify icon={'carbon:user-profile'} sx={{ mr: 1 }} />

            <Button variant="text" fullWidth sx={{letterSpacing:"0.05em"}}>Profile</Button>
          </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <Tooltip title="Logout">
        <MenuItem onClick={handleLogout} sx={{ m: 1,display: 'flex', justifyContent: 'center',color:'white',backgroundColor:'#AEDEFC' }}>
          <LogoutIcon/>
        </MenuItem>
        </Tooltip>
      </Popover>
      <UserDetails openDialog={openDialog} handleCloseDialog={handleCloseDialog} user={currentUser}/>
    </>
  );
}
