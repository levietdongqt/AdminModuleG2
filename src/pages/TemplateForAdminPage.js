import { Helmet } from 'react-helmet-async';
import { filter, template } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { TemplateListHead, TemplateListToolbar, TemplateDetails,EditTemplate } from '../sections/@dashboard/template';

import { GetAllTemplate, DeleteTemplate, DeleteAllTemplate, GetTemplateById } from '../api/TemplateService';

import { fDateTime } from '../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'image', label: 'Image', alignRight: false },
  { id: 'pricePlus', label: 'Price Plus', alignRight: false },
  { id: 'quantitySold', label: 'Quantity Sold', alignRight: false },
  { id: 'createDate', label: 'Create Date', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
const imageStyle = {
  height: '300px', // Điều chỉnh chiều cao theo ý muốn
  width: '100%', // Điều chỉnh chiều rộng theo ý muốn
};

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TemplateForAdminPage() {
  const [open, setOpen] = useState(null);
  const [openDialog, setOpenDiaLog] = useState(false);
  const [openDialogEdit,setOpenDialogEdit] = useState(false);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [Template, setTemplate] = useState([]);

  const [templateId, setTemplateId] = useState({});

  const [dataPerPage, setDataPerPage] = useState(1000);

  const [filterOn, setFilterOn] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const [sortBy, setSortBy] = useState('');
  const [isAscending, setIsAscending] = useState(true);
  const [idSelected, setIdSelected] = useState(null);

  useEffect(() => {
    GetAllTemplateAsync(1, dataPerPage, filterOn, filterQuery, sortBy, isAscending);
  }, [filterQuery, sortBy, isAscending]);

  const GetAllTemplateAsync = async (page, dataPerPage, filterOn, filterQuery, sortBy, isAscending) => {
    const response = await GetAllTemplate(page, dataPerPage, filterOn, filterQuery, sortBy, isAscending);

    console.log(response);

    setTemplate(response.data.result);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setSortBy(property);
    setIsAscending(isAsc);
    console.log(isAscending);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Template.map((n) => n.id);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
    console.log(selected);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);

    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
    console.log(selected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterOn('name');
    setFilterQuery(event.target.value);
  };

  const handleRowClick = (id) => {
    setIdSelected(id);
  };

  const handleDelete = async (id) => {
    const response = await DeleteTemplate(id);
    console.log(response);
  };

  const handleDeleteAll = async () => {
    const response = await DeleteAllTemplate(selected);
    console.log(response);
  };

  const handleClickDialog = async (id) => {
    const response = await GetTemplateById(id);
    setTemplateId(response.data.result);
    setOpenDiaLog(true);
  };
  const handleCloseDialog = () => {
    setOpenDiaLog(false);
  };

  const handleClickEditDialog = async (id) => {
    const response = await GetTemplateById(id);
    setTemplateId(response.data.result);
    console.log(templateId);
    setOpenDialogEdit(true);
  }
  const handleCloseDialogEdit = () => {
    setOpenDialogEdit(false);
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Template.length) : 0;
  console.log(emptyRows);

  const filteredUsers = applySortFilter(Template, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Template</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom color={'Highlight'}>
            TEMPLATE
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} href="template/create" color="info">
            NEW TEMPLATE
          </Button>
        </Stack>

        <Card>
          <TemplateListToolbar
            numSelected={selected.length}
            filterName={filterQuery}
            onFilterName={handleFilterByName}
            onDeleteAll={handleDeleteAll}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TemplateListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={Template.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {Template.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const selectedUser = selected.indexOf(row.id) !== -1;
                    return (
                      <TableRow hover key={row.id} tabIndex={-1} role="checkbox" onClick={() => handleRowClick(row.id)}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, row.id)} />
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">
                          <Slider {...settings} style={{ width: '300px', margin: '0 auto' }}>
                            {row.templateImages.map((image, index) => (
                              <div key={index}>
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
                                  src={`https://localhost:5000${image.imageUrl}`}
                                  style={imageStyle}
                                />
                              </div>
                            ))}
                          </Slider>
                        </TableCell>
                        <TableCell align="left">{row.pricePlusPerOne}</TableCell>

                        <TableCell align="left">{row.quantityPlus || 0}</TableCell>
                        <TableCell align="left">{fDateTime(row.createDate)}</TableCell>

                        <TableCell align="left">
                          <Label color={(row.status === 'banned' && 'error') || 'success'}>
                            {sentenceCase(row.status === true ? 'active' : 'banned')}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={Template.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 200,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 1 }} />
          <Button variant="contained" onClick={() => handleClickDialog(idSelected)}>
            Details
          </Button>
        </MenuItem>
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 1 }} />
          <Button variant="contained" onClick={()=> handleClickEditDialog(idSelected)}>
            Edit Template
          </Button>
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 1 }} />
          <Button variant="contained" onClick={() => handleDelete(idSelected)}>
            Delete
          </Button>
        </MenuItem>
      </Popover>
      <TemplateDetails openDialog={openDialog} handleCloseDialog={handleCloseDialog} template={templateId} />
      <EditTemplate openDialog={openDialogEdit} handleCloseDialog={handleCloseDialogEdit} template={templateId}/>
    </>
  );
}
