var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/Pqtb5zPujGYRo7xXn3ri");

var testDuration = 10;
var maxTests = 100;
var count = 0;
var tests = 0;

function logProgress() {
    var msAvg = (testDuration * 1000 / count).toFixed(2);
    console.log(`Ran GetTransactionReceipt ${count} times in ${testDuration} seconds. (${msAvg}ms average)`);
    count = 0;
    tests++;
    if (tests < maxTests) {
        setTimeout(logProgress, testDuration * 1000);
    }
}

setTimeout(logProgress, testDuration * 1000);

console.log(`Running ${maxTests} tests for ${testDuration} seconds at a time...`);

mainLoop();
async function mainLoop() {
    
    var hash = '0x994840d01d8c60b3a1a52b9119865dcbae683660482175038cd22c1cbbec679c';

    while (true) {
        await web3.eth.getTransactionReceipt(hash);
        count++;
    }
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
