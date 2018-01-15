require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
    host: process.env.DB_HOST
    , port: process.env.DB_PORT
   , database: process.env.DB_NAME 
   , user: process.env.DB_USER 
   , password: process.env.DB_PASSWORD 
   , max: 20  
});

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

    client.end();
}
