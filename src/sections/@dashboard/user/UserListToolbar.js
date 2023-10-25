import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment,Box } from '@mui/material';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 400,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 500,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDisableClick: PropTypes.func,
  onActiveClick:PropTypes.func,
  onSpendingClick:PropTypes.func,
};

export default function UserListToolbar({ numSelected, filterName, onFilterName,onDisableClick,onActiveClick,onSpendingClick }) {
  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      
      <Box>
        <Tooltip title="Disable">
          <IconButton size="large" color="inherit" onClick={() => onDisableClick("Disabled")}>
            <Iconify icon="zondicons:block" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Active">
          <IconButton size="large" color="inherit" onClick={() => onActiveClick("Enabled")}>
            <Iconify icon="ooui:user-active" />
          </IconButton>
        </Tooltip> 
        <Tooltip title="Spending">
          <IconButton size="large" color="inherit" onClick={() => onSpendingClick("Pending")}>
            <Iconify icon="mdi:account-pending-outline" />
          </IconButton>
        </Tooltip>
        </Box> 
    </StyledRoot>
  );
}
