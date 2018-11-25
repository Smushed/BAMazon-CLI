//Hides the password for mySQL server
require(`dotenv`).config()
const mysql = require(`mysql`);
const inquirer = require(`inquirer`);
const cTable = require(`console.table`);

//Spacer is something I use to assist in readability of the command line
const spacer = `----------`

const connection = mysql.createConnection({
    host: process.env.HOST,

    port: 3306,

    user: process.env.USER,

    // Your password
    password: process.env.PASSWORD,
    database: `bamazon_db`
});

connection.connect(err => {
    if (err) { throw err };
});
