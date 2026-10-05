# ITEH NFT Marketplace

An Ethereum NFT marketplace where users mint artwork as ERC-721 tokens, list them at a price, and buy them with MetaMask, with royalties paid out on every sale.

<p align="center">
  <img src="src/assets/plavi_logo.png" alt="FD logo" width="140">
</p>

![Solidity](https://img.shields.io/badge/Solidity-0.8.11-363636?style=flat-square&logo=solidity)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=flat-square&logo=ethereum)
![Truffle](https://img.shields.io/badge/Truffle-5E464D?style=flat-square&logo=truffle&logoColor=white)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4E5EE4?style=flat-square&logo=openzeppelin&logoColor=white)
![React](https://img.shields.io/badge/React-17-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![web3.js](https://img.shields.io/badge/web3.js-F16822?style=flat-square&logo=web3dotjs&logoColor=white)
![IPFS](https://img.shields.io/badge/IPFS-Pinata-65C2CB?style=flat-square&logo=ipfs&logoColor=white)
![MetaMask](https://img.shields.io/badge/MetaMask-F6851B?style=flat-square&logo=metamask&logoColor=white)

<!-- TODO: add screenshot -->

## Overview

This is the course project version of my NFT marketplace, built for **Internet Technologies (ITEH)**. It covers the full dApp loop: a Solidity contract deployed to the Sepolia testnet, image storage on IPFS, and a React frontend that talks to the contract through web3.js and MetaMask.

I later forked this codebase into [NFTMarketplace](https://github.com/lakygosh/NFTMarketplace) ("Achievables"), which keeps the same contract but repositions the app as a student achievement portfolio. The differences:

| | ITEH-NFTMarketplace (this repo) | NFTMarketplace |
|---|---|---|
| Concept | Art marketplace ("Buy and Sell") | Student achievement portfolio ("Study and Achieve") |
| Minting | User sets a sale price in ETH | Price fixed at 0, badges are not for sale |
| Trading | Purchase and change-price flows wired to the contract | Buying and price changes disabled in the UI |
| Extra UI | – | Profile modal, Collections page prototype |

## Key features

- **Wallet login with MetaMask**: connects on load and reloads on chain or account changes.
- **Mint NFTs**: upload an image, set title, description and price, pin the file to IPFS through Pinata, then mint with a 0.01 ETH fee.
- **Marketplace gallery**: all minted tokens loaded from the contract, showing title, description and current price.
- **Buy NFTs**: purchase a listed token. The payment goes to the seller, minus a royalty for the artist.
- **Change price**: owners can update the listing price of their token.
- **Transaction history**: on-chain sales with buyer, price and timestamp.

## Tech stack

| Layer | Technology |
|---|---|
| Smart contract | Solidity 0.8.11, ERC-721 Enumerable, OpenZeppelin `Ownable` |
| Tooling | Truffle, Ganache (local), `@truffle/hdwallet-provider` + Infura (Sepolia / Goerli) |
| Frontend | React 17 (Create React App + `react-app-rewired`), Tailwind CSS, `react-hooks-global-state` |
| Web3 | web3.js 1.x, MetaMask |
| Storage | IPFS via the Pinata pinning API |

## Technical highlights

- **`NFTMarketplace.sol`** implements:
  - `payToMint(title, description, metadataURI, salesPrice)`: requires the mint fee, rejects duplicate metadata URIs, pays the royalty to the artist and the remainder to the contract owner, then mints the token.
  - `payToBuy(id)`: checks the price, pays the royalty to the artist and the rest to the current owner, and records the sale.
  - `changePrice(id, newPrice)`: owner-only price update.
  - Read methods `getAllNFTs`, `getNFTDetails` and `getAllTransactions` return the on-chain history as `Transaction` structs.
- **Deployment**: the migration deploys the contract as `NFT Marketplace` / `FD` with a 10% royalty and the deployer as the artist. The bundled ABI in `src/abis/` targets a Sepolia deployment (network id `11155111`).
- **IPFS upload**: `src/pinata.js` posts images as `multipart/form-data` to Pinata's `pinFileToIPFS` endpoint, and the gateway URL becomes the token's metadata URI.
- **Browser polyfills**: `config-overrides.js` adds Node core polyfills so web3.js runs under webpack 5.

### Known limitations

- `payToBuy` transfers the payment and logs the sale but does not transfer the ERC-721 token or update the listed owner, so ownership on-chain stays with the minter.
- The contract owner (the deployer) cannot mint, so use a second account when testing.

## Getting started

### Prerequisites

- Node.js and Yarn or npm
- Truffle (`npm i -g truffle`) and Ganache for local development
- MetaMask in the browser
- A Pinata account for IPFS uploads

### Install

```bash
git clone https://github.com/lakygosh/ITEH-NFTMarketplace.git
cd ITEH-NFTMarketplace
yarn install   # or npm install
```

### Environment variables

Create a `.env` file in the project root (it is git-ignored):

| Variable | Used by | Purpose |
|---|---|---|
| `PRIVATE_WALLET_KEY` | `truffle-config.js` | Deployer key for the Sepolia / Goerli networks |
| `INFURA_PROJECT_ID` | `truffle-config.js` | Infura project ID for the Sepolia / Goerli RPC endpoints |
| `REACT_APP_PINATA_KEY` | `src/pinata.js` | Pinata API key |
| `REACT_APP_PINATA_SECRET` | `src/pinata.js` | Pinata API secret |

### Deploy the contract

Local (Ganache on `127.0.0.1:8545`):

```bash
ganache-cli
truffle migrate --reset
cp build/contracts/NFTMarketplace.json src/abis/NFTMarketplace.json
```

Truffle writes artifacts to `build/contracts`, while the frontend imports the ABI from `src/abis`, so copy it over after each migration.

Sepolia:

```bash
npm run deploy:sepolia
```

### Run the frontend

```bash
npm start
```

Open http://localhost:3000 and connect MetaMask to the network the contract is deployed on.

## Project structure

```
ITEH-NFTMarketplace/
├── migrations/              # Truffle deployment scripts
├── src/
│   ├── contracts/           # Solidity sources (NFTMarketplace.sol, ERC-721 implementation)
│   ├── abis/                # Compiled contract ABIs used by the frontend
│   ├── components/          # React UI (Landing, ArtWorks, CreateNFT, ShowNFT, UpdateNFT, Transactions, …)
│   ├── store/               # Global state (react-hooks-global-state)
│   ├── Blockchain.services.jsx  # web3.js contract calls (mint, buy, change price)
│   └── pinata.js            # IPFS uploads via Pinata
├── truffle-config.js
├── config-overrides.js      # webpack polyfills for web3
└── tailwind.config.js
```

## Author

Lazar Gošić — GitHub [@lakygosh](https://github.com/lakygosh)
