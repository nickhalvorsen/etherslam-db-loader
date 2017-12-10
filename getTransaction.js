var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:18545");

var testDuration = 10;
var maxTests = 100;
var count = 0;
var tests = 0;

mainLoop();

async function mainLoop() {
   
    var hash = process.argv[2]; 
    var tx = await web3.eth.getTransaction(hash);
    
    console.log(tx);
}
