# Design Patterns

## Access Control
- `Ownable` is used to by contract creator.  The contract creator is able to cancel a 
show in the event something happens and the artist or purchaser is unable to particpate in a show that has been created.  The funds will be returned to the purchaser upon cancelation. 

- `purchaser` and `artist` have specific roles designed to participate in the contract.

## Utils
- `nonReentrant` is used to protect the escrow balance within the contract.