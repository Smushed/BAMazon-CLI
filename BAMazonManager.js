//Hides the password for mySQL server
require(`dotenv`).config()
const mysql = require(`mysql`);
const inquirer = require(`inquirer`);

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
    managerMenu();
});

const managerMenu = () => {
    inquirer.prompt([
        {
            type: `list`,
            name: `action`,
            message: `What would you like to do?`,
            choices: [
                `View Products for Sale`,
                `View Low Inventory`,
                `Add to Inventory`,
                `Add New Product`
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case `View Products for Sale`:
                viewProducts();
                break;
            case `View Low Inventory`:
                viewLowInventory();
                break;
            case `Add to Inventory`:
                addInventory();
                break;
            case `Add New Product`:
                addNewProduct();
                break;
        }
    })
}

const viewProducts = () => {

}

const viewLowInventory = () => {

}

const addInventory = () => {

}

const addNewProduct = () => {

}