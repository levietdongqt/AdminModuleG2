import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import JoditEditor from 'jodit-react';
import ImageUploading from 'react-images-uploading';
import swal from 'sweetalert';
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
  Tooltip,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useToast } from '@chakra-ui/react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UpdateSchemaMap from '../../../validations/UpdateValidation';
import { UpdateTemplate,DeleteImageAllById,DeleteImageById } from '../../../api/TemplateService';

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
  const toast = useToast();
  const [fileList, setFileList] = useState([]);
  const [images, setImages] = useState([]);
  const [restoreImages,setRestoreImages] = useState([]);
  const editor = useRef(null);
  const [edited,setEdited] = useState(false);

  const [maxNumber, setMaxNumber] = useState(15);
  
  const errorPopup = (mess ) => {
    swal({
      title: "Warning",
      text: mess,
      icon: "warning",
    })
  }

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
      if(restoreImages && restoreImages.length>0){
        const deletedIds = restoreImages.map((image) => image.id);
        const resDeleted = await DeleteImageAllById(deletedIds);
        console.log(resDeleted);
      }
      const formData = new FormData();
      formData.append('Name', values.name);
      formData.append('PricePlusPerOne', values.pricePlusPerOne);
      values.descriptionArray.forEach((item, index) => {
        formData.append(`DescriptionTemplates[${index}].id`, item.id);
        formData.append(`DescriptionTemplates[${index}].title`, item.title);
        formData.append(`DescriptionTemplates[${index}].description`, item.description);
        formData.append(`DescriptionTemplates[${index}].templateId`, item.templateId);
      });
      images.forEach((item, index) => {
        formData.append(`formFileList`, item.file);
      });
      const response = await UpdateTemplate(template.id, formData);
      console.log(response);
      if (response.data.status === 200) {
        toast({
          title: 'Update',
          description: 'You have Update successfully.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        setEdited(true);
      } else {
        toast({
          title: 'Error!',
          description: 'Wrong Update.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    },
  });
  
  useEffect(() => {
    setEdited(false);
    setValues({
      name: template.name,
      pricePlusPerOne: template.pricePlusPerOne,
      descriptionArray: template.descriptionTemplates,
    });
    setTouched({});
    updateImages();
    if (!openDialog) {
      setImages([]);
      setFileList([]);
      console.log(restoreImages);
      setRestoreImages([]);
      
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
  const onChange = (imageList,index) => {
    console.log(imageList);
    setImages(imageList);
    console.log(images);
  };

  const updateImages = () =>{
    
    if(template.templateImages && template.templateImages.length > 0){
      template.templateImages.forEach((image)=>{
        const img = {
          id: image.id,
          data_url: `${process.env.REACT_APP_API_BASE_IMAGE}${image.imageUrl}`,
        }
        setImages(prev => [...prev,img]);
      })
    }
    console.log(images);
  }
  
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
          letterSpacing:"0.05em"
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
            
            {/* <Button
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
            </Button> */}
            {/* <Grid container spacing={2}>
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
            </Grid> */}

            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}
              dataURLKey="data_url"
              acceptType={['jpg', 'jpeg', 'png']}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                errors,
              }) => (
                // write your building UI
                <div className="upload__image-wrapper">
                  <Tooltip title="Upload">
                  <Button
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    color="primary"
                  >
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onClick={onImageUpload}
                      {...dragProps}
                    />
                  </Button>
                  </Tooltip>
                  <Tooltip title="Delete All">
                      <Button
                        size="100px"
                        startIcon={<DeleteForeverIcon />}
                        color="error"
                        onClick={ async () => {
                          const imagesHsId = imageList.filter((img) => img.id !== undefined);
                          // const deletedIds = imagesHsId.map((item) => item.id);
                          setRestoreImages(imagesHsId);
                          onImageRemoveAll()}}
                        {...dragProps}
                      >
                        Delete All
                      </Button>
                    </Tooltip>
                    <Tooltip title="Restore">
                  <Button
                    size="100px"
                    startIcon={<CloudUploadIcon />}
                    color="primary"
                    onClick={ async () => {
                      setImages(prev => [...prev,...restoreImages]);
                      setRestoreImages([]);
                      }}
                    {...dragProps}
                   
                  >
                    Restore
                  </Button>
                  </Tooltip>
                  <Grid container spacing={2}>
                    {imageList.map((image, index) => {
                      return (
                        <Grid item key={index}>
                          <Box
                            component="img"
                            sx={{
                              height: 200,
                              width: 300,
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
                            src={image.data_url}
                          />
                          <Box sx={{display:"flex",justifyContent:"center"}}>
                            <Tooltip title="Change">
                              <IconButton onClick={ async (event) => {
                                if(image.id !== undefined){
                                  setRestoreImages(prev => [...prev,image]);
                                }                              
                                onImageUpdate(index)}
                              }>
                                <PublishedWithChangesIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove">
                              <IconButton onClick={ async (event) => {
                                if(image.id !== undefined){
                                  setRestoreImages(prev => [...prev,image]);
                                }   
                                onImageRemove(index)}
                              }>
                                <DeleteIcon sx={{ fontSize: 20 }} color="error" />
                              </IconButton>
                            </Tooltip>
                            </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                  {errors && (
                      <div>
                        {errors.maxNumber && errorPopup("Number of selected images exceed maxNumber")}
                        {errors.acceptType &&  errorPopup("Your selected file type is not allow")}
                        {errors.maxFileSize && errorPopup("Selected file size exceed maxFileSize")}
                        {errors.resolution && errorPopup("Selected file is not match your desired resolution")}
                      </div>
                    )}
                </div>
              )}
            </ImageUploading>
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
