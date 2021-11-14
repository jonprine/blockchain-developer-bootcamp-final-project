// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Concert is ReentrancyGuard {
    struct Event {
    string date;
    string billing;
    string city;
    string venue;

  }
  
  Event myEvent;
  
  struct Offer {
    uint guarantee;
    uint deposit;
    bool confirmed;
    bool depositPaid;
    uint dueDate;
    bool guaranteePaid;
  
      
  }
  
  address payable public purchaser;
  address payable public artist;
  bool public confirmedShow;
  bool finalpayment;
  
  mapping(address => uint) public balanceReceived;
  
  // events
  event PartiesCreated(address purchaser, address artist);
  event EventCreated(string date, string billing, string city, string venue);
  event OfferCreated(uint guarantee, uint deposit, bool confirmed, bool depositPaid, uint dueDate, bool guaranteePaid);
  event OfferApproved(uint guarantee, uint deposit, bool confirmed, bool depositPaid, uint dueDate, bool guaranteePaid);
  event ShowSettled(uint guarantee, uint deposit, bool confirmed, bool depositPaid, uint dueDate, bool guaranteePaid);
  
  
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
    string memory _date,
    string memory _billing,
    string memory _city,
    string memory _venue
    
    )
    public
    onlyPurchaser
     {
        myEvent.date = _date;
        myEvent.billing = _billing;
        myEvent.city = _city;
        myEvent.venue = _venue;
        
        emit EventCreated(_date, _billing, _city, _venue);
        
    }
    
        function readEvent()
        public view
        returns(string memory date, string memory billing, string memory venue, string memory city)
    {
        date = myEvent.date;
        billing = myEvent.billing;
        venue = myEvent.venue;
        city = myEvent.city;
    }

  function createOffer(uint _guarantee, uint _dueDate) 
    public
    onlyPurchaser
    {
    Offer memory offer = Offer({
        guarantee: _guarantee,
        dueDate: _dueDate,
        deposit: _guarantee / 2,
        confirmed: false,
        depositPaid: false,
        guaranteePaid: false
        
        
    });
    offers.push(offer);
    
    emit OfferCreated(_guarantee, offer.deposit, offer.confirmed, offer.depositPaid, _dueDate, offer.guaranteePaid);
  }
  
  function createParties(address payable _purchaser, address payable _artist) public {
      purchaser = _purchaser;
      artist = _artist;
      
      emit PartiesCreated(_purchaser, _artist);
    
  }
  
    function getAllOffers() public view returns (Offer[] memory) {
        return offers;
    }
  
  
  function approveOffer(uint _index) public onlyArtist nonReentrant() {
      Offer storage offer = offers[_index];
      require(address(this).balance >= offer.guarantee, 'Not enough money');
      offer.confirmed = true;
      confirmedShow = true;
    //   require(deposit > 0, 'already sent');
    (bool success, ) = artist.call{value:offer.deposit}('');
        
    require(success, "Transfer failed.");
    offer.guarantee -= offer.deposit;
    offer.deposit -= offer.deposit;
    offer.depositPaid = true;
     
    emit OfferCreated(offer.guarantee, offer.deposit, offer.confirmed, offer.depositPaid, offer.dueDate, offer.guaranteePaid);
 
  }
  
  function receiveFullGuarantee(uint _index) public onlyArtist nonReentrant() {
      Offer storage offer = offers[_index];
      require(block.timestamp >= offer.dueDate);
      (bool success, ) = artist.call{value:offer.guarantee}('');
        require(success, "Transfer failed.");
        offer.guarantee -= offer.guarantee;
        offer.guaranteePaid = true;
        finalpayment = true;

        emit ShowSettled(offer.guarantee, offer.deposit, offer.confirmed, offer.depositPaid, offer.dueDate, offer.guaranteePaid);
      
  }
  
      function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    
        function sendMoney() public payable onlyPurchaser {
        balanceReceived[msg.sender] += msg.value;
        
    }
    
    function cancelShow(uint _index) public onlyPurchaser {
        Offer storage offer = offers[_index];
        offer.confirmed = false;
        purchaser.transfer(address(this).balance);
        
    }
    
    function withdraw() public onlyPurchaser {
        require(finalpayment == true, "You must complete payment");
        purchaser.transfer(address(this).balance);

    }

  
}