import 'moment/locale/pl';
import { MouseEvent, useState, useEffect } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { selectUser } from '../features/authentication/services/slices/userSlice';
import { selectTheme, setTheme } from '../features/theme/themeSlice';
import { selectFavoriteOffers } from '../features/home/services/slices/favoriteOffersSlice';
import useGetMenuItems from '../hooks/useGetMenuItems';
import useLogoutUser from '../hooks/useLogoutUser';

import {
  AppBar,
  Box,
  Button,
  Badge,
  CircularProgress,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WarningIcon from '@mui/icons-material/Warning';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIconComponent from '../features/notifications/components/NotificationsIcon';

import { ChangeLanguage } from '../components';

const Header = () => {
  const { t } = useTranslation(['common']);
  const user = useAppSelector(selectUser);
  const mode = useAppSelector(selectTheme);
  const favorites = useAppSelector(selectFavoriteOffers);
  const menuItems = useGetMenuItems();
  const { logoutHandler, isLoading } = useLogoutUser();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if ((localStorage.getItem('i18nextLng')?.length as number) > 2) {
      i18next.changeLanguage('pl');
      moment().locale('pl');
    }
  }, []);

  const handleMenuOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'background.default' }}>
      <Toolbar>
        <Typography
          component="h1"
          variant="h5"
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer', letterSpacing: '1px', fontWeight: 600 }}
          color={mode === 'dark' ? 'white' : 'black'}
        >
          work
          <Typography
            variant="h5"
            color="primary"
            component="span"
            sx={{ fontWeight: 600 }}
          >
            IT
          </Typography>
        </Typography>

        <IconButton
          aria-label="switch theme"
          sx={{ ml: 1 }}
          onClick={() => dispatch(setTheme(mode === 'dark' ? 'light' : 'dark'))}
        >
          {mode === 'dark' ? (
            <LightModeIcon color="warning" />
          ) : (
            <DarkModeIcon color="info" />
          )}
        </IconButton>

        <Box
          alignItems="center"
          gap={3}
          sx={{ display: { xs: 'none', sm: 'flex' }, ml: 'auto' }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              color="secondary"
            >
              {t('Offers')}
            </Typography>
          </Link>

          <Badge
            sx={{ cursor: 'pointer' }}
            badgeContent={favorites?.length}
            color="secondary"
            onClick={() => navigate('/favorites')}
          >
            <FavoriteBorderIcon
              sx={{
                color: mode === 'dark' ? 'white' : 'black',
                cursor: 'pointer',
              }}
            />
          </Badge>

          {user && <NotificationsIconComponent />}

          {!user ? (
            <>
              <LoadingButton
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
                onClick={() => navigate('/login')}
              >
                Login
              </LoadingButton>
              <LoadingButton
                color="primary"
                variant="contained"
                sx={{ fontWeight: 600 }}
                onClick={() => navigate('/register')}
              >
                {t('Sign Up')}
              </LoadingButton>
            </>
          ) : (
            <>
              <Button onClick={handleMenuOpen}>
                <Stack direction="row" gap={2}>
                  <Avatar
                    style={{ height: 36, width: 36, borderRadius: 18 }}
                    src={
                      user?.photo ||
                      'https://firebasestorage.googleapis.com/v0/b/work-it-4635f.appspot.com/o/placeholder_img.jpg?alt=media&token=0283222b-84b5-4945-9f44-b342c8efe844'
                    }
                    alt="user photo"
                  />

                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                    color="primary"
                  >
                    {user?.name}{' '}
                    {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Typography>
                </Stack>
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {menuItems?.map((item, idx) => (
                  <Box key={item.text}>
                    {item.text === t('Offer Creator') ? (
                      <MenuItem
                        disabled={!user?.employerProfile?.canCreateOffer}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'center',
                        }}
                        onClick={() => {
                          if (user?.employerProfile?.canCreateOffer) {
                            item.onClick();
                          }
                          handleMenuClose();
                        }}
                      >
                        {!user?.employerProfile?.canCreateOffer ? (
                          <WarningIcon
                            sx={{ width: 20, height: 20, color: 'orange' }}
                          />
                        ) : (
                          <>{item.icon}</>
                        )}{' '}
                        {item.text}
                      </MenuItem>
                    ) : (
                      <MenuItem
                        sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}
                        onClick={() => {
                          item.onClick();
                          handleMenuClose();
                        }}
                      >
                        {item.icon} {item.text}
                      </MenuItem>
                    )}
                  </Box>
                ))}
                <MenuItem
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                    gap: 1.5,
                    alignItems: 'center',
                  }}
                  onClick={() => {
                    navigate('/favorites');
                    handleMenuClose();
                  }}
                >
                  <FavoriteBorderIcon /> Favorites
                </MenuItem>
                <Divider />
                <Box sx={{ mt: 1, mb: 1, px: 1, mx: 'auto' }}>
                  <ChangeLanguage />
                </Box>

                <LoadingButton
                  sx={{
                    display: 'flex',
                    width: '100%',
                    gap: 1.5,
                    fontWeight: 600,
                  }}
                  color="primary"
                  onClick={() => {
                    logoutHandler();
                    handleMenuClose();
                  }}
                  loading={isLoading}
                  loadingIndicator={
                    <CircularProgress color="inherit" size={16} />
                  }
                >
                  <LogoutIcon /> {t('Log Out')}
                </LoadingButton>
              </Menu>
            </>
          )}
        </Box>

        {!user && (
          <>
            <LoadingButton
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                display: { xs: 'flex', sm: 'none' },
                fontWeight: 600,
                ml: 'auto',
                mr: 1,
              }}
              onClick={() => navigate('/login')}
            >
              Login
            </LoadingButton>
            <LoadingButton
              color="primary"
              variant="contained"
              size="small"
              sx={{
                display: { xs: 'flex', sm: 'none' },
                fontWeight: 600,
                mr: 1,
              }}
              onClick={() => navigate('/register')}
            >
              {t('Sign Up')}
            </LoadingButton>
          </>
        )}

        {user && <NotificationsIconComponent isMobile />}

        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
