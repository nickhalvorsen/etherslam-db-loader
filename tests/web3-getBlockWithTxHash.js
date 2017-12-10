var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:18545");

var testDuration = 10;
var maxTests = 100;
var count = 0;
var tests = 0;

function logProgress() {
    var msAvg = (testDuration * 1000 / count).toFixed(2);
    console.log(`Ran getBlock (no tx) ${count} times in ${testDuration} seconds. (${msAvg}ms average)`);
    count = 0;
    tests++;
    if (tests < maxTests) {
        setTimeout(logProgress, testDuration * 1000);
    }
}

console.log(`Running ${maxTests} tests for ${testDuration} seconds at a time...`);

setTimeout(logProgress, testDuration * 1000);
mainLoop();

async function mainLoop() {

    while (true) {
        await web3.eth.getBlock(4000000);
        count++;
    }
}
