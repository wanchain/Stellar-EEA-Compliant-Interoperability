## Overview
It is a project for Stellar-Polygon asset bridge, which implements common infrastructure to support crosschain messages, and support one scenario of asset bridge with NFT issuing on Stellar testnet chain and swap on Polygon testnet chain.  
To support the crosschain messages, EEA crosschain interoperability spec is followed with adaption on Stellar chain.
## Flows
For the crosschain flows, generally three flows are supported for the scenarios:  
- Seller on Stellar: Sell NFT on Stellar for Polygon buyer
- Buyer on Polygon: Purchase wrapped NFT on Polygon and seller receives MATIC on Polygon
- Buyer on Polygon: Buyer can unwrap NFT on Polygon and receives original NFT on Stellar
## Components
### 1 Contracts
#### 1.1 Stellar Contracts
gatewayAddr: CB6IPBQO27IMYHQNDONI7XKHVM6CJ7LIVW4RY65ULFGD5AIT6CTSTRRV <br>
nftMarketAddress: CD4M7URGNOKO5V5CDBLSBJKUJUW5XBXEG2E5OQU3C325FSIMJZMM7UFQ <br>
nftContractAddress: CCFZO74QWNAHBAH4N7RW4YQWQZUPRZ7LFGJE63KVQTLPNRDIMCFW2ZXL
#### 1.2 Polygon Contracts
gatewayAddr: 0xaA486ca50A0cb9c8d154ff7FfDcE071612550042 <br>
nftMarketAddr: 0x77ad6b15a224FeeB5805C4b9E3Af9948b8B907C1
### 2 DApps
Bridge WebUI for user to trade NFTs.
### 3 Services
#### 3.1 MsgRouter
Collect and verify tx signatures for CrossAgent.
#### 3.2 ScanChainService
Scan polygon and stellar, save SCs's events data to mongodb, provide restApi for Bridge query.
#### 3.3 CrossAgent
Run multiple instances simultaneously for multisignature, One Leader, several followers. <br>
##### Leader
The leader submits the tx signature request to MsgRouter, collects signatures from MsgRouter, and finally submit tx to chain.<br>
##### Followers
The fellowers queries signature requests from msgRouter,and submit tx signature results to MsgRouter.
