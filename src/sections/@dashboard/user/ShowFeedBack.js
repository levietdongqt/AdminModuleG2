import React, { useEffect, useState, useRef } from 'react';
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
  Popover,
  Typography,
  TextField,
  InputLabel,
  Tooltip,
} from '@mui/material';
import { useToast } from '@chakra-ui/react';
import JoditEditor from 'jodit-react';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SelectAllIcon from '@mui/icons-material/SelectAll';
import StarRateIcon from '@mui/icons-material/StarRate';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { fDateTime } from '../../../utils/formatTime';

import { TemplateListHead } from '../template';
import { UpdateAllFeedBack, GetFeedBacksByStatus, SendMail } from '../../../api/FeedBackServices';

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
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'content', label: 'Content', alignRight: false },
  { id: '' },
];

export default function ShowFeedBack({ openDialog, handleCloseDialog, user }) {
  const toast = useToast();
  const editor = useRef(null);
  const [open, setOpen] = useState(null);
  const [openMail, setOpenMail] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedId, setSelectedId] = useState(0);
  const [maxLength, setMaxLength] = useState(10);
  const [popoverContent, setPopoverContent] = useState('');
  const [feedBacks, setFeedBacks] = useState(user.feedBacks);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleOpenMenu = (event, content) => {
    setOpen(event.currentTarget);
    setPopoverContent(content);
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenMail = (event, content) => {
    setOpenMail(event.currentTarget);
  };

  const handleCloseMail = () => {
    setOpenMail(null);
  };

  useEffect(() => {
    if (openDialog) {
      setFeedBacks(user.feedBacks);
    } else {
      UpdateAllFeedBack(feedBacks).then((result) => {
        console.log(result);
      });
    }
    handleUpdateFeedBacks(selectedId);
  }, [user, openDialog, selectedId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateFeedBacks = (id) => {
    if (user.feedBacks && user.feedBacks.length > 0) {
      const updatedFeedBacks = user.feedBacks.filter((row) => row.id !== id);
      setFeedBacks(updatedFeedBacks);
    }
  };

  const handleIsImportant = (id) => {
    const updatedFeedBacks = feedBacks.map((feedback) =>
      feedback.id === id ? { ...feedback, isImportant: !feedback.isImportant } : feedback
    );
    setFeedBacks(updatedFeedBacks);
    console.log(updatedFeedBacks);
  };

  const handleShowImportant = async () => {
    const response = await GetFeedBacksByStatus(user.id, true);
    console.log(response);
    setFeedBacks(response.data.result);
  };
  const handleShowAll = () => {
    setFeedBacks(user.feedBacks);
  };

  const handleSubmit = async () => {
    const response = await SendMail(email, subject, message, 'Feedback');
    console.log(response);
  };

  const handleClickSubject = (event, email) => {
    setSubject(event.target.value);
    setEmail(email);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user.reviews.length) : 0;

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      PaperProps={{
        style: {
          backgroundColor: '#F5F7F8', // thay đổi màu nền theo ý muốn của bạn
          width: 1200, // thay đổi độ rộng cố định theo ý muốn của bạn
          height: 800, // thay đổi chiều dài cố định theo ý muốn của bạn
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
          letterSpacing: '0.05em',
        },
      }}
    >
      <DialogTitle color={'#04364A'} align={'center'} style={{ fontSize: 30 }}>
        {user.fullName}
      </DialogTitle>
      <CustomDialogContent>
        <Container>
          <Card>
            <Scrollbar>
              <CustomTableContainer>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<SelectAllIcon />}
                  color="inherit"
                  sx={
                    {
                      // ... các style khác
                    }
                  }
                  onClick={handleShowAll}
                >
                  All Feedback
                </Button>
                <Button variant="outlined" startIcon={<StarRateIcon/>} color="inherit" onClick={handleShowImportant}>
                  Show Important
                </Button>
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
                    {feedBacks &&
                      feedBacks.length > 0 &&
                      feedBacks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        return (
                          <TableRow hover key={row.id} tabIndex={-1}>
                            <TableCell align="left">
                              <Tooltip title="Check Important">
                                <IconButton onClick={() => handleIsImportant(row.id)}>
                                  {row.isImportant ? (
                                    <Iconify icon={'ion:star'} color={'orange'} />
                                  ) : (
                                    <Iconify icon={'ion:star-outline'} />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="left">{fDateTime(row.feedBackDate)}</TableCell>

                            <TableCell align="left">{row.email}</TableCell>

                            <TableCell align="left">
                              {row.content.length > maxLength
                                ? `${row.content.substring(0, maxLength)}...`
                                : row.content}
                              {row.content.length > maxLength && (
                                <Tooltip title="Show All">
                                  <IconButton onClick={(event) => handleOpenMenu(event, row.content)}>
                                    <ExpandMoreIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>

                            <TableCell align="right" sx={{ alignItems: 'center' }}>
                              <Tooltip title="Send Mail">
                                <IconButton onClick={(event) => handleOpenMail(event)}>
                                  <Iconify icon={'material-symbols:mail-outline'} />
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
                                  p: 1,
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
                            <Popover
                              open={Boolean(openMail)}
                              anchorEl={openMail}
                              onClose={handleCloseMail}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                              PaperProps={{
                                sx: {
                                  p: 1,
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
                                <Typography variant="h4" gutterBottom color="secondary">
                                  Send Mail
                                </Typography>
                                <InputLabel id="demo-simple-select-label" value>
                                  Message:
                                </InputLabel>
                                <TextField
                                  label="Subject"
                                  fullWidth
                                  type="text"
                                  onChange={(event) => handleClickSubject(event, row.email)}
                                />
                                <InputLabel id="demo-simple-select-label">Message:</InputLabel>
                                <JoditEditor
                                  id="description"
                                  name="description"
                                  ref={editor}
                                  onChange={(newContent) => setMessage(newContent)}
                                />
                                <Button fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
                                  Send
                                </Button>
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
              count={(feedBacks && feedBacks.length) > 0 ? feedBacks.length : 0}
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
