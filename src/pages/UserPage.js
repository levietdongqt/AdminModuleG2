import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
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
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { ShowReviews, ShowFeedBack, UserListHead, UserListToolbar, UserDetails } from '../sections/@dashboard/user';
// mock

import { getAllUsers, getUserById, updateUser } from '../api/UserServices';
import { DialogConfirm } from '../sections/@dashboard/template';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'FUll NAME', alignRight: false },
  { id: 'email', label: 'EMAIL', alignRight: false },
  { id: 'phone', label: 'PHONE NUMBER', alignRight: false },
  { id: 'gender', label: 'GENDER', alignRight: false },
  { id: 'isVerified', label: 'VERIFIED MAIL', alignRight: false },
  { id: 'status', label: 'STATUS', alignRight: false },
  { id: '' },
];

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

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState('');

  const [st, setSt] = useState(null);

  const [idSelected, setIdSelected] = useState(null);

  const [openDialogReview, setOpenDialogReview] = useState(false);
  const [openDialogFeedBack, setOpenDialogFeedBack] = useState(false);
  const [openDialogDetails, setOpenDialogDetails] = useState(false);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);

  const [user, setUser] = useState({});
  const [checkUpdate, setCheckUpdate] = useState(0);
  const [statusOptions, setStatusOptions] = useState('');

  useEffect(() => {
    GetAllUserAsync(search, st, 1, 1000);
  }, [search, st, checkUpdate]);

  const GetAllUserAsync = async (search, st, page, pageSize) => {
    const response = await getAllUsers(search, st, page, pageSize);

    console.log(response);

    setUsers(response.data.result);
  };

  const handleFilterByEmailOrPhone = (event) => {
    setSearch(event.target.value);
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
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    console.log(selectedIndex);
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleDelete = async () => {
    setOpenDialogConfirm(false);
    setOpen(null);
    const addUserDTO = {
      id: idSelected,
      status: statusOptions,
    };
    const response = await updateUser(addUserDTO);
    console.log(response);
    setCheckUpdate(checkUpdate + 1);
  };

  const handleRowClick = async (id) => {
    setIdSelected(id);
    const data = await getUserById(id);
    console.log(data.FullName);
    if (data.result.status === 'Pending') {
      setStatusOptions('Disabled');
    }
    if (data.result.status === 'Disabled') {
      setStatusOptions('Enabled');
    }
    if (data.result.status === 'Enabled') {
      setStatusOptions('Disabled');
    }
  };

  const handleClickReviewDialog = async (id) => {
    const data = await getUserById(id);
    setUser(data.result);
    setOpenDialogReview(true);
  };
  const handleCloseDialogReview = () => {
    setOpenDialogReview(false);
  };

  const handleClickFeedBackDialog = async (id) => {
    const data = await getUserById(id);
    setUser(data.result);
    setOpenDialogFeedBack(true);
  };
  const handleCloseDialogFeedBack = () => {
    setOpenDialogFeedBack(false);
  };

  const handleDetails = async (id) => {
    const data = await getUserById(id);
    setUser(data.result);
    setOpenDialogDetails(true);
  };

  const handleCloseDialogDetails = () => {
    setOpenDialogDetails(false);
  };

  const handleCloseDialogConfirm = () => {
    setOpenDialogConfirm(false);
  };

  const handleOpenDialogConfirm = () => {
    setOpenDialogConfirm(true);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const handleAcceptClick = (value) => {
    setSt(value);
  };

  const handleDisableClick = (value) => {
    setSt(value);
  };

  const handleSpendingClick = (value) => {
    setSt(value);
  };

  return (
    <>
      <Helmet>
        <title> User</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom color={'Highlight'}>
            User Management
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={search}
            onFilterName={handleFilterByEmailOrPhone}
            onActiveClick={handleAcceptClick}
            onDisableClick={handleDisableClick}
            onSpendingClick={handleSpendingClick}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, letterSpacing: '0.05em' }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const selectedUser = selected.indexOf(row.id) !== -1;

                    return (
                      <TableRow hover key={row.id} tabIndex={-1} role="checkbox" onClick={() => handleRowClick(row.id)}>
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, row.id)} />
                        </TableCell> */}
                        <TableCell> </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar alt={row.email} src={`${process.env.REACT_APP_API_BASE_IMAGE}${row.avatar}`} />
                            <Typography variant="subtitle2" noWrap>
                              {row.fullName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{row.email}</TableCell>

                        <TableCell align="left">{row.phone}</TableCell>

                        <TableCell align="left">{row.gender ? 'Male' : 'Female'}</TableCell>

                        <TableCell align="left">{row.emailConfirmed ? 'Yes' : 'No'}</TableCell>

                        <TableCell align="left">
                          <Label color={(row.status === 'Disabled' && 'error') || 'success'}>
                            {sentenceCase(row.status)}
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
            count={users.length}
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
            backgroundColor: 'whitesmoke',
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 1 }} />
          <Button variant="outlined" onClick={() => handleDetails(idSelected)}>
            Details
          </Button>
        </MenuItem>

        {/* <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 1 }} />
          <Button variant="outlined" onClick={() => handleOpenDialogConfirm()}>
            Delete
          </Button>
        </MenuItem> */}

        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 1 }} />
          <Button variant="outlined" color="primary" onClick={() => handleOpenDialogConfirm()}>
            {statusOptions}
          </Button>
        </MenuItem>

        <MenuItem sx={{ color: 'info.main' }}>
          <Iconify icon={'octicon:code-review-24'} sx={{ mr: 1 }} />

          <Button variant="outlined" onClick={() => handleClickReviewDialog(idSelected)}>
            Show Review
          </Button>
        </MenuItem>

        <MenuItem sx={{ color: 'info.main' }}>
          <Iconify icon={'codicon:feedback'} sx={{ mr: 1 }} />
          <Button variant="outlined" onClick={() => handleClickFeedBackDialog(idSelected)}>
            Show FeedBack
          </Button>
        </MenuItem>
      </Popover>
      <ShowReviews openDialog={openDialogReview} handleCloseDialog={handleCloseDialogReview} user={user} />
      <ShowFeedBack openDialog={openDialogFeedBack} handleCloseDialog={handleCloseDialogFeedBack} user={user} />
      <UserDetails openDialog={openDialogDetails} handleCloseDialog={handleCloseDialogDetails} user={user} />
      <DialogConfirm
        openDialog={openDialogConfirm}
        contentConfirm="Are you sure you want to perform this operation?"
        handleCloseDialog={handleCloseDialogConfirm}
        handleAccept={handleDelete}
      />
    </>
  );
}
