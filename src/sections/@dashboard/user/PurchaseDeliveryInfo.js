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
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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



export default function PurchaseDeliveryInfo({ openDialog, handleCloseDialog, deli }) {
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
                    backgroundColor: 'whitesmoke',
                    width: 800,
                    height: 'auto',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                },
            }}
        >
            <CustomDialogTitle color={'Highlight'} align={'center'} alignItems={'center'} style={{ fontSize: 25 }}>
                <p> Delivery Information</p>
            </CustomDialogTitle>
            <CustomDialogContent>
                <div>
                    {deli && (
                        <>
                            <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
                                <strong>Name:</strong>{' '} {deli.customName || 'N/A'}
                            </Typography>
                            <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
                                <strong>Phone:</strong>{' '} {deli.phone || 'N/A'}
                            </Typography>
                            {deli.email && (
                                <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
                                    <strong>Email:</strong>{' '} {deli.email}
                                </Typography>
                            )}
                            {deli.deliveryAddress && (
                                <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
                                    <strong>Address:</strong>{' '} {deli.deliveryAddress}
                                </Typography>
                            )}
                        </>
                    )}
                </div>
            </CustomDialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
        </Dialog>


    );
}