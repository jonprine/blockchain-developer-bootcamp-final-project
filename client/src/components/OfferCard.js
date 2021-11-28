import React from "react";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import { ThumbUpAlt } from "@mui/icons-material";

export default function OfferCard({ offer, handleApprove }) {
  return (
    <div>
      <Card elevation={1} >
        <CardContent>
          <Typography variant="h6" color="primary.main">
            Offer
          </Typography>
        <Typography variant="h7" color="textSecondary">
            Guarantee: { offer.guarantee } wei
            Deposit: {offer.deposit} wei
          </Typography>
         
         
              <IconButton onClick={() => handleApprove(offer.id)}>
              <Typography variant="body2" color="green">
                <ThumbUpAlt /> Confirm Show
                </Typography>
              </IconButton>
              

        </CardContent>
      </Card>
    </div>
  );
}