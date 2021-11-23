import React from "react";
import { Box, Typography } from "@mui/material";
import List from '@mui/material/List';
import { IconButton } from "@mui/material";
import { ThumbUpAlt } from "@mui/icons-material";


export default function OfferBox({offer, handleReceive}) {
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
       <Typography variant="h5">
            Confirmed Offer
          </Typography>
        <Typography variant="h6">
            Guarantee Balance: { offer.guarantee } wei
          </Typography>
          <Typography variant="h6" >
            Deposit Balance: { offer.deposit} wei
          </Typography>
          <Typography variant="h6" >
            Final Payment Due: { offer.dueDate}
          </Typography>
          <div>
          <IconButton onClick={() => handleReceive(offer.id)}>
              <Typography variant="body2" color="white">
                <ThumbUpAlt /> Settle the show
                </Typography>
              </IconButton>
              </div>
          </List> 

      </Box>
    );
  }