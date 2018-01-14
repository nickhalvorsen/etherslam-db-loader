var path = require('path');
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:18545");
var sleep = require('sleep');
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({                                                     
    host: process.env.DB_HOST
    , port: process.env.DB_PORT
    , database: process.env.DB_NAME
    , user: process.env.DB_USER
    , password: process.env.DB_PASSWORD
    , max: 20
});

// Check command line arguments
var startBlockNumber = process.argv[2];
var endBlockNumber = process.argv[3];

if (startBlockNumber === undefined) {
    exit;
}
else if (endBlockNumber === undefined) {
    endBlockNumber = startBlockNumber;
}

startBlockNumber = parseInt(startBlockNumber);
endBlockNumber = parseInt(endBlockNumber);

addTransactionsFromBlockRange(startBlockNumber, endBlockNumber);

async function addTransactionsFromBlockRange(startBlock, endBlock) {
    for (var i = startBlock; i <= endBlock; i++) {
        await addTransactionsFromBlock(i);
    }
}

async function addTransactionsFromBlock(blockIndex)
{
    var txCount = await web3.eth.getBlockTransactionCount(blockIndex);

    console.log(`getting transactions from block ${blockIndex} (${txCount} transactions)`); 

    // I'm not sure why this can be null. Seems to happen for blocks of height < 1000
    if (txCount === null) {
        return
    }
    
    // "true" means return the full transaction objects
    var block = await web3.eth.getBlock(blockIndex, true);

    for (var i = 0; i < txCount; i++) {
        await addTransactionFromBlock(block, i);
    }
}

async function addTransactionFromBlock(block, txIndex) {

    var txData = block.transactions[txIndex];
    //var transactionReceipt = await web3.eth.getTransactionReceipt(txData.hash);

    //var fee = transactionReceipt.cumulativeGasUsed * txData.gasPrice;

    //console.log(`Inserting tx ${txData.hash.substring(0, 8)}... from block ${txData.blockNumber}`);

    insertTransaction(txData.hash, txData.blockNumber, block.timestamp, txData.from, txData.to, txData.value, 'NULL');
}

function insertTransaction(hash, block, timestamp, fromaddress, toaddress, value, fee) {
    var queryString = `INSERT INTO transaction (hash, block, utctime, fromaddress, toaddress, value, fee) values ('${hash}', ${block}, to_timestamp(${timestamp}) at time zone \'UTC\', '${fromaddress}', '${toaddress}', ${value}, ${fee})`;
    pool.query(queryString, (err, res) => {
        if (err) {
            if (err.code === '23505'
                && err.constraint === 'transaction_hash_key') {
                console.log(`Transaction ${hash.substring(0, 8)}... in block ${block} already inserted`);
            }
            else {
              console.log(err ? err.stack : res);
            }
        }
        else {
            //console.log(`successfully inserted tx ${hash.substring(0, 8)}... from block ${block}`);
        }
    });
}
