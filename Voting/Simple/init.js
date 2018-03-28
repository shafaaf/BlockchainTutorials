Web3 = require('web3');
solc = require('solc');
fs = require("fs");

// Initialize the solc and web3 objects
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// To make sure web3 object is initialized and can communicate with the blockchain, let’s query all the accounts in the blockchain.
console.log("The accounts in the blockchain are: \n", web3.eth.accounts);

// To compile the contract, load the code from Voting.sol in to a string variable and compile it.
code = fs.readFileSync('./Voting.sol').toString();
compiledCode = solc.compile(code);
// console.log("compiledCode is: ", compiledCode);

/*
    When you compile the code successfully and print the ‘contract’ object (just type compiledCode
    in the node console to see the contents), there are two important fields you will notice which
    are important to understand:

    compiledCode.contracts[‘:Voting’].bytecode: This is the bytecode you get when the source code
    in Voting.sol is compiled. This is the code which will be deployed to the blockchain.
    compiledCode.contracts[‘:Voting’].interface: This is an interface or template of
    the contract (called abi) which tells the contract user what methods are available in the contract.
    Whenever you have to interact with the contract in the future, you will need this abi definition. You can read more details about ABI here
*/
abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);

// create a contract object (VotingContract below) which is used to deploy and initiate contracts in the blockchain.
VotingContract = web3.eth.contract(abiDefinition);

byteCode = compiledCode.contracts[':Voting'].bytecode

//  VotingContract.new above deploys the contract to the blockchain
/*  The first argument is an array of candidates who are competing in the election */
deployedContract = VotingContract.new (
    ['Rama','Nick','Jose'],
    {data: byteCode, from: web3.eth.accounts[0], gas: 4700000},
    (error, contract) => { // TODO: Weird that this callback fired twice
        if (error) {
          console.error("error is: ", error);
        }
        else if (contract.address === undefined) {
        }
        else {
            console.log("contract.address is: ", contract.address);
        }
    }
);
