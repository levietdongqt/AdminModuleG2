import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { styled } from '@mui/material/styles';
import JoditEditor from 'jodit-react';


import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  TextField,
  Select,
  Typography,
  MenuItem,
  InputLabel,
  Button,
  Grid,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { useToast } from '@chakra-ui/react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

import { LoadingButton } from '@mui/lab';
import  ValidationSchemaMap from '../validations/CreateValidations'
import { GetAllCategories, GetAllSizes, AddTemplate } from '../api/TemplateService';

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
  const toast = useToast();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [images, setImages] = useState([]);
  const [categorySelected, setCategorySelected] = useState({});
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [open, setOpen] = useState({});
  const [collectionsSelectedItems, setCollectionsSelectedItems] = useState([]);

  const editor = useRef(null);

  useEffect(() => {}, [collectionsSelectedItems, fileList]);

  const formik = useFormik({
    initialValues: {
      name: '',
      pricePlus: 0,
      title: '',
      sizeSelected: [],
      description: '',
    },
    validationSchema: ValidationSchemaMap,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('Name', values.name);
      formData.append('PricePlus', values.pricePlus);
      formData.append(`DescriptionTemplates[0].Title`, values.title);
      formData.append(`DescriptionTemplates[0].Description`, values.description);
      collectionsSelectedItems.forEach((item, index) => {
        formData.append(`collectionDTOs[${index}].Id`, item.id);
        formData.append(`collectionDTOs[${index}].Name`, item.name);
      });
      values.sizeSelected.forEach((item, index) => {
        formData.append(`sizeDTOs[${index}].Id`, item.id);
        formData.append(`sizeDTOs[${index}].Length`, item.length);
        formData.append(`sizeDTOs[${index}].Width`, item.width);
        formData.append(`sizeDTOs[${index}].CreateDate`, item.createDate);
      });
      fileList.forEach((item, index) => {
        formData.append(`formFileList`, item);
      });

      const response = await AddTemplate(formData);
      console.log(response);
      if (response.data.status === 201) {
        toast({
          title: 'Create',
          description: 'You have created successfully.',
          status: 'Created',
          duration: 2000,
          isClosable: true,
        });
        navigate("/template")
      } else {
        toast({
          title: 'Error!',
          description: 'Wrong created.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    },
  });

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
    console.log(images);
  };

  useEffect(() => {
    GetAllCategoriesAndSize();
  }, []);

  const GetAllCategoriesAndSize = async () => {
    const response1 = await GetAllCategories();
    const response2 = await GetAllSizes();
    setCategories(response1.data.result);
    setSizes(response2.data.result);
  };

  const handleClickList = (id, collections) => {
    setOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));

    if (collections) {
      setCollectionsSelectedItems(collections);
    } else {
      setCollectionsSelectedItems([]);
    }
  };

  const handleSelectCollectionItem = (collection) => {
    if (collectionsSelectedItems.includes(collection)) {
      // Nếu đối tượng đã tồn tại trong danh sách đã chọn, loại bỏ nó
      setCollectionsSelectedItems(collectionsSelectedItems.filter((item) => item !== collection));
    } else {
      // Nếu đối tượng chưa tồn tại trong danh sách đã chọn, thêm nó vào danh sách
      setCollectionsSelectedItems([...collectionsSelectedItems, collection]);
    }
  };

  const handleDeleteCollection = (selectedItem) => {
    const updatedItems = collectionsSelectedItems.filter((item) => item !== selectedItem);
    setCollectionsSelectedItems(updatedItems);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h4" gutterBottom color="secondary">
        NEW TEMPLATE
      </Typography>
      <Stack spacing={4}>
        <InputLabel id="demo-simple-select-label">Collections</InputLabel>
        <Paper elevation={3} variant="h2">
          <List primary={collectionsSelectedItems}>
            {collectionsSelectedItems.map((selectedItem, index) => (
              <ListItem key={selectedItem.id}>
                <ListItemText primary={selectedItem.name} />
                <IconButton
                  edge="start"
                  color="error"
                  aria-label="delete"
                  onClick={() => handleDeleteCollection(selectedItem)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
        {collectionsSelectedItems.length === 0 && categorySelected !== null ? (
          <Alert severity="warning">{'Must be choose in here'}</Alert>
        ) : null}
        <InputLabel id="demo-simple-select-label">Categories</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={categorySelected}
          onChange={(event) => {
            setCategorySelected(event.target.value);
          }}
        >
          {categories.map((item, index) => (
            <div key={item.id}>
              <MenuItem value={item.id} onClick={() => handleClickList(item.id)}>
                {item.name}
                {open[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </MenuItem>
              {open[item.id] && (
                <List disablePadding>
                  {item.collections.map((collection) => (
                    <ListItem
                      key={collection.id}
                      onClick={() => handleSelectCollectionItem(collection)}
                      style={{
                        cursor: 'pointer',
                        fontWeight: collectionsSelectedItems.includes(collection) ? 'bold' : 'normal',
                      }}
                    >
                      <Button variant="outlined" color="primary" fullWidth>
                        <ListItemText primary={collection.name} />
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
              <Divider />
            </div>
          ))}
        </Select>

        <InputLabel id="demo-simple-select-label">Size</InputLabel>
        <Select
          multiple
          id="sizeSelected"
          name="sizeSelected" // Phải trùng với tên trường trong initialValues
          value={formik.values.sizeSelected}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.sizeSelected && Boolean(formik.errors.sizeSelected)}
        >
          {sizes.map((size, index) => (
            <MenuItem key={size.id} value={size}>{`${size.width}x${size.length}`}</MenuItem>
          ))}
        </Select>
        {formik.touched.sizeSelected && formik.errors.sizeSelected ? (
          <Alert severity="error">{formik.errors.sizeSelected}</Alert>
        ) : null}
        <InputLabel id="demo-simple-select-label">Information</InputLabel>
        <TextField
          label="Template Name"
          fullWidth
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          label="Price Plus"
          fullWidth
          id="pricePlus"
          name="pricePlus"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.pricePlus}
          error={formik.touched.pricePlus && Boolean(formik.errors.pricePlus)}
          helperText={formik.touched.pricePlus && formik.errors.pricePlus}
        />
        <InputLabel id="demo-simple-select-label">Description</InputLabel>

        <TextField
          label="Title"
          fullWidth
          id="title"
          name="title"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <JoditEditor
          id="description"
          name="description"
          ref={editor}
          value={formik.values.description}
          onChange={(newContent) => {
            formik.setFieldValue('description', newContent);
            formik.handleBlur({ target: { name: 'description' } });
          }}
        />
        {formik.touched.description && formik.errors.description ? (
          <Alert severity="error">{formik.errors.description}</Alert>
        ) : null}
        <InputLabel id="demo-simple-select-label">Upload file</InputLabel>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          color="primary"
          sx={{
            // Tùy chỉnh CSS cho nút
            backgroundColor: '#ff5722', // Thay đổi màu nền theo ý muốn
            color: 'white', // Thay đổi màu chữ theo ý muốn
            borderRadius: '4px', // Bo tròn góc
            '&:hover': {
              backgroundColor: '#e64a19', // Màu nền khi di chuột qua
            },
          }}
        >
          Upload file
          <VisuallyHiddenInput type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        </Button>
        {images.length === 0 ? <Alert severity="warning">{'Must be choose in here'}</Alert> : null}
        <Grid container spacing={2}>
          {images.map((image, index) => {
            return (
              <Grid item key={index}>
                <Box
                  component="img"
                  sx={{
                    height: 100,
                    width: 200,
                    maxHeight: { xs: 233, md: 167 },
                    maxWidth: { xs: 350, md: 250 },
                    border: '0.5px thin #000', // Thêm khung đen 2px
                    borderRadius: 1, // Bo tròn góc 8px
                    transition: 'transform 0.3s', // Thêm hiệu ứng chuyển đổi 0.3 giây
                    '&:hover': {
                      transform: 'scale(1.1)', // Hiệu ứng phóng to khi di chuột qua hình ảnh
                      boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', // Hiệu ứng bóng đổ khi di chuột qua hình ảnh
                    },
                  }}
                  alt={`Image ${index}`}
                  src={image.imageUrl}
                />
              </Grid>
            );
          })}
        </Grid>
      </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={formik.isSubmitting}>
        Add Template
      </LoadingButton>
    </form>
  );
}
