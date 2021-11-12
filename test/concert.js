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
    it("should not create a new event if not purchaser", async () => {
      await instance.createParties(accounts[0], accounts[1]);
      const currentPurchaser = accounts[0];
      const currentArtist = accounts[1];
      try {
        let result = await instance.createEvent.call({ from: currentArtist });
        assert.equal(result.toString(), currentArtist);
      } catch (e) {
        console.log(`${artist} is not the purchaser`);
      }
    });

    it("should properly create event with purchaser", async () => {
      await instance.createParties(accounts[0], accounts[1]);
      const currentPurchaser = accounts[0];
      await instance.createEvent("date", "billing", "city", "venue", {
        from: currentPurchaser,
      });
      const eventInfo = await instance.readEvent();
      console.log(eventInfo);
    });
  });

  describe("Send money to contract", () => {
    it("should deposit", async () => {
      await instance.createParties(accounts[0], accounts[1]);
      const currentPurchaser = accounts[0];
      await instance.sendMoney({ from: currentPurchaser, value: 1000 });
      const contractBalance = parseInt(
        await web3.eth.getBalance(instance.address)
      );
      assert(contractBalance === 1000);
    });
  });

  describe('Create a new offer', () => {
    let artistGuarantee, depositDueDate;
    it('purchaser should be able to create a new offer', async () => {
      artistGuarantee = web3.utils.toWei('0.01', 'ether');
      depositDueDate = helpers.getEpochTime(300);
      await instance.createParties(accounts[0], accounts[1]);
      const currentPurchaser = accounts[0];
      await instance.createOffer(artistGuarantee, depositDueDate, {
        from: currentPurchaser,
      });
      const offerInfo = await instance.getAllOffers();
      console.log(offerInfo);

    })
  })

  describe('Approve offer', () => {
    let artistGuarantee;
    it('artist should be able to approve offer', async () => {
      await instance.createParties(accounts[0], accounts[1]);
      const currentPurchaser = accounts[0];
      const currentArtist = accounts[1];
      artistGuarantee = 500;
      await instance.sendMoney({ from: currentPurchaser, value: 1000 });
      const offerInfo = await instance.getAllOffers();
      const acceptedOffer = offerInfo[0];
      try {
        acceptedOffer >= artistGuarantee
        assert.equal(result.toString(), acceptedOffer);
      } catch (e) {
        console.log(`${acceptedOffer} not higher than ${artistGuarantee}`);
      }
    })
  })
});


