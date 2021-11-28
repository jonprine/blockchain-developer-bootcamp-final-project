import React, { useEffect, useState } from "react";
import { getWeb3, getConcert} from '../utils';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles({
    field: {
      marginTop: 20,
      marginBottom: 20,
      display: 'block'
    },
    boxes: {
      padding: 45,
      marginTop: 40
    }
    
  })

export default function Landing() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [concert, setConcert] = useState(undefined);
  const [purchaser, setPurchaser] = useState("");
  const [artist, setArtist] = useState('');
  const [purchaserError, setPurchaserError] = useState(false);
  const [artistError, setArtistError] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const concert = await getConcert(web3);
      setWeb3(web3);
      setAccounts(accounts);
      setConcert(concert);
    };
    init();
  }, []);
 
  if(
    typeof web3 === 'undefined'
    || typeof accounts === 'undefined'
    || typeof concert === 'undefined'
  ) {
    return <div>Loading...</div>
  }

  async function concertSubmit(e) {
    e.preventDefault()
    setPurchaserError(false);
    setArtistError(false)
    
        if (purchaser === "") {
        setPurchaserError(true);
        }
        if (artist === '') {
          setArtistError(true)
        }
        if (purchaser && artist) {
         await concert.methods
            .createParties(purchaser, artist)
            .send({from:accounts[0], gas: 3000000 })
            console.log(purchaser);
            console.log(artist);
        } 
    }
    
  

  return (
    <Container className={classes.boxes}>
       
        <Typography
        className={classes.title}
        variant="h6" 
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Create a New Concert
      </Typography>

      <form noValidate autoComplete="off" onSubmit={concertSubmit}>
        <div>
        <TextField
            className={classes.field}
            onChange={(e) => setPurchaser(e.target.value)}
            label="Purchaser"
            variant="outlined"
            color="secondary"
            required
            error={purchaserError}
          />
        <TextField className={classes.field}
          onChange={(e) => setArtist(e.target.value)}
          label="Artist" 
          variant="outlined" 
          color="secondary" 
          required
          error={artistError}
        />
  
        </div>
        <br />


      <Button
        className={classes.btn}
        onClick={() => console.log('you clicked me')}
        type="submit" 
        color="primary" 
        variant="contained"
        
        
        endIcon={<KeyboardArrowRightIcon />}
        >
        Submit
      </Button>
      </form>

      </Container>
  )
     

}