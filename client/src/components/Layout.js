import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useHistory, useLocation } from "react-router";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AddCircleOutlined, SubjectOutlined } from "@mui/icons-material";



const drawerWidth = 220

const useStyles = makeStyles({
  page: {
    background: '#f9f9f9',
    width: '100%',
  },
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  active: {
    background: '#f4f4f4'
  },
})

export default function Layout({ children }) {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  const menuItems = [
    { 
      text: 'New Show', 
      icon: <AddCircleOutlined color="primary" />, 
      path: '/landing' 
    },

    { 
      text: 'Create Offer', 
      icon: <AddCircleOutlined color="primary" />, 
      path: '/create' 
    },
  ];

  return (
    <div className={classes.root}>
      {/* app bar */}

      {/* side drawer */}
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
        anchor="left"
      >
        <div>
    
          <Typography variant="h4" className={classes.title} color="primary.main">
            dYOb 
          </Typography>
   
        </div>

        {/* links/list section */}
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => history.push(item.path)}
              className={location.pathname === item.path ? classes.active : null}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        
      </Drawer>

      {/* main content */}
      <div className={classes.page}>
        { children }
      </div>
    </div>
  )
}