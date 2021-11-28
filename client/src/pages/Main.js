import React, { useEffect, useState } from "react";
import { getWeb3, getConcert } from "../utils";
import { Grid, Container } from "@mui/material";
import OfferBox from "../components/OfferBox";
import BalanceCard from "../components/BalanceCard";
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
  const [balance, setBalance] = useState([]);
  const history = useHistory();

  

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const concert = await getConcert(web3);
      setWeb3(web3);
      setAccounts(accounts);
      console.log(accounts);
      setConcert(concert);
      let showInfo = await concert.methods.readEvent().call().then();
      let currentShow = showInfo[showInfo.length - 1];
      setShows(currentShow);
      let approvedOffer = await concert.methods.getAllOffers().call().then();
      let currentApprovedOffer = approvedOffer[approvedOffer.length - 1];
      setOffers(currentApprovedOffer);  
      let updatedBalance = await concert.methods.getBalance().call().then();
      setBalance(updatedBalance);
    };
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
  }, []);

  if (
    typeof web3 === "undefined" ||
    typeof accounts === "undefined" ||
    typeof concert === "undefined"
    || typeof shows === 'undefined'
    || typeof offers === 'undefined'
    || typeof balance === 'undefined'
  ) {
    return <div>Loading...</div>;
  }

  const handleReceive = async (id) => {
    

    let approvedOffer = await concert.methods.getAllOffers().call().then();
    let currentApprovedOffer = approvedOffer[approvedOffer.length - 1];
    let guarantee = currentApprovedOffer[1];
    console.log(guarantee);
    
        
      await concert.methods
      .receiveFullGuarantee(id)
      .send({from: accounts[0], gas: 300000})
      .then(() => history.go(0));
  };

  const handleWithdraw = async () => {
    await concert.methods
      .withdraw()
      .send({ from: accounts[0], gas: 3000000 })
      .then(() => history.go(0));
  };

  return (
    <Container>
      <Grid container spacing={8} className={classes.spacing}>
        <Grid item xs={12} md={6} lg={4}>
          <BalanceCard balance={balance} handleWithdraw={handleWithdraw} />
        </Grid>
      </Grid>

      <Grid container spacing={8} className={classes.spacing}>
        <Grid item key={shows.id}>
          <EventBox show={shows}></EventBox>
        </Grid>

        <Grid item key={offers.id}>
          <OfferBox offer={offers} handleReceive={handleReceive}></OfferBox>
        </Grid>
      </Grid>
    </Container>
  );
}
