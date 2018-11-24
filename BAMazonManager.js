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
    //This is the same display as the customer view
    const query = `SELECT * FROM products ORDER BY department_name`;
    connection.query(query, (err, data) => {
        if (err) { throw err };

        //Checks for the last item that was returned, if different put a separator inbetween the lines
        let lastDepartment = ``;
        for (let i = 0; i < data.length; i++) {
            if (lastDepartment != data[i].department_name) {
                //When the department changes from one to another, add the new line to break it up.
                //This is possible because of the ORDER BY above
                console.log(`\n${spacer} Department: ${data[i].department_name} ${spacer}`)
            };
            console.log(`ID: ${data[i].item_id} || Product: ${data[i].product_name} || Price: $${data[i].price} || Quantity ${data[i].stock_quantity}\n`)
            lastDepartment = data[i].department_name;
        };
        //Passing length to make the app scalable
        managerMenu();
    });
}

const viewLowInventory = () => {
    //This is the same display as the customer view
    const query = `SELECT * FROM products ORDER BY department_name`;
    let lowItemsInDepartment = 0;
    connection.query(query, (err, data) => {
        if (err) { throw err };

        //Checks for the last item that was returned, if different put a separator inbetween the lines
        let lastDepartment = ``;
        console.log(`${spacer}View Low Stock${spacer}`)
        for (let i = 0; i < data.length; i++) {
            if (lastDepartment != data[i].department_name) {
                //When the department changes from one to another, add the new line to break it up.
                //This is possible because of the ORDER BY above
                console.log(`\n${spacer} Department: ${data[i].department_name} ${spacer}`)
            };
            //Displays items with stock levels of lower than 5 to the console
            if (data[i].stock_quantity < 5) {
                console.log(`ID: ${data[i].item_id} || Product: ${data[i].product_name} || Price: $${data[i].price} || Quantity ${data[i].stock_quantity}\n`);
            }
            lastDepartment = data[i].department_name;
        };
        inquirer.prompt([{
            name: `restock`,
            type: `list`,
            message: `Would you like to restock an item?`,
            choices: [
                `Yes`,
                `No`
            ]
        }]).then(answer => {
            switch (answer.restock) {
                case `Yes`:
                    //Passing length to make the app scalable
                    addInventory(data.length);
                    break;
                case `No`:
                    managerMenu();
                    break;
                default:
                    managerMenu();
            };
        });
    });
}

const addInventory = (length) => {
    //Lets the manager add additional stock to any item in the inventory
    inquirer.prompt({
        name: `idOfItem`,
        type: `input`,
        message: `What is the ID of the number you would like to add stock to?`
    }).then(answer => {
        const purchaseID = +answer.idOfItem;
        //Checks to ensure the input is valid
        if (purchaseID < 1 || purchaseID > length) {
            console.log(`Please enter a valid ID`)
            //Recalls the prompt if they input an invalid amount
            return addInventory();
        } else if (!Number(purchaseID)) {
            console.log(`Please enter a number`);
            return addInventory();
        } else {
            return addInventoryDetails(purchaseID);
        };
    });
};

const addInventoryDetails = () => {

};

const addNewProduct = () => {

}