// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title dyob - do your own band
/// @author Jon Prine
/// @notice A performance agreement between purchaser and artist
contract Concert is Ownable, ReentrancyGuard {

/// @notice creates the basic show details
    struct Show {
    uint id;
    string date;
    string billing;
    string city;
    string venue;
  }

/// @notice creates an array of shows
/// @dev more useful in a future implmentation when offering multiple dates
  Show[] public shows;
  
/// @notice creates the offer details for the show
  struct Offer {
    uint id;
    uint guarantee;
    uint deposit;
    uint dueDate;
  }

  uint public nextId;
  uint public nextEventId;
  
/// @notice sets accounts to purchaser and artist
  address payable public purchaser;
  address payable public artist;

/// @dev this is used to make sure final payment is complete before purchaser can withdraw
  bool finalpayment;

  mapping(address => uint) public balanceReceived;
  
  /// events
  /// @notice creates the parties in the agreement
  event PartiesCreated(address purchaser, address artist);

  /// @notice new show has been created
  event EventCreated(uint id, string date, string billing, string city, string venue);

  /// @notice new offer has been created
  event OfferCreated(uint id, uint guarantee, uint deposit, uint dueDate);

  /// @notice offer has been approved by the artist
  event OfferApproved(uint guarantee, uint deposit, uint dueDate);

  /// @notice final settlement when artist receives full guarantee
  event ShowSettled(uint guarantee, uint deposit, uint dueDate);
  
  /// @dev more useful in future implementation when artist can select
  /// from different offers to a specific show
  Offer[] public offers;
  
   modifier onlyPurchaser() {
        require(msg.sender == purchaser, "Only Purchaser!");
    _;
    }
    
       modifier onlyArtist() {
        require(msg.sender == artist, "Only Artist!");
    _;
    }
    
  /// @notice creates a new show
  /// @param date date in which show will take place
  /// @param billing how the artist will be billed
  /// @param city where the show will take place
  /// @param venue venue where the show will be held
    function createEvent(
        string memory date, string memory billing, string memory city, string memory venue) public onlyPurchaser {
        shows.push(Show(nextId, date, billing, city, venue));
        nextId++;
        emit EventCreated(nextId, date, billing, city, venue);
    }
    
    /// @notice returns all the shows that have been created
    /// @dev will grab the show that was just created. a future implementation to 
    /// do multiple shows
    function readEvent() public view returns (Show[] memory) {
        return shows;
    }
    
    /// @notice creates the offer for the show
    /// @param guarantee the amount in which artist will be paid
    /// @param deposit the amount the artist will be paid upon confirmation
    /// @param dueDate date in which final payment is due
    /// @dev guarantee and deposit must be in wei.  the deposit amount will be
    /// subtracted from the guarantee.  dueDate should be in unix time and should match 
    /// the date of the show.
      function createOffer(uint guarantee, uint deposit, uint dueDate) public onlyPurchaser {
        require(deposit <= guarantee, 'deposit must be at least equal to guarantee');
        offers.push(Offer(nextEventId, guarantee, deposit, dueDate));
        nextEventId++;
        emit OfferCreated(nextEventId, guarantee, deposit, dueDate);
    }
  
  /// @notice creates the two parties invovled in the agreeement
  /// @dev must be 2 separate accounts in order to send and receive the payments
  /// @param _purchaser purchaser will set up the show, offers, and send money to the contract
  /// @param _artist artist will approve the offer and final settlement in order to receive funds
  function createParties(address payable _purchaser, address payable _artist) public {
      purchaser = _purchaser;
      artist = _artist;
      
      emit PartiesCreated(_purchaser, _artist);
    
  }
  
  /// @notice returns the offer for the show
  /// @dev future implementation will have artist choose from different offers
    function getAllOffers() public view returns (Offer[] memory) {
        return offers;
    }
  
  /// @notice artist is able to approve the offer to receive deposit
  /// @param _index artist selects offer to approve
  /// @dev the amount currently in the contract should be greater than the
  /// amount being offered
  function approveOffer(uint _index) public onlyArtist nonReentrant()  {
      Offer storage offer = offers[_index];
      require(address(this).balance >= offer.guarantee, 'Not enough money');

    require(offer.deposit > 0, 'already sent');
    artist.transfer(offer.deposit);
    offer.guarantee -= offer.deposit;
    offer.deposit -= offer.deposit;
    

     
    emit OfferApproved(offer.guarantee, offer.deposit, offer.dueDate);
 
  }


  /// @notice artist receives full guarantee upon completion of show
  /// @dev once the unix time is greater or equal to the block timestamp, the 
  /// artist is able to receive the guarantee
  function receiveFullGuarantee(uint _index) public onlyArtist nonReentrant() {
      Offer storage offer = offers[_index];
      require(block.timestamp >= offer.dueDate);
      artist.transfer(offer.guarantee);
        offer.guarantee -= offer.guarantee;
        finalpayment = true;

        emit ShowSettled(offer.guarantee, offer.deposit,  offer.dueDate);
      
  }
  /// @notice checks current balance of the contract
      function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    
  /// @notice purchaser sends money to fund the show
        function sendMoney() public payable onlyPurchaser {
        balanceReceived[msg.sender] += msg.value;
        
    }
    
  /// @notice purchaser withdraws money from contract
  /// @dev final payment should be received from artist for this to work
    function withdraw() public onlyPurchaser {
        require(finalpayment == true, "You must complete payment");
        purchaser.transfer(address(this).balance);

    }

        function cancelShow(uint _index) public onlyOwner {
        Offer storage offer = offers[_index];
        purchaser.transfer(address(this).balance);
        
    }

  
}