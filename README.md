# Final Project - dyob (do your own band)

## Project Description

dyob is a decentralized booking agreement between 2 parties - purchaser and artist. More so decentralizing the administrative process after negotiating a performance between the two parties. Once an offer is negotiated, an offer is sent from the purchaser to artist on chain.  The purchaser creates a new show which begins with submitting the wallet address of each party.  The purchaser sends an amount of ether in wei over to the contract to sit in escrow.  The general show details are submitted - Date, Billing, Venue, City, along with the formal offer which includes price(guarantee), deposit, and due date for final payment.  After general details and deal terms are laid out, the offer is sent over for approval from the artist.  Upon confirmation from the artist on the deal terms, the deposit is immediately sent over to the artist wallet.  After the show date has been played, the artist is able to receive the remainder of the guarantee that is left in escrow.  Any funds left over can be withdrawn by the purchaser.

### Deployed version

https://jonprine.github.io/blockchain-developer-bootcamp-final-project/

### Screencast


### Public ethereum account

jonprine.eth

## Directory Structure

- `client`: Contains the project's frontend.
- `contracts`: Contains the smart contracts
- `migrations`: Contains the migration files for deploying the contracts.
- `test`: Contains the tests for the smart contract.

## How to run dyob locally

### Prerequisites

- Node.js
- Truffle
- Ganache

### Install

- git clone repository
- in root, `npm install`
- `cd client` `npm install`

### Contracts and Testing

- Open up Ganache to run in port `8545`
- In root directory - `truffle migrate --network development`
- In Truffle console: `test`
- There should be 10 tests that pass.

### Frontend

- `cd client` `npm run start`
- open http://localhost:3000/

## Workflow

- 2 separate metamask accounts are needed to be able to switch between purchaser and artist.
- User visits deployed website and connects through metamask.
- User goes to New Show and creates the parties - purchaser and artist - by adding the wallet address to each respective field and submits. The first user to the site is usually the purchaser.
- After the parties are created, the purchaser creates an offer.
- The purchaser needs to send money (in wei) to the contract to fund the show.  The amount should be higher than what the purchaser is going to offer the artist to help cover gas costs.
- After the contract is funded, the purchaser begins the process of creating the offer.
- The date of show (a string), how the artist should be billed (a string), city where the event takes place (a string), and venue where the show will be held (a string).
- The guarantee (amount in which artist is being offered) should be in wei.
- The deposit (in wei) will be the amount subtracted from the guarantee and sent to the artist once the show is confirmed.
    https://eth-converter.com/
- The due date should be in unix time. This is the date / time in which the final payment will be paid. It should coorrelate to the date of show and when performance will be complete.  Due to contraints in testing the app, USE THE CURRENT Unix epoch time.  https://www.epochconverter.com/
- Under the artist account - the artist will be able to confirm the show by clicking on 'Confirm Show'. Upon confirmation the deposit is sent immediately to the account.
- The current screen will show the current state of the show, with the deposit balance at 0, and guarantee updated to reflect the price less the deposit.
- Once the performance is complete (and again the dueDate should be set to CURRENT unix epoch time) the artist will click on 'Settle the show'.
- Once the show is settled the state should reflect that the guarantee balance is 0.
- After the show has been settled the purchaser is able to withdraw any remaining funds in the contract.

## Environment Variables

```
MNEMONIC=
INFURA_PROJECT_ID=
```




