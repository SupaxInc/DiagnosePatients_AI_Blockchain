import Web3 from "web3";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import ProviderEngine from "web3-provider-engine";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc";

const contract_address = "0xC94747C5cf4Fd9d0Fbd000E61A3d15B8C9e9440D";
// Smart Contract ABI found in Remix Solidity IDE
const abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "changedOwnership",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "disease",
                "type": "bytes32"
            }
        ],
        "name": "addDiseases",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_address",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_payment",
                "type": "uint256"
            }
        ],
        "name": "patientPaid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_address",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "addedPatient",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_symptom",
                "type": "bytes32"
            }
        ],
        "name": "addedSymptom",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_disease",
                "type": "bytes32"
            }
        ],
        "name": "addedDisease",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "addedOrganization",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "newOrgAddr",
                "type": "address"
            }
        ],
        "name": "addOrganizations",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "patientAddr",
                "type": "address"
            },
            {
                "name": "_symptom",
                "type": "bytes32"
            }
        ],
        "name": "addPatientSymptoms",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "symptom",
                "type": "bytes32"
            }
        ],
        "name": "addSymptoms",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "patientAddr",
                "type": "address"
            }
        ],
        "name": "payDiagnosis",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "registerPatient",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOrgOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "addrPatients",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "patientAddr",
                "type": "address"
            }
        ],
        "name": "checkIfRegistered",
        "outputs": [
            {
                "name": "correctAddr",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "patientAddr",
                "type": "address"
            }
        ],
        "name": "checkPayment",
        "outputs": [
            {
                "name": "hasPaid",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "orgAddr",
                "type": "address"
            }
        ],
        "name": "checkPermissions",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "diseases",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isOwner",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "nextPatientId",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "organizationAddresses",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "organizations",
        "outputs": [
            {
                "name": "Address",
                "type": "address"
            },
            {
                "name": "hasPermissions",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "patients",
        "outputs": [
            {
                "name": "Address",
                "type": "address"
            },
            {
                "name": "payment",
                "type": "uint256"
            },
            {
                "name": "id",
                "type": "uint256"
            },
            {
                "name": "isPatientRegistered",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "symptoms",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalPatients",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

let my_web3;		// Replacing Web3 object Metamask provides with this.
let account;		// Variable will allow us to block any attempt to create a transaction.
const rpcUrl = "https://ropsten.infura.io";
let contract;


/* 
    Event listener load is used since Metamask adds a web3 object to page before 'load'
    completes. Web3 object will be used to create a contract object using abi and contract
    address.
*/
window.addEventListener('load', () => {
    const use_ledger = location.search.indexOf("ledger=true") >= 0;


    // NEEDS TO BE CHANGED BECAUSE OF PRIVATE MODE COMING OUT NOVEMBER 2ND
    if (use_ledger)  // Ledger mode
    {
        const engine = new ProviderEngine();
        const getTransport = () => TransportU2F.create();
        const ledger = createLedgerSubprovider(getTransport, {
            networkId: 3, // 3 == Ropsten testnet
        });
        engine.addProvider(ledger);
        engine.addProvider(new RpcSubprovider({ rpcUrl }));
        engine.start();
        my_web3 = new Web3(engine);
        $('#mode').text("Ledger");
    
    } else if (typeof (web3) === 'undefined') {   // No engine
        my_web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
        $('#mode').text("None");
    
    } else {    // MetaMask mode
        my_web3 = new Web3(web3.currentProvider);
        $('#mode').text("MetaMask");
    }

    
    contract = new my_web3.eth.Contract(abi, contract_address);

    my_web3.eth.getAccounts((error, result) => {	// gets the accounts/wallets
        if (error) {
            console.log(error);
        } else if (result.length == 0) {
            console.log("You are not logged in");
        } else {
            account = result[0];
            contract.options.from = account;    // transactions will be made from this account
            $('#account').text(account);
        }
    }).catch((error) => {	// new Web3.js version uses promises, any error 
        // caught is responded to here.
        console.log("Error: " + error);
    });
    
});