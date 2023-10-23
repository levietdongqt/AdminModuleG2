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
    Modal,
    Box,
    Select,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// sections
// mock
import { fDate } from '../utils/formatTime';

import { ShowReviews, ShowFeedBack, UserListHead, UserListToolbar, PurchaseDeliveryInfo } from '../sections/@dashboard/user';


import { getAllPurchase, getDeliveryById, getPurchaseById, getPurchasesByStatus, updatePurchaseStatus } from '../api/PurchaseServices';


// TABLE HEAD
const TABLE_HEAD = [
    { id: 'fullName', label: 'Full Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'createDate', label: 'Create Date', alignRight: false },
    { id: 'priceTotal', label: 'Price Total', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },

    { id: '' },
];

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


export default function PurchaseOderPage() {
    const [open, setOpen] = useState(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [purs, setPurs] = useState([]);
    const [checkUpdate, setCheckUpdate] = useState(0);
    const [search, setSearch] = useState('');
    const [st, setSt] = useState(true);
    const [idSelected, setIdSelected] = useState(null);
    const [delidSelected, setDelidSelected] = useState('');

    const [openDialogReview, setOpenDialogReview] = useState(false);
    const [openDialogFeedBack, setOpenDialogFeedBack] = useState(false);
    const [openDialogDetails, setOpenDialogDetails] = useState(false);
    const [deli, setDeli] = useState({});
    const statusOptions = [
        { value: 'Received', label: 'Received' },
        { value: 'To Ship', label: 'To Ship' },
        { value: 'Canceled', label: 'Canceled' },
        { value: 'Order Placed', label: 'Order Placed' },
        { value: 'In Cart', label: 'In Cart' },


    ];
    const [selectedStatus, setSelectedStatus] = useState('change_status'); // Trạng thái được chọn

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };


    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await getAllPurchase(search, st, 1, 1000);
                console.log(response);
                setPurs(response);
            } catch (error) {
                // Xử lý lỗi tại đây
            }
        };
        fetchData();
    }, [search, st, checkUpdate]);

    const handleFilterByEmailOrPhone = (event) => {
        setSearch(event.target.value);
    }

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
        // if (event.target.checked) {
        //     const newSelecteds = users.map((n) => n.name);
        //     setSelected(newSelecteds);
        //     return;
        // }
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


    const handleDelete = async (idSelected) => {
        console.log(selectedStatus)
        const confirmCancel = window.confirm('Are you sure you want to perform this operation?');
        if (!confirmCancel) return;
        // const data = await getPurchaseById(idSelected);

        const purDTO = {
            id: idSelected,
            status: selectedStatus
        }
        console.log(purDTO)
        const response = await updatePurchaseStatus(purDTO);
        setCheckUpdate(checkUpdate + 1);
    };



    const handleRowClick = (id, delid) => {
        setIdSelected(id);
        setDelidSelected(delid);

    }

    const handleClickReviewDialog = async (id) => {
        // const data = await getUserById(id);
        // setUser(data.result);
        // setOpenDialogReview(true);
    }

    const handleCloseDialogReview = () => {
        setOpenDialogReview(false);
    }

    const handleClickFeedBackDialog = async (id) => {
        // const data = await getUserById(id);
        // setUser(data.result);
        // setOpenDialogFeedBack(true);
    }
    const handleCloseDialogFeedBack = () => {
        setOpenDialogFeedBack(false);
    }

    const handleDetails = async (id) => {
        const data = await getDeliveryById(id);
        setDeli(data);
        setOpenDialogDetails(true);
    }

    const handleCloseDialogDetails = () => {
        setOpenDialogDetails(false);
    }



    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - purs.length) : 0;

    const filteredPurs = applySortFilter(purs, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredPurs.length && !!filterName;




    return (
        <>
            <Helmet>
                <title> PurchaseOder </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom color={'Highlight'}>
                        PurchaseOder
                    </Typography>
                </Stack>
                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={search} onFilterName={handleFilterByEmailOrPhone} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={purs.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredPurs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const selectedUser = selected.indexOf(row.id) !== -1;

                                        return (
                                            <TableRow hover key={row.id} tabIndex={-1} role="checkbox" onClick={() => handleRowClick(row.id, row.deliveryInfoId)}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, row.id)} />
                                                </TableCell>


                                                <TableCell align="left">{row.user.fullName}</TableCell>
                                                <TableCell align="left">{row.user.email}</TableCell>
                                                <TableCell align="left">{fDate(row.createDate)}</TableCell>
                                                <TableCell align="left">{row.priceTotal}</TableCell>
                                                <TableCell align="left">
                                                    <Label color={(row.status === 'Disabled' && 'error') || 'success'}>{sentenceCase(row.status)}</Label>
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
                                                backgroundColor: 'whitesmoke'
                                            },
                                        }}
                                    >
                                        <MenuItem>
                                            <Iconify icon={'eva:edit-fill'} sx={{ mr: 1 }} />
                                            <Button variant="outlined" onClick={() => handleDetails(delidSelected)}>
                                                Details
                                            </Button>
                                        </MenuItem>

                                        <MenuItem>
                                            <Iconify icon={'eva:edit-fill'} sx={{ mr: 1 }} />
                                            <Select
                                                value={selectedStatus}
                                                onChange={handleStatusChange}
                                                onClick={() => handleDelete(idSelected)}
                                            >
                                                <MenuItem value="change_status">Change Status</MenuItem>
                                                {statusOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </MenuItem>





                                        {/* <MenuItem sx={{ color: 'error.main' }}>
                                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 1 }} />
                                            <Button variant="outlined" onClick={() => handleDelete(idSelected)}>
                                                Delete
                                            </Button>
                                        </MenuItem> */}

                                    </Popover>

                                    <PurchaseDeliveryInfo openDialog={openDialogDetails} handleCloseDialog={handleCloseDialogDetails} deli={deli} />

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
                        count={purs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>


            </Container>


        </>
    );
}