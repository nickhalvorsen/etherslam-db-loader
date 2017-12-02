const { Client } = require('pg')
const client = new Client()

client.connect()
client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
      console.log(err ? err.stack : res.rows[0].message) // Hello World!
      //client.end()
})

client.query("INSERT INTO transaction (hash, block, utctime, fromaddress, toaddress, value, fee) values ('0xtest', 100, '10/2/2017', '0x10000000000000', '0x10200000000', 6200.88800005001, 0.0000015)", (err, res) => {
      console.log(err ? err.stack : res)

    client.end()
})



