import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAndStoreUserDetails } from '../../controller/registerController';
import { getDataFromLocalStorage, getUserDetailsFromLocalStorage } from '../../localStorageComp/storage';
import PersonIcon from '@mui/icons-material/Person';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import MenuIcon from '@mui/icons-material/Menu';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';
import SecurityIcon from '@mui/icons-material/Security';

const useStyles = makeStyles((theme) => ({
  iconsLineParent: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    cursor: 'pointer',
  },
  selectedCategory: {
    fontWeight: 'bold',
  },
  categories: {
    position: 'absolute',
    height: 300,
    width: 250,
    top: '13.35%',
    right: '78.48%',
    bottom: '50%',
    left: '2.78%',
    borderRadius: 16,
    backgroundColor: '#fcfcfd',
    boxShadow: '0px 64px 64px -48px rgba(15, 15, 15, 0.08)',
    border: '1px solid #f4f5f6',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '48px 32px',
    gap: 40,
    textAlign: 'left',
    fontSize: 14,
    color: '#8dc8fd',
    zIndex: 10,
  },
}));

interface CategoryMenuProps {
  selectedCategory: string;
  open?: boolean;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ open, selectedCategory: initialSelectedCategory }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCategoryClick = (category: string, path: string) => {
    setSelectedCategory(category);
    navigate(path);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const handleMenuItemClick = (url: string) => {
    window.open(url, '_blank'); // Open link in a new tab
    handleMenuClose();
  };

  useEffect(() => {
    const initializeUserDetails = async () => {
      const storedUserDetails = getUserDetailsFromLocalStorage();
      if (storedUserDetails && storedUserDetails.userDetail) {
        setUserDetails(storedUserDetails.userDetail);
      } else {
        const userData = getDataFromLocalStorage('user');
        if (userData && userData.id) {
          const fetchedUserDetails = await fetchAndStoreUserDetails(userData.id);
          setUserDetails(fetchedUserDetails.userDetail);
        } else {
          navigate('/'); // Redirect to login page if user data is not found
        }
      }
    };

    initializeUserDetails();
  }, [navigate]);

  return (
    <>
      {(isMdUp || open) && (
        <Box className={classes.categories}>
          <Box
            className={`${classes.iconsLineParent} ${selectedCategory === 'PersonalInfo' ? classes.selectedCategory : ''}`}
            onClick={() => handleCategoryClick('PersonalInfo', '/profile')}
          >
            <PersonIcon />
            <Typography variant="body1">
              Personal Info
            </Typography>
          </Box>
          <Box
            className={`${classes.iconsLineParent} ${selectedCategory === 'MyNotes' ? classes.selectedCategory : ''}`}
            onClick={() => handleCategoryClick('MyNotes', '/notes')}
          >
            <NoteAltIcon />
            <Typography variant="body1">
              My Notes
            </Typography>
          </Box>
          <Box
            className={`${classes.iconsLineParent} ${selectedCategory === 'LoginSecurity' ? classes.selectedCategory : ''}`}
            onClick={() => handleCategoryClick('LoginSecurity', '/LoginAndSecurity')}
          >
            <SecurityIcon />
            <Typography variant="body1">
              Login and Security
            </Typography>
          </Box>
          <Box
            className={`${classes.iconsLineParent} ${selectedCategory === 'Feedback' ? classes.selectedCategory : ''}`}
            onClick={() => handleMenuItemClick('https://forms.gle/NXYkGoCh3uS8hsDq6')}
            // ('https://qurenote.ai/feedback-form/')
          >
            <FeedbackIcon />
            <Typography variant="body1">
              Feedback
            </Typography>
          </Box>
          <Box
            className={`${classes.iconsLineParent} ${selectedCategory === 'UserManual' ? classes.selectedCategory : ''}`}
            onClick={handleMenuClick}
          >
            <MenuIcon />
            <Typography variant="body1">
              Documentation
            </Typography>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuItemClick('https://qurenote.ai/user-guide/')}>User Guide</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('https://qurenote.ai/faq/')}>FAQ</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('https://qurenote.ai/help-center/')}>Help Center</MenuItem>
          </Menu>
        </Box>
      )}
    </>
  );
};

export default CategoryMenu;




