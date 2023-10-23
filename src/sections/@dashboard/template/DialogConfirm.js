import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { DeleteTemplate } from '../../../api/TemplateService';

export default function DialogConfirm({contentConfirm,id,openDialog,handleCloseDialog,handleAccept}){   
    return(
        <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {contentConfirm}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleAccept()} color="secondary" autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    )
}