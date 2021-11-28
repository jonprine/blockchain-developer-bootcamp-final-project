import React, { useEffect, useState } from "react";
import { getWeb3, getConcert } from '../utils';
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

export default function Create() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [concert, setConcert] = useState(undefined);
  const classes = useStyles();
  const history = useHistory();
  const [date, setDate] = useState('');
  const [billing, setBilling] = useState('');
  const [city, setCity] = useState('');
  const [venue, setVenue] = useState('');
  const [guarantee, setGuarantee] = useState('');
  const [deposit, setDeposit] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [sendMoney, setSendMoney] = useState('');
  const [dateError, setDateError] = useState(false);
  const [billingError, setBillingError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [venueError, setVenueError] = useState(false);
  const [guaranteeError, setGuaranteeError] = useState(false);
  const [depositError, setDepositError] = useState(false);
  const [dueDateError, setDueDateError] = useState(false);
  const [sendMoneyError, setSendMoneyError] = useState(false);


  

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
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
  }, []);
 
  if(
    typeof web3 === 'undefined'
    || typeof accounts === 'undefined'
    || typeof concert === 'undefined'
  ) {
    return <div>Loading...</div>
  }

    async function eventSubmit(e) {
        e.preventDefault()
        setDateError(false)
        setBillingError(false)
        setCityError(false)
        setVenueError(false)
        setGuaranteeError(false)
        setDepositError(false)
        setDueDateError(false)
        
    
        if (date === '') {
          setDateError(true)
        }
        if (billing === '') {
          setBillingError(true)
        }
        if (city === '') {
            setCityError(true)
        }
        if (venue === '') {
            setVenueError(true)
        }
        if (guarantee === '') {
          setGuaranteeError(true)
        }
        if (deposit === '') {
          setDepositError(true)
        }
        if (dueDate === '') {
          setDueDateError(true)
        }
        if (date && billing && city && venue && guarantee && deposit && dueDate) {

          web3.utils.toBN(guarantee);
          web3.utils.toBN(deposit);

          await concert.methods
          .createEvent(date, billing, city, venue)
          .send({ from: accounts[0], gas: 3000000 });
          await concert.methods
          .createOffer(guarantee.toString(), deposit.toString(), dueDate)
          .send({ from: accounts[0], gas: 3000000 })
          .then(() => history.push("/offers"));
        } 
        
      }


      async function sendMoneySubmit(e) {
        e.preventDefault()
        setSendMoneyError(false)
    
        if (sendMoney === '') {
          setSendMoneyError(true)
        }
        if (sendMoney) {
         await concert.methods
            .sendMoney()
            .send({ from: accounts[0], gas: 3000000, value: web3.utils.toWei('1', 'ether') })
            
            
        } 
      }




  return (
    <Container className={classes.boxes}>
        <div>
        <Typography
        className={classes.title}
        variant="h6" 
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Create a New Event
      </Typography>

      <form noValidate autoComplete="off" onSubmit={eventSubmit}>
        <div>
        <TextField className={classes.field}
          onChange={(e) => setDate(e.target.value)}
          label="Date" 
          variant="outlined" 
          color="secondary" 
          required
          error={dateError}
        />
        <TextField className={classes.field}
          onChange={(e) => setBilling(e.target.value)}
          label="Billing"
          variant="outlined"
          color="secondary"
          required
          error={billingError}
        />
        <TextField className={classes.field}
          onChange={(e) => setCity(e.target.value)}
          label="City"
          variant="outlined"
          color="secondary"
          required
          error={cityError}
        />
        <TextField className={classes.field}
          onChange={(e) => setVenue(e.target.value)}
          label="Venue"
          variant="outlined"
          color="secondary"
          required
          error={venueError}
        />
        </div>
        <br />
        <div>
           <TextField className={classes.field}
          onChange={(e) => setGuarantee(e.target.value)}
          label="Guarantee(wei)" 
          variant="outlined" 
          color="secondary" 
          required
          error={guaranteeError}
        />
        <TextField className={classes.field}
          onChange={(e) => setDeposit(e.target.value)}
          label="Deposit(wei)"
          variant="outlined"
          color="secondary"
          required
          error={depositError}
        />
        <TextField className={classes.field}
          onChange={(e) => setDueDate(e.target.value)}
          label="Due Date(unix)"
          variant="outlined"
          color="secondary"
          required
          error={dueDateError}
        />
        </div>
        <br />
        <div>

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
      </div>
      </form>

      </div> 

       <br />
      <div>
        <Typography
        className={classes.title}
        variant="h6" 
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Fund the show
      </Typography>

      <form noValidate autoComplete="off" onSubmit={sendMoneySubmit}>
        <TextField className={classes.field}
          onChange={(e) => setSendMoney(e.target.value)}
          label="Send Money" 
          variant="outlined" 
          color="secondary" 
          required
          error={sendMoneyError}
        />
        <br />
      <div>
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
      </div>
      </form>
     

      </div>  
      
        
    </Container>


  )
}