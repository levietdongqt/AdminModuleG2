import { useState } from 'react'; // @mui
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  Link,
  Card,
  Divider,
  Typography,
  CardHeader,
  IconButton,
  Popover,
  Grid,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// utils
import { fToNow } from '../../../utils/formatTime';
// components

import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// ----------------------------------------------------------------------

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((news, index) => (
            <NewsItem key={index} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    content: PropTypes.string,
    image: PropTypes.string,
    createDate: PropTypes.instanceOf(Date),
    name: PropTypes.string,
  }),
};

function NewsItem({ news }) {
  const [open, setOpen] = useState(null);
  const [maxLength, setMaxLength] = useState(50);
  const { name, image, content, createDate } = news;
  const [popoverContent, setPopoverContent] = useState('');

  const handleOpenMenu = (event, content) => {
    setOpen(event.currentTarget);
    setPopoverContent(content);
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={name}
        src={`${process.env.REACT_APP_API_BASE_IMAGE}${image}`}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {name}
        </Link>
        <Box>
          <Grid container alignItems="center">
            <Grid>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {content.length > maxLength ? `${content.substring(0, maxLength)}....` : content}
              </Typography>
            </Grid>
            {content.length > maxLength && (
              <Grid>
                <Tooltip title="Expand">
                  <IconButton onClick={(event) => handleOpenMenu(event, content)}>
                    <ExpandMoreIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(createDate)}
      </Typography>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
    </Stack>
  );
}
