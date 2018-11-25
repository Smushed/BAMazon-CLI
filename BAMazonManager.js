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
                `Add New Product`,
                `Disconnect`
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
                //Currently hard coding the number of products in the database
                const query = `SELECT * FROM products ORDER BY department_name`;
                connection.query(query, (err, data) => {
                    //Connects to the database to get the amount of current products. This is used to validate user input in addInventory
                    addInventory(data.length);
                });
                break;
            case `Add New Product`:
                addNewProduct();
                break;
            case `Disconnect`:
                connection.end();
                break;
        };
    });
};

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
            console.log(`ID: ${data[i].item_id} || Product: ${data[i].product_name} || Price: $${data[i].price} || Quantity ${data[i].stock_quantity}`)
            lastDepartment = data[i].department_name;
        };
        //Passing length to make the app scalable
        managerMenu();
    });
};

const viewLowInventory = () => {
    //This is the same display as the customer view
    //As part of the if statement, if the stock is lower than 5 then the product is shown, otherwise it's skipped
    const query = `SELECT * FROM products ORDER BY department_name`;
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
                console.log(`ID: ${data[i].item_id} || Product: ${data[i].product_name} || Price: $${data[i].price} || Quantity ${data[i].stock_quantity}`);
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
};

const addInventory = (length) => {
    //Lets the manager add additional stock to any item in the inventory
    inquirer.prompt({
        name: `idOfItem`,
        type: `input`,
        message: `What is the ID of the number you would like to add stock to?`
    }).then(answer => {
        const purchaseID = +answer.idOfItem;
        //Checks to ensure the input is valid
        //Recalls the prompt if they input an invalid amount
        if (purchaseID < 1 || purchaseID > length) {
            console.log(`Please enter a valid ID`)
            return addInventory(length);
        } else if (!Number(purchaseID)) {
            console.log(`Please enter a number`);
            return addInventory(length);
        } else {
            //If they entered a valid ID then connect to the database and get the product information
            const query = `SELECT * FROM products WHERE ?`;
            connection.query(query, { item_id: purchaseID }, (err, data) => {
                if (err) { throw err };
                return restock(purchaseID, data[0].product_name, data[0].stock_quantity);
            });
        };
    });
};

const restock = (purchaseID, name, currentStock) => {
    //Gets the amount to restock
    inquirer.prompt({
        name: `additionalAmount`,
        type: `input`,
        message: `How many ${name}(s) would you like to restock?`
    }).then(answer => {
        const additionalAmount = +answer.additionalAmount;
        //Checks to ensure the input is valid
        //Recalls the prompt if they input an invalid amount
        if (additionalAmount < 1) {
            console.log(`Please an amount over 0 to restock`)
            return restock(purchaseID, name);
        } else if (!Number(additionalAmount)) {
            console.log(`Please enter a number`);
            return restock(purchaseID, name);
        } else {
            //If they entered a valid number then calculate how much stock we will have after restocking and run the restock method
            const restockAmount = additionalAmount + currentStock;
            performRestock(purchaseID, name, restockAmount)
        };
    });
};

const performRestock = (purchaseID, name, restockAmount) => {
    const query = `UPDATE products SET ? WHERE ?`;
    connection.query(query, [{ stock_quantity: restockAmount }, { item_id: purchaseID }], (err, data) => {
        if (err) { throw err };
        console.log(`Warehouse has been sent more ${name}(s). We now have ${restockAmount} in our warehouse\n`);
        managerMenu();
    });
};

const addNewProduct = () => {
    //Allows the manager to add new items to the database with some validation
    inquirer.prompt([{
        name: `itemName`,
        type: `input`,
        message: `What is the name of the item you'd like to add?`
    }, {
        name: `departmentName`,
        //This is a list to prevent typos within department or variance
        type: `list`,
        message: `What department does this new item go into?`,
        choices: [
            `Cosmetics`,
            `Art`,
            `Health`
        ]
    }, {
        name: `itemPrice`,
        type: `input`,
        message: `What is the price per unit?`,
        //Checking to make sure the inputted amount is a number
        validate: value => {
            if (Number(value)) {
                return true
            };
            //Gives a clue as to why it didn't take their price
            console.log(`\nPlease input a number`);
            return false;
        }
    }, {
        name: `itemStock`,
        type: `input`,
        message: `How many items are in stock?`,
        validate: value => {
            if (Number(value)) {
                return true
            };
            //Gives a clue as to why it didn't take their price
            console.log(`\nPlease input a number`);
            return false;
        }
    }]).then(answer => {
        const query = `INSERT INTO products SET ?`;
        connection.query(query, [{
            product_name: answer.itemName,
            department_name: answer.departmentName,
            price: answer.itemPrice,
            stock_quantity: answer.itemStock
        }], err => {
            if (err) { throw err };
            console.log(`${answer.itemName} was successfully added.\n`);
            managerMenu();
        });
    });
};