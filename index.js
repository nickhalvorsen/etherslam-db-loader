var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:18545");

const { Client } = require('pg');
const client = new Client();



client.connect();
addTransactionsFromBlock(1000000,1000000, client);




async function addTransactionsFromBlock(startBlock, endBlock, client) {

    for (var currentBlockIndex = startBlock; currentBlockIndex <= endBlock; currentBlockIndex++) {
        var txCount = await web3.eth.getBlockTransactionCount(currentBlockIndex);

        console.log(`getting transactions from block ${currentBlockIndex} (${txCount} transactions)`); 
        
        for (var currentTxIndex = 0; currentTxIndex < txCount; currentTxIndex++)
        {
            var txData = await web3.eth.getTransactionFromBlock(currentBlockIndex, currentTxIndex);
            console.log(`Inserting tx ${txData.hash.substring(0, 8)}... from block ${txData.blockNumber}`);
           
            insertTransaction(client, txData.hash, txData.blockNumber, '1/1/1970', txData.from, txData.to, txData.value, 999999);

        }
    }
}


function insertTransaction(client, hash, block, utctime, fromaddress, toaddress, value, fee) {
    client.query(`INSERT INTO transaction (hash, block, utctime, fromaddress, toaddress, value, fee) values ('${hash}', ${block}, '${utctime}', '${fromaddress}', '${toaddress}', ${value}, ${fee})`, (err, res) => {
          console.log(err ? err.stack : res)
    })
}


/*


client.connect()
client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
      console.log(err ? err.stack : res.rows[0].message) // Hello World!
      //client.end()
})

client.query("INSERT INTO transaction (hash, block, utctime, fromaddress, toaddress, value, fee) values ('0xtest', 100, '10/2/2017', '0x10000000000000', '0x10200000000', 6200.88800005001, 0.0000015)", (err, res) => {
      console.log(err ? err.stack : res)

    client.end()
})

*/

