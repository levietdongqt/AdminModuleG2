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

export default function TemplateDetails({ openDialog, handleCloseDialog, template }) {
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
            <div>
              <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
                <strong>Name:</strong> ${template.name}
              </Typography>
              <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
                <strong>Price:</strong> ${template.pricePlusPerOne}
              </Typography>
              <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
                <strong>Status:</strong> {template.status ? 'In Stock' : 'Out Of Stock'}
              </Typography>
              <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Quantity:</strong> {template.quantitySold}
          </Typography>
          {template.collectionsDTO && template.collectionsDTO.length > 0 && (
            <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
              <strong>Collections:</strong>{' '}
              {template.collectionsDTO.map((element, index) => {
                return index === 0 ? element.name : `, ${element.name}`;
              })}
            </Typography>
          )}

          {template.sizesDTO && template.sizesDTO.length > 0 && (
            <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
              <strong>Sizes:</strong>{' '}
              {template.sizesDTO.map((element, index) => {
                return index === 0 ? `${element.width}x${element.length}` : `, ${element.width}x${element.length}`;
              })}
            </Typography>
          )}
          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Totals Reviews:</strong>
            {template.reviews && template.reviews.length > 0 ? template.reviews.length : 0}
          </Typography>

          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>CreatedDate:</strong> {fDateTime(template.createDate)}
          </Typography>

          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Description:</strong>
          </Typography>
          {template.descriptionTemplates &&
            template.descriptionTemplates.length > 0 &&
            template.descriptionTemplates.map((ele, index) => {
              const i = index + 1;
              return (
                <>
                  <Typography variant="body1" style={{ marginLeft: '20px' }} color={'GrayText'} >
                    <strong>{`+Title ${i}:`}</strong> {ele.title}
                  </Typography>
                  <Typography variant="body1" style={{ marginLeft: '20px' }} color={'GrayText'} >
                    <strong>{`+Description ${i}`}:</strong>
                    <div style={{ marginLeft: '20px' }} dangerouslySetInnerHTML={{ __html: ele.description }} />
                  </Typography>
                </>
              );
            })}
          <Typography variant="body1" color={'GrayText'} style={{ margin: 5 }}>
            <strong>Image:</strong>
          </Typography>
          {template.templateImages && template.templateImages.length > 0 && (
            <Grid container spacing={2}>
              {template.templateImages.map((image, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <Paper elevation={3}>
                    <Box
                      component="img"
                      sx={{
                        height: 300,
                        width: 500,
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
                      src={`${process.env.REACT_APP_API_BASE_IMAGE}${image.imageUrl}`}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
            </div>    
        </CustomDialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
  );
}
