import React from "react";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { ThumbUpAlt } from "@mui/icons-material";



export default function OfferCard({ balance, handleWithdraw }) {
  return (
    <div>
      <Card elevation={1} >
        <CardContent>
        <IconButton >
              <Typography variant="body2" color="primary.main">
                <AccountBalanceIcon />
                </Typography>
              </IconButton>
        <Typography variant="h6" color="primary.main">
            Balance: { balance } wei
          </Typography>
          <div>
          <IconButton onClick={() => handleWithdraw()}>
              <Typography variant="body2" color="primary.main">
                <ThumbUpAlt /> Withdraw
                </Typography>
              </IconButton>
              </div>
        </CardContent>
      </Card>
    </div>
  );
}