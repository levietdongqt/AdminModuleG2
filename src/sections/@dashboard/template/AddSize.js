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
  List,
  InputLabel,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Scrollbar from '../../../components/scrollbar';

import { fDateTime } from '../../../utils/formatTime';
import { GetAllSizes,AddSizeAsync } from '../../../api/TemplateService';

const CustomDialogContent = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column',
  padding: '30px',
  margin: '20px',
});

export default function AddSize({ openDialog, handleCloseDialog, template }) {
  const [editMode, setEditMode] = useState(false);
  const [sizes,setSizes] = useState([]);
  const [sizesSeleted,setSizesSeleted] = useState([]);

  const [sizeTemplate,setSizeTemplate] = useState([])
  const [error,setError] = useState(false);


  useEffect(()=>{
    GetSizeAsync();
    setTemplate();
    if(!openDialog){
        setSizesSeleted([]);
    }
  },[template])

  const setTemplate = () =>{
    setSizeTemplate(template.sizesDTO);
  }


  const GetSizeAsync = async () => {  
    const response = await GetAllSizes();
    setSizes(response.data.result);
  }
  
  const handleSelectSizeItem = (size) => {
    const updatedTemplate = [...sizeTemplate];
  
  const selectedIds = size.map(item => item.id);
  const existingIds = updatedTemplate.map(item => item.id);

  const idsExist = selectedIds.some(id => existingIds.includes(id));

  if (!idsExist) {
    setSizeTemplate([...updatedTemplate, ...size]);
    setError(false);
  } else {
     setError(true);
  }
  };

  const handleDeleteSize = (selectedItem) => {
    const updatedItems = sizeTemplate.filter((item) => item !== selectedItem);
    setSizeTemplate(updatedItems);
  };
  const handleAddSize = async () => {
    const response = await AddSizeAsync(template.id,sizeTemplate);
    console.log(response);
  }
  return (
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: 'whitesmoke', // thay đổi màu nền theo ý muốn của bạn
            width: 500, // thay đổi độ rộng cố định theo ý muốn của bạn
            height: "auto", // thay đổi chiều dài cố định theo ý muốn của bạn
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            letterSpacing:"0.05em"
          },
        }}
      >
        <DialogTitle color={'GrayText'} align={'center'} style={{ fontSize: 30,letterSpacing:"0.05em" }}>
          {template.name}
        </DialogTitle>
        <CustomDialogContent>
        <InputLabel id="demo-simple-select-label">Sizes</InputLabel>
        
        <Box>
        <Scrollbar>
          <List primary={template.sizesDTO}>
            {sizeTemplate && sizeTemplate.map((selectedItem, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${selectedItem.width}x${selectedItem.length}`} />
                
                <IconButton
                  edge="start"
                  color="error"
                  aria-label="delete"
                  onClick={() => handleDeleteSize(selectedItem)}
                >
                <Tooltip title="Delete">
                  <DeleteIcon />
                </Tooltip>
                </IconButton>
              </ListItem>
            ))}
          </List>
          </Scrollbar>
          <InputLabel id="demo-simple-select-label">Add Size</InputLabel>
          <Select
          fullWidth
          multiple
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sizesSeleted}
          onChange={(event) => {
            handleSelectSizeItem(event.target.value);
          }}
        >
          {sizes.map((size, index) => (
            <MenuItem key={size.id} value={size}>{`${size.width}x${size.length}`}</MenuItem>
          ))}
        </Select>
        {error? (
          <Alert severity="error">Size is existed</Alert>
        ) : null}
        </Box>
        </CustomDialogContent>
        <DialogActions>
           <Button onClick={handleAddSize}>Add</Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
  );
}
