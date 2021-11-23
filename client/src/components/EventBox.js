import React from "react";
import { Box, Typography } from "@mui/material";
import List from '@mui/material/List';


export default function EventBox({show}) {
    return (
        <Box
        border={1}
        elevation={2}
        borderColor="gold"
        height={400}
        width={400}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="primary.main"
        color="white"
      >
       <List>
       <Typography variant="h2" align="center" >
            { show.billing }
          </Typography>
        <Typography variant="h4" align="center">
            { show.date }
          </Typography>
          <Typography variant="h4" align="center">
            { show.city }
          </Typography>
          <Typography variant="h4" align="center">
            { show.venue }
          </Typography>
          </List> 
      </Box>
    );
  }