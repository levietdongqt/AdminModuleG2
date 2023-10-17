import React, { useEffect, useState } from 'react';
import {
  Paper,
  Button,
  Typography,
  TextField,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from '@mui/material';
import { fDateTime } from '../../../utils/formatTime';

const CustomDialogContent = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column',
  padding: '30px',
  margin: '20px',
});

export default function TemplateDetails({ openDialog, handleCloseDialog, user }) {
  const [editMode, setEditMode] = useState(false);
  
  return (
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: 'whitesmoke', // thay đổi màu nền theo ý muốn của bạn
            width: 1000, // thay đổi độ rộng cố định theo ý muốn của bạn
            height: 800, // thay đổi chiều dài cố định theo ý muốn của bạn
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <DialogTitle color={'Highlight'} align={'center'} style={{ fontSize: 30 }}>
          {template.name}
        </DialogTitle>
        <CustomDialogContent>
            
        </CustomDialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
  );
}
