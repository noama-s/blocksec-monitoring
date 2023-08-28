require('dotenv').config()
const { Web3 } = require('web3');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('events').EventEmitter.defaultMaxListeners = 0;

const websocket_url = `wss://mainnet.infura.io/ws/v3/ac53ce8acdb942dc8a102579efb62a68`;
const max_size = 10 * 1024 * 1024; // 10 MB
const provider = new Web3.providers.WebsocketProvider(websocket_url, { max_size: max_size });
const web3 = new Web3(provider);

const createJiraTicket = require('./jira'); // Import the function from jira.js

function getContractAbiByAddress(contractAddress) {
    try {
        // Construct the file path
        const filePath = path.join(__dirname, 'contract-abi', `${contractAddress}.json`);

        // Read the file synchronously (you can also do this asynchronously)
        const rawdata = fs.readFileSync(filePath, 'utf8');

        // Parse the JSON to get the ABI
        const abi = JSON.parse(rawdata);

        return abi;
    } catch (error) {
        console.error(`Error reading ABI for contract ${contractAddress}:`, error);
        return null;
    }
}

async function processContracts() {
    //predefined list of contract addresses
contractAddresses = [
    '0xa8824EeE90cA9D2e9906D377D36aE02B1aDe5973',
    '0xd1258DB6Ac08eB0e625B75b371C023dA478E94A9',
    '0xA225632b2EBc32B9f4278fc8E3FE5C6f6496D970',
    '0xE60fE8C4C60Fd97f939F5136cCeb7c41EaaA624d',
    '0xAFcbA2ee7C8C2b17ba91521ba66cE111Cf58E87E',
    '0x136626ce6faD0d517F2E7C7F79D8eB9FB365D14f',
    '0xA73dB719FEd61cf23008491b0D99C6A4DC97813d',
    '0x4301b74537155ECd7a02a658F0754d13607aA1b3',
    '0xF1F4986Bdd37D81bAD678afb90b049207A2e8Cfa',
    '0x5518344F3e0608019d6b2E15e3d26fC810682DC2',
    '0xBc4a4E7EcE9429D982f9D5C83bcadBB9b2e9314D',
    '0xE56dD80688F913E36e2E20C2b4A62669A3e23968',
    '0x27DC47a0b5a15C3836DF5a524D814c9085cf6632',
    '0xBBD3f1D05B3A0D9B281c7739c48c3ab3924824aC',
    '0x1Ca97F9A77114a0A6759bd10C18097Db8628cb7C',
    '0x43E1E40d405151fc83891B1EecFcCDdFb0292732',
    '0x2e318924d1bf55D6FF2dECea10307655a3abED84',
    '0x812F5CF0D10539ef9534929940f3aeEde3d3d967',
    '0x97ABEA635eFDAf4CdC844B8677623CAc8d776814',
    '0x5c2C9094bB47C6feE89abD4a6126Fb3Fb39dE923',
    '0x05F9067205af1aFFA7DF1C076FC7209407EfcA60',
    '0xAABC3AEf1CE0d23eEAABfC7C6Cd9043FCEbf7400',
    '0x5434e17E9F4aa9521f85E57932b884d45037F071',
    '0xc2CCA20b76F5494b1b10774e0D182f10d98B4A51', 
    ]

    const eventsList = ['Transfer','OwnershipTransferred', 'BaseURIset'];
    
    for (const contractAddress of contractAddresses) {
        console.log(`Processing contract: ${contractAddress}`);

        let contractAbi;
        try {
            contractAbi = await getContractAbiByAddress(contractAddress);
        } catch (e) {
            console.error(`Failed to get ABI for ${contractAddress}: ${e.message}`);
            continue;
        }

        if (!contractAbi) {
            console.log(`No ABI found for contract ${contractAddress}, skipping.`);
            continue;
        }

        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        for (const eventName of eventsList) {
            let events;
            try {
                events = await contract.getPastEvents(eventName, {
                    fromBlock: 17981313,
                    toBlock: 'latest'
                });
            } catch (error) {
                console.log(`Error fetching events for ${eventName} in contract ${contractAddress}`);
                continue;
                }
            if (!events.length) {
                console.log(`No events of type ${eventName} found for contract ${contractAddress}`);
                continue;
            }else{
                for (const event of events) {
                    console.log(`Creating Jira ticket for event: ${event.event}`);
                    await createJiraTicket(event);
                }
            }
        }
    }
}

// Execute the function and catch any unhandled errors
processContracts().catch(error => console.error("Failed to process contracts:", error));