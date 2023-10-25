import React, { useEffect, useState } from 'react';
import {
  Paper,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { fDate } from '../../../utils/formatTime';

const CustomDialogContent = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column',
  padding: '30px',
  margin: '20px',
});

const CustomDialogTitle = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 35,
  color: 'Highlight',
  wordSpacing: 2,
  backgroundColor: '#EEEEEE',
});

export default function UserDetails({ openDialog, handleCloseDialog, user }) {
  const [editMode, setEditMode] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      PaperProps={{
        style: {
          backgroundColor: 'whitesmoke', // thay đổi màu nền theo ý muốn của bạn
          width: 800, // thay đổi độ rộng cố định theo ý muốn của bạn
          height: 'auto', // thay đổi chiều dài cố định theo ý muốn của bạn
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <CustomDialogTitle color={'Highlight'} align={'center'} alignItems={'center'} style={{ fontSize: 25 }}>
        <Avatar alt={user.email} src={`${process.env.REACT_APP_API_BASE_IMAGE}${user.avatar}`} />
        {user.fullName}
      </CustomDialogTitle>
      <CustomDialogContent>
        <div>
          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Email:</strong>{' '} {user.email}
          </Typography>
          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Phone:</strong>{' '} {user.phone}
          </Typography>
          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Role:</strong>{' '} {user.role}
          </Typography>
          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Gender:</strong>{' '} {user.Gender ? 'Male' : 'Female'}
          </Typography>
          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>DOB:</strong>{' '} {fDate(user.dateOfBirth)}
          </Typography>
          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Address:</strong>{' '} {user.address}
          </Typography>
          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Status:</strong>{' '} {user.status}
          </Typography>
          {
            (user.role !== 'admin') && 
            <div>
            <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>FeedBack Number:</strong>{' '} {user.feedBacks && user.feedBacks.length > 0 ? user.feedBacks.length : 0}
          </Typography>
          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Review Number:</strong>{' '} {user.reviews && user.reviews.length > 0 ? user.reviews.length : 0}
          </Typography>

          <Typography variant="body1" color="textSecondary" style={{ margin: 5 }}>
            <strong>Delivery Information:</strong>
            <Tooltip title={expanded ? "Expand Less" : "Expand More"}>
            <IconButton aria-label="expand" onClick={handleExpandClick}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            </Tooltip>
            <Box sx={{ backgroundColor: '#EAD7BB',border:1,marginBottom: 2 }}>
              <Typography variant="body1" color="textSecondary" style={{ margin: 5 }}>
                <strong>_Address:</strong>{' '}
                {user.deliveryInfos && user.deliveryInfos.length > 0 ? user.deliveryInfos[0].deliveryAddress : ''}
              </Typography>
              <Typography variant="body1" color="textSecondary" style={{ margin: 5 }}>
                <strong>_Email:</strong>{' '}
                {user.deliveryInfos && user.deliveryInfos.length > 0 ? user.deliveryInfos[0].email : ''}
              </Typography>
              <Typography variant="body1" color="textSecondary" style={{ margin: 5 }}>
                <strong>_Phone:</strong>{' '}
                {user.deliveryInfos && user.deliveryInfos.length > 0 ? user.deliveryInfos[0].phone : ''}
              </Typography>
            </Box>
                {expanded && user.deliveryInfos.slice(1).map((del) =>(
                    <Box sx={{ backgroundColor: '#FFF2D8',border:1,marginBottom: 2 }}>
                    <Typography variant="body1" color="textSecondary" style={{ margin: 5 }}>
                      <strong>_Address:</strong>{' '}
                      {del.deliveryAddress}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" style={{ margin: 5 }}>
                      <strong>_Email:</strong>{' '}
                      {del.email}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" style={{ margin: 5 }}>
                      <strong>_Phone:</strong>{' '}
                      {del.phone}
                    </Typography>
                  </Box>
                ))             
                }
          </Typography>
          </div>
          }        
        </div>
      </CustomDialogContent>
      <DialogActions>
      <Button
                component="label"
                variant="outlined"
                startIcon={<ExitToAppIcon />}
                color="inherit"
                sx={
                  {
                    letterSpacing: '0.05em'
                  }
                }
                onClick={handleCloseDialog}
              >
                Close
              </Button>
      </DialogActions>
    </Dialog>
  );
}
