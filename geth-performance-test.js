var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:18545");

var startBlockNumber = 3800000;
var endBlockNumber = startBlockNumber + 100000;
var testDuration = 10

var shouldKeepGoing = true;

setTimeout(function() {
    shouldKeepGoing = false;
}, testDuration * 1000);


console.log(`Running for ${testDuration} seconds`);

//addTransactionsFromBlockRange(startBlockNumber, endBlockNumber);

jj();


async function jj() {
    
    var wer = await web3.eth.getBlock(4000000);
    var hash= wer.transactions[0];

    var times = 0;
    while (shouldKeepGoing) {
        times++;
        var hh = web3.eth.getTransactionReceipt(hash).then(1+1);
    }

    console.log(times);
}














async function addTransactionsFromBlockRange(startBlock, endBlock) {
    for (var i = startBlock; i <= endBlock; i++) {
        if (!shouldKeepGoing)
        {
            console.log(`final block: ${i}`);
            return;
        }
        await addTransactionsFromBlock(i);
    }
}

async function addTransactionsFromBlock(blockIndex)
{
    var txCount = await web3.eth.getBlockTransactionCount(blockIndex);
    //console.log(`getting transactions from block ${blockIndex} (${txCount} transactions)`); 

    // I'm not sure why this can be null. Seems to happen for blocks of height < 1000
    if (txCount === null || txCount == 0) {
        return;
    }

    var block = await web3.eth.getBlock(blockIndex, true);
    
    for (var i = 0; i < txCount; i++) {
        await examineTransaction(block, i);
    }
}

async function examineTransaction(block, txIndex) {
    var txData = block.transactions[txIndex];
    var transactionReceipt = await web3.eth.getTransactionReceipt(txData.hash);
}
