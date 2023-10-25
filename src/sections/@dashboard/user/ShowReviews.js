import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  TableHead,
  TableSortLabel,
  Avatar,
  Typography,
  Box,
  Popover,
  MenuItem,
  Tooltip
} from '@mui/material';
import { useToast } from '@chakra-ui/react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SelectAllIcon from '@mui/icons-material/SelectAll';
import StarRateIcon from '@mui/icons-material/StarRate';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { fDateTime } from '../../../utils/formatTime';

import { TemplateListHead } from '../template';
import { DeleteReview, UpdateAllReview,GetReviewsByStatus } from '../../../api/ReviewService';

const CustomDialogContent = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column',
  padding: '30px',
  margin: '20px',
});

const CustomTableContainer = styled(TableContainer)({
  maxHeight: 440,
  backgroundColor: 'whitesmoke',
});

const CustomTableCell = styled(TableCell)({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#362FD9',
});

const CustomTableHead = styled(TableHead)({
  backgroundColor: '#4F4A45',
});

const TABLE_HEAD = [
  { id: 'isImportant', label: 'Important', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'content', label: 'Content', alignRight: false },
  { id: 'rating', label: 'Rating', alignRight: false },
  { id: '' },
];

export default function ShowReviews({ openDialog, handleCloseDialog, user }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);

  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [resetCount, setResetCount] = useState(0);
  const [selectedId, setSelectedId] = useState(0);
  const [maxLength, setMaxLength] = useState(10);
  const [reviews, setReviews] = useState(user.reviews);

  const [popoverContent, setPopoverContent] = useState('');

  const handleOpenMenu = (event, content) => {
    setOpen(event.currentTarget);
    setPopoverContent(content);
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  useEffect(() => {
    if (openDialog) {
      setReviews(user.reviews);
      // setContent((user.content.length >maxLength)?`${user.content.substring(0,maxLength)}...`:user.content);
    } else {
      UpdateAllReview(reviews).then((result) => {
        console.log(result);
      });
    }
    handleUpdateReviews(selectedId);
  }, [user, openDialog, selectedId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateReviews = (id) => {
    if (user.reviews && user.reviews.length > 0) {
      const updatedReviews = user.reviews.filter((row) => row.id !== id);
      setReviews(updatedReviews);
    }
  };

  const handleIsImportant = (id) => {
    const updatedReviews = reviews.map((review) =>
      review.id === id ? { ...review, isImportant: !review.isImportant } : review
    );
    setReviews(updatedReviews);
    console.log(updatedReviews);
  };
  

  const handleShowImportant = async  () =>{
    const response = await GetReviewsByStatus(user.id,true);
    console.log(response);
    setReviews(response.data.result);
  }
  const handleShowAll = () =>{
    setReviews(user.reviews);
  }

  const handleDelete = async (id) => {
    setSelectedId(id);
    const response = await DeleteReview(id);
    console.log(response);
    if (response.data.status === 200) {
      toast({
        title: 'Delete',
        description: 'You have delete successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setReviews(reviews.filter((review) => review.id !== id));
    } else {
      toast({
        title: 'Error!',
        description: 'Wrong delete.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user.reviews.length) : 0;

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      PaperProps={{
        style: {
          backgroundColor: 'whitesmoke', // thay đổi màu nền theo ý muốn của bạn
          width: 1200, // thay đổi độ rộng cố định theo ý muốn của bạn
          height: 800, // thay đổi chiều dài cố định theo ý muốn của bạn
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
          borderRadius: 10,
        },
      }}
    >
      <DialogTitle color={'Highlight'} align={'center'} style={{ fontSize: 30 }}>
        {user.fullName}
      </DialogTitle>
      <CustomDialogContent>
        <Container>
          <Card>
            <Scrollbar>
              <CustomTableContainer>
                <Button variant="outlined"
                  startIcon={<SelectAllIcon />}
                  color="inherit" onClick={handleShowAll}>Show All</Button>
                <Button variant="outlined" startIcon={<StarRateIcon/>} color="inherit" onClick={handleShowImportant}>Show Important</Button>
                <Table>
                  <CustomTableHead>
                    <TableRow>
                      {TABLE_HEAD.map((headCell) => (
                        <CustomTableCell key={headCell.id} align={headCell.alignRight ? 'right' : 'left'}>
                          <TableSortLabel>{headCell.label}</TableSortLabel>
                        </CustomTableCell>
                      ))}
                    </TableRow>
                  </CustomTableHead>
                  <TableBody>
                    {reviews &&
                      reviews.length > 0 &&
                      reviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        return (
                          <TableRow hover key={row.id} tabIndex={-1}>
                            <TableCell align="left">
                              <IconButton onClick={() => handleIsImportant(row.id)}>
                                {row.isImportant ? (
                                  <Iconify icon={'ion:star'} color={'orange'} />
                                ) : (
                                  <Iconify icon={'ion:star-outline'} />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell align="left">{fDateTime(row.reviewDate)}</TableCell>

                            <TableCell align="left">
                              {row.content.length > maxLength
                                ? `${row.content.substring(0, maxLength)}...`
                                : row.content}
                              {row.content.length > maxLength && (
                                <Tooltip title="Expand">
                                <IconButton onClick={(event) => handleOpenMenu(event, row.content)}>
                                  <ExpandMoreIcon />
                                </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>

                            <TableCell align="left">{row.rating}</TableCell>
                            
                            <TableCell align="right" sx={{ alignItems: 'center' }}>
                            <Tooltip title="Remove">
                              <IconButton onClick={() => handleDelete(row.id)}>
                                <Iconify icon={'eva:trash-2-outline'} />
                              </IconButton>
                              </Tooltip>
                            </TableCell>
                            
                            <Popover
                              open={Boolean(open)}
                              anchorEl={open}
                              onClose={handleCloseMenu}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                              PaperProps={{
                                sx: {
                                  p: 2,
                                  width: 500,
                                  '& .MuiMenuItem-root': {
                                    px: 1,
                                    typography: 'body2',
                                    borderRadius: 0.75,
                                  },
                                  backgroundColor: 'whitesmoke',
                                  borderRadius: '8px',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                },
                              }}
                            >
                              <Typography variant="h6" paragraph>
                                {popoverContent}
                              </Typography>
                            </Popover>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CustomTableContainer>
            </Scrollbar>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={(reviews && reviews.length) > 0 ? reviews.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                backgroundColor: 'whitesmoke',
              }}
            />
          </Card>
        </Container>
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
