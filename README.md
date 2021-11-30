# Final Project - dyob (do your own band)

## Project Description

dyob is a decentralized booking agreement between 2 parties - purchaser and artist. More so decentralizing the administrative process after negotiating a performance between the two parties.  The purchaser creates a new show which begins with submitting the account address of each party.  The purchaser sends an amount of ether in wei over to the contract to sit in escrow.  The general show details are submitted - Date, Billing, Venue, City, along with the formal offer which includes price(guarantee), deposit, and due date for final payment.  After general details and deal terms are laid out, the offer is sent over for approval from the artist.  Upon confirmation from the artist on the deal terms, the deposit is immediately sent over to the artist account.  After the show date has been played, the artist is able to receive the remainder of the guarantee that is left in escrow.  Any funds left over can be withdrawn by the purchaser.

### Deployed version

https://jonprine.github.io/blockchain-developer-bootcamp-final-project/
Use Ropsten network

### Screencast
https://www.loom.com/share/593f0df8355946de8c375667d360990e

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
- In root directory run `truffle migrate --network development`
- Run `truffle test`
- There should be 10 tests that pass.

### Frontend

- `cd client` `npm run start`
- open http://localhost:3000/

## Workflow

Before beginning the walkthrough of the app please read notes below:

1. Two separate funded metamask accounts are required to be able to switch between purchaser and artist.
2. IMPORTANT: The smart contract is setup for only 1 show agreement.  It has the ability to add additional events / offers but if you create an entirely new show with a new purchaser and artist, you need to run `truffle migrate --reset` prior to implementing the new information.
3. All amounts for the agreement should be in wei.
4. When prompted to enter the dueDate please make sure to use the current unix epoch time.

- User visits deployed website and connects through metamask.
- User goes to New Show and creates the parties - purchaser and artist - by adding the wallet address to each respective field and submits. 
- After the parties are created, the purchaser creates an offer.
- The purchaser needs to send money (in wei) to the contract to fund the show. Make sure you are under the purchaser account. The amount should be higher than what the purchaser is going to offer the artist to help cover gas costs.  Add the amount and 'Send Funds'.
- After the contract is funded, the purchaser begins the process of creating the offer.
- Make sure you are using the account set up for purchaser.
- Purchaser fills out this info:
    - The date of show (a string), how the artist should be billed (a string), city where the event takes place (a string), and venue where the show will be held (a string).
    - The guarantee (amount in which artist is being offered) should be in wei.
    - The deposit (in wei) will be the amount subtracted from the guarantee and sent to the artist once the show is confirmed.
    - Helpful link for eth to wei conversion: https://eth-converter.com/
    - The due date should be in unix time. This is the date / time in which the final payment will be made. In a normal circumstance, it should correlate to the date of show and when performance will be complete.  Due to contraints in testing the app, USE THE CURRENT Unix epoch time. Use this link to find the current unix epoch time: https://www.epochconverter.com/
- Once all the information pertaining to the offer is implemented, the artist is ready to start confirming the show.
- Switch to the account set up for artist. 
- The artist will be able to confirm the show by clicking on 'Confirm Show'. Upon confirmation the deposit is sent immediately to the artist account.
- The next screen will show the current state of the show, with the deposit balance at 0, and guarantee updated to reflect the price less the deposit.
- Once the performance is complete (and again the dueDate should be set to CURRENT unix epoch time) the artist will click on 'Settle the show'.
- Once the show is settled the state should reflect that the guarantee balance is 0.
- After the show has been settled the purchaser is able to withdraw any remaining funds in the contract.
- Switch back to the promoter account.
- Click 'Withdraw' and the remaining funds in the contract will be sent back to the purchaser.

## Environment Variables

```
MNEMONIC=
INFURA_PROJECT_ID=
```

## Future Plans

I had issues implementing a factory pattern so that each contract was an entirely new show so unfortunately you have to reset the migration to be able to create a new show.  My plan is to get this set up so the contract will be able to remain live without having to reset.  I also want to add the option for multiple offers to be submitted for each show, and the artist can approve the best one.  The deal structure for the shows are based off of a flat deal between two parties. I'd like to add the ability to increase the final payment amount to the artist based off ticket sales.


