const { assert } = require('chai')
const { default: Web3 } = require('web3')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })
  })

  describe("Image", async () => {
    let result, imageCount, event;
    let hash = "sdjk2334"

    before(async () => {
      result = await decentragram.uploadImage(hash, "new image", { from: author })
      imageCount = await decentragram.imageCount()
      event = result.logs[0].args
    })

    it("Image uploaded successfully", async() => {
      assert.equal(imageCount, 1)
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "Event ID is correct.")
      assert.equal(event.imageHash, hash, "Event hash is correct")
      assert.equal(event.description, "new image", "Event description is correct")
      assert.equal(event.tipAmount, 0, "Event tip amount is correct")
      assert.equal(event.author, author, "Event author is correct")

      // FAILURE: image must have hash
      await decentragram.uploadImage("", "new image", { from: author }).should.be.rejected;

      // FAILURE: image must have description
      await decentragram.uploadImage(hash, "", { from: author }).should.be.rejected;
    })

    it("Check the image components", async() => {
      // Image struct
      let image = await decentragram.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), "Image id is correct")
      assert.equal(image.imageHash, hash, "Image hash is correct")
      assert.equal(image.description, "new image", "Image description is correct")
      assert.equal(image.tipAmount, "0", "Image tip amount is correct")
      assert.equal(image.author, author, "Image author is correct")
    })

    it("Allows users to tip images", async () => {
      // track the old balance
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
  
      // tip
      let description = "new image"
      let tip = web3.utils.toWei("1", "Ether")
      result = await decentragram.tipImageOwner(imageCount, { from: tipper, value: tip})
  
      //SUCCESS
      // event
      let event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "Event ID is correct")
      assert.equal(event.imageHash, hash, "Event hash is corret")
      assert.equal(event.description, description, "Event description is correct")
      assert.equal(event.tipAmount, tip, "Event tip amount is correct")
      assert.equal(event.author, author, "Event author is the same")
  
      // balance
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)
  
      const expectedBalance = oldAuthorBalance.add(new web3.utils.BN(tip))
      assert.equal(expectedBalance.toString(), newAuthorBalance.toString(), "The new balance is correct")
  
      // FAILURE: tries to tip a non-existing image
      await decentragram.tipImageOwner(100, { from: tipper, value: tip}).should.be.rejected
    })
  })



  // describe('images', async () => {
  //   let result, imageCount
  //   const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

  //   before(async () => {
  //     result = await decentragram.uploadImage(hash, 'Image description', { from: author })
  //     imageCount = await decentragram.imageCount()
  //   })

  //   //check event
  //   it('creates images', async () => {
  //     // SUCESS
  //     assert.equal(imageCount, 1)
  //     const event = result.logs[0].args
  //     assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
  //     assert.equal(event.hash, hash, 'Hash is correct')
  //     assert.equal(event.description, 'Image description', 'description is correct')
  //     assert.equal(event.tipAmount, '0', 'tip amount is correct')
  //     assert.equal(event.author, author, 'author is correct')


  //     // FAILURE: Image must have hash
  //     await decentragram.uploadImage('', 'Image description', { from: author }).should.be.rejected;

  //     // FAILURE: Image must have description
  //     await decentragram.uploadImage('Image hash', '', { from: author }).should.be.rejected;
  //   })

  //   //check from Struct
  //   it('lists images', async () => {
  //     const image = await decentragram.images(imageCount)
  //     assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
  //     assert.equal(image.hash, hash, 'Hash is correct')
  //     assert.equal(image.description, 'Image description', 'description is correct')
  //     assert.equal(image.tipAmount, '0', 'tip amount is correct')
  //     assert.equal(image.author, author, 'author is correct')
  //   })

  //   it('allows users to tip images', async () => {
  //     // Track the author balance before purchase
  //     let oldAuthorBalance
  //     oldAuthorBalance = await web3.eth.getBalance(author)
  //     oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

  //     result = await decentragram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

  //     // SUCCESS
  //     const event = result.logs[0].args
  //     assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
  //     assert.equal(event.hash, hash, 'Hash is correct')
  //     assert.equal(event.description, 'Image description', 'description is correct')
  //     assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
  //     assert.equal(event.author, author, 'author is correct')

  //     // Check that author received funds
  //     let newAuthorBalance
  //     newAuthorBalance = await web3.eth.getBalance(author)
  //     newAuthorBalance = new web3.utils.BN(newAuthorBalance)

  //     let tipImageOwner
  //     tipImageOwner = web3.utils.toWei('1', 'Ether')
  //     tipImageOwner = new web3.utils.BN(tipImageOwner)

  //     const expectedBalance = oldAuthorBalance.add(tipImageOwner)

  //     assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

  //     // FAILURE: Tries to tip a image that does not exist
  //     await decentragram.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
  //   })
  // })
})