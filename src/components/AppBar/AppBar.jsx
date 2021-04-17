import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';

import { useMediaQuery, withStyles } from '@material-ui/core';

import MaterialAppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';

import { NameContext } from '../../context/NameContext';
import { UserContext } from '../../context/UserContext';

const styles = (theme) => ({
  root: {
    display: 'flex',
    height: 56,
    [theme.breakpoints.up('xs')]: {
      marginBottom: 20,
    },
    [theme.breakpoints.up('mobile')]: {
      marginBottom: 20,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.navBlack.main,
    color: theme.palette.navBlack.contrastText,
  },
  selected: {
    background: theme.palette.action.selected,
  },
  icons: {
    color: '#000',
  },
  drawer: {
    width: 375,
    flexShrink: 0,
    position: 'static !important',
    '& .MuiBackdrop-root': {
      zIndex: 1,
    },
  },
  drawerPaper: {
    width: 375,
  },
  avatar: {
    backgroundColor: '#ffffff',
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    marginLeft: 'auto',
    textTransform: 'uppercase',
  },
  logo: {
    flexGrow: 1,
    textAlign: 'center',
  },
});

const AppBar = ({
  selected,
  classes,
  routes,
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const nameContext = useContext(NameContext);
  const userContext = useContext(UserContext);
  const history = useHistory();

  const pageTitle = (routes.find((item) => item.key === selected) || {}).label;

  const goBack = () => {
    history.goBack();
  };
  // if there is no username, the user might not be signed in
  // so fallback to icon
  let avatar = <PersonIcon color="primary" />;
  if (userContext.userProfile.username) {
    avatar = userContext.userProfile.username[0];
  }
  const showDrawerItems = () => routes.map((item) => {
    const otherProps = {
      selected: item.key === selected,
      color: item.key === selected ? 'primary' : 'inherit',
    };
    return (
      <ListItem
        button
        key={item.key}
        selected={otherProps.selected}
        className={cx({ [classes.selected]: otherProps.selected })}
        onClick={() => {
          setShowDrawer(false);
          history.push(item.path);
        }}
      >
        <ListItemIcon>
          <item.icon className={classes.icons} />
        </ListItemIcon>
        <ListItemText>
          <Typography className={classes.icons} variant="subtitle2">
            {item.label}
          </Typography>
        </ListItemText>
      </ListItem>
    );
  });

  const NavIcons = () => {
    let appIcons;
    if (
      selected === 'spaceDetails'
      || selected === 'addReview'
      || selected === 'reviews'
    ) {
      appIcons = (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="go-back"
          onClick={goBack}
          data-testid="appbar-go-back"
        >
          <ArrowBackIos />
        </IconButton>
      );
    } else {
      appIcons = (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setShowDrawer(!showDrawer)}
          data-testid="appbar-menu"
        >
          <MenuIcon />
        </IconButton>
      );
    }
    return appIcons;
  };

  const Logo = () => {
    const matches = useMediaQuery('(min-width:376px)');
    let logoSrc = '/mobile-appBar-logo.svg';
    if (matches) {
      logoSrc = '/web-appBar-logo.svg';
    }
    return (
      <div className={classes.logo}>
        <img src={logoSrc} alt="logo" />
      </div>
    );
  };

  return (
    <div className={classes.root} data-testid="app-bar">
      <MaterialAppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <NavIcons />
          <Typography variant="h6" data-testid="appbar-title">
            {pageTitle || nameContext.spaceTitle}
          </Typography>
          {pageTitle !== 'undefined' && pageTitle === 'Home' ? <Logo /> : null}
          <Avatar className={classes.avatar}>
            <Link href="/profile" underline="none">
              {avatar}
            </Link>
          </Avatar>
        </Toolbar>
      </MaterialAppBar>
      <Drawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        data-testid="appbar-drawer"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
          backdrop: classes.backdrop,
        }}
      >
        <Toolbar />
        <List>{showDrawerItems()}</List>
      </Drawer>
    </div>
  );
};

AppBar.propTypes = {
  selected: PropTypes.string,
  classes: PropTypes.shape({}).isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

AppBar.defaultProps = {
  selected: 'home',
};

export default withStyles(styles)(AppBar);
