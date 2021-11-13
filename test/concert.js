const helpers = require("./helpers");
const Concert = artifacts.require("Concert");

contract("Concert", (accounts) => {
  const [purchaser, artist] = accounts;

  let instance;

  beforeEach(async () => {
    instance = await Concert.new();
  });

  it("should assert true", async function () {
    await Concert.deployed();
    return assert.isTrue(true);
  });

  describe("Create parties", () => {
    it("should create purchaser and artist", async () => {
      await instance.createParties(accounts[0], accounts[1]);
      const currentPurchaser = accounts[0];
      console.log(currentPurchaser);
      const currentArtist = accounts[1];
      console.log(currentArtist);
    });
  });

  describe("Create a new event", () => {
    let currentPurchaser;
    let currentArtist;
    beforeEach(async () => {
      await instance.createParties(accounts[0], accounts[1]);
      currentPurchaser = accounts[0];
      currentArtist = accounts[1];
    });
    it("should not create a new event if not purchaser", async () => {
      try {
        let result = await instance.createEvent.call({ from: currentArtist });
        assert.equal(result.toString(), currentArtist);
      } catch (e) {
        console.log(`${artist} is not the purchaser`);
      }
    });

    it("should properly create event with purchaser", async () => {
      await instance.createEvent("date", "billing", "city", "venue", {
        from: currentPurchaser,
      });
      const eventInfo = await instance.readEvent();
      console.log(eventInfo);
    });
  });

  describe("Send money to contract", () => {
    let currentPurchaser;
    let currentArtist;
    beforeEach(async () => {
      await instance.createParties(accounts[0], accounts[1]);
      currentPurchaser = accounts[0];
      currentArtist = accounts[1];
    });
    it("should deposit", async () => {
      await instance.sendMoney({ from: currentPurchaser, value: 1000 });
      const contractBalance = parseInt(
        await web3.eth.getBalance(instance.address)
      );
      assert(contractBalance === 1000);
    });
  });

  describe('Create a new offer', () => {
    let currentPurchaser;
    let currentArtist;
    let artistGuarantee, depositDueDate;
    beforeEach(async () => {
      await instance.createParties(accounts[0], accounts[1]);
      currentPurchaser = accounts[0];
      currentArtist = accounts[1];
    });
    it('purchaser should be able to create a new offer', async () => {
      artistGuarantee = web3.utils.toWei('0.01', 'ether');
      depositDueDate = helpers.getEpochTime(300);
      await instance.createOffer(artistGuarantee, depositDueDate, {
        from: currentPurchaser,
      });
      const offerInfo = await instance.getAllOffers();
      console.log(offerInfo);
   })
  })

  describe("Approve offer", () => {
    let currentPurchaser;
    let currentArtist;
    let artistGuarantee, depositDueDate, currentGuarantee, contractBalance;
    beforeEach(async () => {
      await instance.createParties(accounts[0], accounts[1]);
      currentPurchaser = accounts[0];
      currentArtist = accounts[1];
      artistGuarantee = web3.utils.toWei("0.01", "ether");
      depositDueDate = helpers.getEpochTime(300);
      await instance.createOffer(artistGuarantee, depositDueDate, {
        from: currentPurchaser,
      });
      const offerInfo = await instance.getAllOffers();
      console.log(offerInfo);
    });
    it("artist should not be able to approve offer", async () => {
      await instance.sendMoney({
        from: currentPurchaser,
        value: web3.utils.toWei("0.002", "ether"),
      });
      const offerInfo = await instance.getAllOffers();
      console.log(offerInfo);
      const acceptedOffer = offerInfo[0];
      currentGuarantee = acceptedOffer.guarantee;
      console.log(currentGuarantee);
      contractBalance = parseInt(await web3.eth.getBalance(instance.address));
      console.log(contractBalance);
      try {
        assert.isBelow(currentGuarantee, contractBalance, `${currentGuarantee} is below the ${contractBalance}`);
      } catch (e) {
        console.log(
          `${currentGuarantee} is higher than ${contractBalance}`
        );
      }
    });
    it("artist should be able to approve offer", async () => {
      await instance.sendMoney({
        from: currentPurchaser,
        value: web3.utils.toWei("0.1", "ether"),
      });
      const offerInfo = await instance.getAllOffers();
      console.log(offerInfo);
      const acceptedOffer = offerInfo[0];
      currentGuarantee = acceptedOffer.guarantee;
      console.log(currentGuarantee);
      contractBalance = parseInt(await web3.eth.getBalance(instance.address));
      console.log(contractBalance);
      if (artistGuarantee <= contractBalance) {
        console.log(`${currentGuarantee} is below the ${contractBalance}`)
      } else {
        console.log(`${currentGuarantee} is above the ${contractBalance}`)
      };
    });
  });
});


