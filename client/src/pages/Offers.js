import React, { useEffect, useState } from "react";
import { getWeb3, getConcert } from "../utils";
import { Grid, Container } from "@mui/material";
import OfferCard from "../components/OfferCard";
import EventBox from "../components/EventBox";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  spacing: {
    padding: 45,
    marginTop: 40,
  },
});

export default function Offers() {
  const classes = useStyles();
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [concert, setConcert] = useState(undefined);
  const [shows, setShows] = useState([]);
  const [offers, setOffers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const concert = await getConcert(web3);
      setWeb3(web3);
      setAccounts(accounts);
      setConcert(concert);
      let showInfo = await concert.methods.readEvent().call().then();
      let currentShow = showInfo[showInfo.length - 1];
      setShows(currentShow);
      let approvedOffer = await concert.methods.getAllOffers().call().then();
      let currentApprovedOffer = approvedOffer[approvedOffer.length - 1];
      setOffers(currentApprovedOffer);


    };
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
  }, []);

  if (
    typeof web3 === "undefined" ||
    typeof accounts === "undefined" ||
    typeof concert === "undefined" ||
    typeof shows === "undefined" ||
    typeof offers === "undefined"
  ) {
    return <div>Loading...</div>;
  }

  const handleApprove = async (id) => {

   
  
    await concert.methods
    .approveOffer(id)
    .send({from: accounts[0], gas: 300000})
    .then(() => history.push('/'));
  };

  return (
    <Container>
      <div>
        <Grid container justifyContent="center" className={classes.spacing}>
          <Grid item key={shows.id}>
            <EventBox show={shows}></EventBox>
          </Grid>
        </Grid>
      </div>
      <div>
        <Grid
          container
          spacing={8}
          alignItems="center"
          justifyContent="center"
          className={classes.spacing}
        >
          <Grid item xs={12} md={6} lg={4} key={offers.id}>
            <OfferCard offer={offers} handleApprove={handleApprove} />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
