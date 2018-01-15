var path = require('path');
var Web3 = require('web3');
require('dotenv').config();
var web3 = new Web3(Web3.givenProvider || process.env.WEB3_HOST );
var sleep = require('sleep');
const { Pool } = require('pg');

const pool = new Pool({                                                     
    host: process.env.DB_HOST
    , port: process.env.DB_PORT
    , database: process.env.DB_NAME
    , user: process.env.DB_USER
    , password: process.env.DB_PASSWORD
    , max: 30
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

    await addTransactionsFromBlockData(block);
}

async function addTransactionsFromBlockData(block) {
    sleep.msleep(2);   
    var queryString = "INSERT INTO transaction (hash, block, utctime, fromaddress, toaddress, value) values"; 

    for (var i = 0; i < block.transactions.length; i++) {
        var tx = block.transactions[i];
        queryString += `('${tx.hash}', ${tx.blockNumber}, to_timestamp(${block.timestamp}) at time zone \'UTC\', '${tx.from}', '${tx.to}', ${tx.value}),`;
    }

    queryString = queryString.substring(0, queryString.length - 1);

    pool.query(queryString, (err, res) => {
        if (err) {
            if (err.code === '23505'
                && err.constraint === 'transaction_hash_key') {
                console.log(`a transaction in block ${block} already inserted`);
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
