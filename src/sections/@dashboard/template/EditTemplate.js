import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import JoditEditor from 'jodit-react';

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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UpdateSchemaMap from '../../../validations/UpdateValidation';
import { fDateTime } from '../../../utils/formatTime';
import { UpdateTemplate } from '../../../api/TemplateService';

const CustomDialogContent = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column',
  padding: '30px',
  margin: '20px',
});

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

export default function EditTemplate({ openDialog, handleCloseDialog, template }) {
  const [fileList, setFileList] = useState([]);
  const [images, setImages] = useState([]);
  const editor = useRef(null);
  const {
    handleChange,
    values,
    resetForm,
    handleBlur,
    touched,
    isValid,
    errors,
    setFieldValue,
    handleSubmit,
    setValues,
    setTouched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: template.name,
      pricePlusPerOne: template.pricePlusPerOne,
      descriptionArray: template.descriptionTemplates,
    },
    validationSchema: UpdateSchemaMap,
    onSubmit: async (values) => {
      console.log('Submit button clicked!');
      const floatValue = parseFloat(values.pricePlusPerOne);
      console.log(fileList);

      const formData = new FormData();
      formData.append('Name', values.name);
      formData.append('PricePlusPerOne', floatValue.toString());
      values.descriptionArray.forEach((item, index) => {
        formData.append(`DescriptionTemplates[${index}].id`, item.id);
        formData.append(`DescriptionTemplates[${index}].title`, item.title);
        formData.append(`DescriptionTemplates[${index}].description`, item.description);
        formData.append(`DescriptionTemplates[${index}].templateId`, item.templateId);
      });
      fileList.forEach((item, index) => {
        formData.append(`formFileList`, item);
      });
      console.log(values);
      const response = await UpdateTemplate(template.id,formData);
      console.log(response);
    },
  });

  useEffect(() => {
    setValues({
      name: template.name,
      pricePlusPerOne: template.pricePlusPerOne,
      descriptionArray: template.descriptionTemplates,
    });
    setTouched({});
    if (!openDialog) {
      setImages([]);
      setFileList([]);
    }
  }, [template, openDialog]);

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
  };

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
      <form onSubmit={handleSubmit}>
        <DialogTitle color={'Highlight'} align={'center'} style={{ fontSize: 30 }}>
          {template.name}
        </DialogTitle>
        <CustomDialogContent>
          <div>
            <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
              <strong>Name:</strong>
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
            <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
              <strong>Price:</strong>
            </Typography>
            <TextField
              fullWidth
              id="pricePlusPerOne"
              name="pricePlusPerOne"
              value={values.pricePlusPerOne}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.pricePlusPerOne && Boolean(errors.pricePlusPerOne)}
              helperText={touched.pricePlusPerOne && errors.pricePlusPerOne}
            />
            <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
              <strong>Description:</strong>
            </Typography>
            {values.descriptionArray &&
              values.descriptionArray.length > 0 &&
              values.descriptionArray.map((ele, index) => (
                <div key={index}>
                  <TextField
                    label="Title"
                    fullWidth
                    id={`title-${index}`}
                    name={`title-${index}`}
                    type="text"
                    value={ele.title}
                    onChange={(event) => {
                      const { value } = event.target;
                      const updatedArray = [...values.descriptionArray];
                      updatedArray[index].title = value;
                      setFieldValue('descriptionArray', updatedArray);
                      handleBlur({ target: { name: `title-${index}` } });
                    }}
                  />
                  <JoditEditor
                    id={`description-${index}`}
                    name={`description-${index}`}
                    ref={editor}
                    value={ele.description}
                    onChange={(newContent) => {
                      const updatedArray = [...values.descriptionArray];
                      updatedArray[index].description = newContent;
                      setFieldValue('descriptionArray', updatedArray);
                      handleBlur({ target: { name: `description-${index}` } });
                    }}
                  />
                </div>
              ))}
            <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
              <strong>Image:</strong>
            </Typography>
            {template.templateImages && template.templateImages.length > 0 && (
              <Grid container spacing={2}>
                {template.templateImages.map((image, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                    {/* ... các component khác */}
                    <Paper elevation={3}>
                      <Box
                        component="img"
                        sx={
                          {
                            // ... các style khác
                          }
                        }
                        alt={`Image ${index}`}
                        src={`https://localhost:5000${image.imageUrl}`}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              color="primary"
              sx={
                {
                  // ... các style khác
                }
              }
            >
              Upload
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleImageUpload(e)}
              />
            </Button>
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
          </div>
        </CustomDialogContent>
        <DialogActions>
          <Button type="submit" loading={isSubmitting}>
            Edit
          </Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
