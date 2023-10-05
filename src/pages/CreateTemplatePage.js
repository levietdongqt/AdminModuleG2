import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';

import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  Select,
  Typography,
  TextareaAutosize,
  MenuItem,
  InputLabel,
  Button,
  Grid,
  Box
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LoadingButton } from '@mui/lab';

import { GetAllCategories,GetAllSizes,AddTemplate } from '../api/TemplateService/TemplateService';



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function CreateTemplatePage() {
  const [fileList,setFileList] = useState([]);
  const [images, setImages] = useState([]);
  const [categories,setCategories] = useState([]);
  const [sizes,setSizes] = useState([]);

  const [categorySelected,setCategorySelected] = useState([]);
  const [sizeSelected,setSizeSelected] = useState([]);
  const [name,setName] = useState('');
  const [pricePlus,setPricePlus] = useState('');
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Lấy ra tệp ảnh từ sự kiện tải lên
    const updatedSelectedFiles = [...fileList];  
    updatedSelectedFiles.push(file);
    setFileList(updatedSelectedFiles);
  const reader = new FileReader();

  // Xử lý khi tệp ảnh đã được đọc
  reader.onload = () => {
    const imageUrl = reader.result; // Đường dẫn ảnh đã được đọc
    // Cập nhật state với hình ảnh mới
    setImages([...images, { imageUrl }]);
  };

  if (file) {
    reader.readAsDataURL(file); // Đọc tệp ảnh dưới dạng base64
  }
  }

  useEffect(
    () => {
      GetAllCategoriesAndSize();       
    }, []
);

  const GetAllCategoriesAndSize = async () =>{
    const response1 = await GetAllCategories();
    const response2 = await GetAllSizes();
    setCategories(response1.data.result);
    setSizes(response2.data.result);
  }

  const handleClick = async () => {
    const formData = new FormData();
        formData.append("Name", name);
        formData.append("PricePlus", pricePlus);
        formData.append(`DescriptionTemplates[0].Title`, title);
        formData.append(`DescriptionTemplates[0].Description`, description);
        categorySelected.forEach((item, index) => {
            formData.append(`categoryDTOs[${index}].Id`, item.id);
            formData.append(`categoryDTOs[${index}].Name`, item.name);
          });
        sizeSelected.forEach((item, index) => {
            console.log(item);
            formData.append(`sizeDTOs[${index}].Id`, item.id);
            formData.append(`sizeDTOs[${index}].Length`, item.length);
            formData.append(`sizeDTOs[${index}].Width`, item.width);
            formData.append(`sizeDTOs[${index}].CreateDate`, item.createDate);
          });
          fileList.forEach((item,index)=>{
            console.log(item);
            formData.append(`formFileList`,item);
          });
        const response = await AddTemplate(formData);
        console.log(response);
  };
  return (
    <>
      <Typography variant="h4" gutterBottom>
        New Template
      </Typography>
      <Stack spacing={4}>
        <InputLabel id="demo-simple-select-label">Upload file</InputLabel>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload file
          <VisuallyHiddenInput type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        </Button>
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item key={index}>
              <Box
                component="img"
                sx={{
                  height: 100,
                  width: 200,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt={`Image ${index}`}
                src={image.imageUrl}
              />
            </Grid>
          ))}
        </Grid>
        <InputLabel id="demo-simple-select-label">Information</InputLabel>
        <TextField  label="Template Name" value={name} onChange={(event)=>{
          setName(event.target.value);
        }}/>
        <TextField  label="Price Plus" value={pricePlus} onChange={(event)=>{
          setPricePlus(event.target.value);
        }}/>
        <InputLabel id="demo-simple-select-label">Description</InputLabel>
        <TextField  label="Title" value={title} onChange={(event)=>{
          setTitle(event.target.value);
        }}/>
        <TextareaAutosize  label="Description" value={description} minRows={20} onChange={(event)=>{
          setDescription(event.target.value);
        }}/>

        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          multiple
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={categorySelected}
          inputProps={{ name: 'categorySelected' }}
          onChange={(event)=>{
            setCategorySelected(event.target.value)
          }}
        >
          {categories.map((cate,index) => (
            <MenuItem key={index} value={cate}>{cate.name}</MenuItem>
          ))}
        </Select>

        <InputLabel id="demo-simple-select-label">Size</InputLabel>
        <Select
          multiple
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sizeSelected}
          onChange={(event)=>{
            setSizeSelected(event.target.value);
          }}
        >
          {sizes.map((size,index) => (
            <MenuItem  key={index} value={size} >{`${size.width}x${size.length}`}</MenuItem>
          ))}
        </Select>
      </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Add Template
      </LoadingButton>
    </>
  );
}
