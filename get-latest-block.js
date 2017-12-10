const { Client } = require('pg');
const client = new Client();

client.connect();

/*client.query("select block from transaction order by block desc limit 1"
    , (err, res) => {
        console.log(err ? err.stack : res);
        client.end()
    });*/


jj();
async function jj() {
    var j = await client.query("select block from transaction order by block desc limit 1");
    console.log(j.rows[0].block);
}
