var path = require('path');
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:18545");

const { Client } = require('pg');
const client = new Client();

// Check command line arguments
var startBlockNumber = process.argv[2];
var endBlockNumber = process.argv[3];

if (startBlockNumber === undefined) {
    var scriptName = path.basename(__filename);
    console.log(`Usage: ${scriptName} <startBlockNumber> <endBlockNumber>`);
    process.exit();
}
else if (endBlockNumber === undefined) {
    endBlockNumber = startBlockNumber;
}

client.connect();
addTransactionsFromBlockRange(startBlockNumber, endBlockNumber);

//would want to put this somewhere
//client.end()

async function addTransactionsFromBlockRange(startBlock, endBlock) {
    for (var i = startBlock; i <= endBlock; i++) {
        addTransactionsFromBlock(i, client);
    }
}

async function addTransactionsFromBlock(blockIndex)
{
    console.log(`getting transactions from block ${blockIndex} (${txCount} transactions)`); 

    var txCount = await web3.eth.getBlockTransactionCount(blockIndex);
    var block = await web3.eth.getBlock(blockIndex);
    
    for (var i = 0; i < txCount; i++) {
        addTransactionFromBlock(block, blockIndex, i);
    }
}

async function addTransactionFromBlock(block, blockIndex, txIndex) {

    var txData = await web3.eth.getTransactionFromBlock(blockIndex, txIndex);
    var transactionReceipt = await web3.eth.getTransactionReceipt(txData.hash);

    var fee = transactionReceipt.cumulativeGasUsed * txData.gasPrice;

    console.log(`Inserting tx ${txData.hash.substring(0, 8)}... from block ${txData.blockNumber}`);

    insertTransaction(txData.hash, txData.blockNumber, block.timestamp, txData.from, txData.to, txData.value, fee);
}

function insertTransaction(hash, block, timestamp, fromaddress, toaddress, value, fee) {
    var queryString = `INSERT INTO transaction (hash, block, utctime, fromaddress, toaddress, value, fee) values ('${hash}', ${block}, to_timestamp(${timestamp}) at time zone \'UTC\', '${fromaddress}', '${toaddress}', ${value}, ${fee})`;
    client.query(queryString, (err, res) => {
          console.log(err ? err.stack : res);
    });
}

