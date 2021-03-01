# Decentralized Instagram

The web app allows users to post images on IPFS and save the hash on the Ethereum blockchain. The users are able to tip the authors of the images which determines the order in which the images gets displayed.

## Front End

![portal](https://github.com/igibliss00/decentralized-instagram/blob/master/images/frontend.png)

## Installing

First, install Truffle globally.
```
npm i -g truffle
```
Install the relevant packages:

```
git clone https://github.com/igibliss00/real_estate_erc721_dapp.git
npm install
```

## Running the tests

To run all tests:

```
truffle test
```

## Running the website

1. Download and install Ganache from [here](https://www.trufflesuite.com/ganache).

2. Download and install the MetaMask browser extension from your browser's extension store or from [here](https://metamask.io/download).

3. Migrate the smart contracts to the Ganache's blockchain with `truffle migrate`.

4. Import a MetaMask account by using the private key of one of the Ganache's test accounts.

5. Link your MetaMask to Ganache by registering Ganache's RPC Server and the Network ID to MetaMask's Custom RPC.

6. Start the React app with `npm start`.

7. Now you should be able to upload your files!

In the case that the Web3 is unable to call the smart contract functions, perform `truffle migrate --reset` or disconnect/re-connect the localhost from/to your MetaMask and try again.
