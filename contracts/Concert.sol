// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Concert is ReentrancyGuard {
    struct Show {
    uint id;
    string date;
    string billing;
    string city;
    string venue;

  }

  Show[] public shows;
  
  struct Offer {
    uint id;
    uint guarantee;
    uint deposit;
    uint dueDate;
   
  }

    uint public nextId;
    uint public nextEventId;
  
  address payable public purchaser;
  address payable public artist;
  bool public confirmedShow;
  bool finalpayment;
  
  mapping(address => uint) public balanceReceived;
  
  // events
  event PartiesCreated(address purchaser, address artist);
  event EventCreated(uint id, string date, string billing, string city, string venue);
  event OfferCreated(uint id, uint guarantee, uint deposit, uint dueDate);
  event OfferApproved(uint guarantee, uint deposit, uint dueDate);
  event ShowSettled(uint guarantee, uint deposit, uint dueDate);
  
  
  Offer[] public offers;
  
   modifier onlyPurchaser() {
        require(msg.sender == purchaser, "Only Purchaser!");
    _;
    }
    
       modifier onlyArtist() {
        require(msg.sender == artist, "Only Artist!");
    _;
    }
    
    function createEvent(
        string memory date, string memory billing, string memory city, string memory venue) public onlyPurchaser {
        shows.push(Show(nextId, date, billing, city, venue));
        nextId++;
        emit EventCreated(nextId, date, billing, city, venue);
    }
    
    function readEvent() public view returns (Show[] memory) {
        return shows;
    }
    
      function createOffer(uint guarantee, uint deposit, uint dueDate) public onlyPurchaser {
        require(deposit <= guarantee, 'deposit must be at least equal to guarantee');
        offers.push(Offer(nextEventId, guarantee, deposit, dueDate));
        nextEventId++;
        emit OfferCreated(nextEventId, guarantee, deposit, dueDate);
    }
  
  function createParties(address payable _purchaser, address payable _artist) public {
      purchaser = _purchaser;
      artist = _artist;
      
      emit PartiesCreated(_purchaser, _artist);
    
  }
  
    function getAllOffers() public view returns (Offer[] memory) {
        return offers;
    }
  
  function approveOffer(uint _index) public  {
      Offer storage offer = offers[_index];
      require(address(this).balance >= offer.guarantee, 'Not enough money');

    require(offer.deposit > 0, 'already sent');
    artist.transfer(offer.deposit);
    offer.guarantee -= offer.deposit;
    offer.deposit -= offer.deposit;
    

     
    emit OfferApproved(offer.guarantee, offer.deposit, offer.dueDate);
 
  }
  
  function receiveFullGuarantee(uint _index) public onlyArtist nonReentrant() {
      Offer storage offer = offers[_index];
      require(block.timestamp >= offer.dueDate);
      artist.transfer(offer.guarantee);
        offer.guarantee -= offer.guarantee;
        finalpayment = true;

        emit ShowSettled(offer.guarantee, offer.deposit,  offer.dueDate);
      
  }
  
      function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    
        function sendMoney() public payable onlyPurchaser {
        balanceReceived[msg.sender] += msg.value;
        
    }
    
    function withdraw() public onlyPurchaser {
        require(finalpayment == true, "You must complete payment");
        purchaser.transfer(address(this).balance);

    }

  
}