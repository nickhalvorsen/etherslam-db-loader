var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:18545");

const { Client } = require('pg');
const client = new Client();


client.connect();
addTransactionsFromBlock(1000000,1000000, client);

//would want to put this somewhere
//client.end()


async function addTransactionsFromBlock(startBlock, endBlock, client) {

    for (var currentBlockIndex = startBlock; currentBlockIndex <= endBlock; currentBlockIndex++) {
        var txCount = await web3.eth.getBlockTransactionCount(currentBlockIndex);

        console.log(`getting transactions from block ${currentBlockIndex} (${txCount} transactions)`); 

        var block = await web3.eth.getBlock(currentBlockIndex);
        
        for (var currentTxIndex = 0; currentTxIndex < txCount; currentTxIndex++)
        {
            var txData = await web3.eth.getTransactionFromBlock(currentBlockIndex, currentTxIndex);
            var transactionReceipt = await web3.eth.getTransactionReceipt(txData.hash);

            var fee = transactionReceipt.cumulativeGasUsed * txData.gasPrice;

            console.log(`Inserting tx ${txData.hash.substring(0, 8)}... from block ${txData.blockNumber}`);

            insertTransaction(client, txData.hash, txData.blockNumber, block.timestamp, txData.from, txData.to, txData.value, fee);
        }
    }
}


function insertTransaction(client, hash, block, timestamp, fromaddress, toaddress, value, fee) {

    var queryString = `INSERT INTO transaction (hash, block, utctime, fromaddress, toaddress, value, fee) values ('${hash}', ${block}, to_timestamp(${timestamp}) at time zone \'UTC\', '${fromaddress}', '${toaddress}', ${value}, ${fee})`;
    console.log(queryString)

    client.query(queryString, (err, res) => {
          console.log(err ? err.stack : res)
    })
}

