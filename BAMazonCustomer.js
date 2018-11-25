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
    displayItems();
});

//Displays all the items
const displayItems = () => {
    //Have the original search organized when returned through the query
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
            console.log(`ID: ${data[i].item_id} || Product: ${data[i].product_name} || Price: $${data[i].price}`)
            lastDepartment = data[i].department_name;
        };
        //Passing length to make the app scalable
        orderItems(data.length);
    });
};

const orderItems = (length) => {
    inquirer.prompt({
        name: `idOfItem`,
        type: `input`,
        message: `What is the ID of the number you would like to purchase?`
    }).then(answer => {
        const purchaseID = +answer.idOfItem;
        //Checks to ensure the input is valid
        if (purchaseID < 1 || purchaseID > length) {
            console.log(`Please enter a valid ID`)
            //Recalls the prompt if they input an invalid amount
            return orderItems(length);
        } else if (!Number(purchaseID)) {
            console.log(`Please enter a number`);
            return orderItems(length);
        } else {
            return orderQuantity(purchaseID);
        };
    });
};

const orderQuantity = purchaseID => {
    inquirer.prompt({
        name: `quantity`,
        type: `input`,
        message: `How many would you like to purchase?`
    }).then(answer => {
        const quantity = +answer.quantity;
        //Verification as above
        if (!Number(quantity) || quantity < 1) {
            console.log(`Please enter a number greater than 0`);
            return orderQuantity(purchaseID);
        } else {
            checkStock(purchaseID, quantity);
        };
    });
};

const checkStock = (purchaseID, quantity) => {
    const query = `SELECT * FROM products WHERE ?`;
    connection.query(query, { item_id: purchaseID }, (err, data) => {
        if (err) { throw err };

        if (data[0].stock_quantity === 0) {
            displayItems()
            console.log(`We are out of ${data[0].product_name}. Please have another look through our store.`);
        } else if (data[0].stock_quantity < quantity) {
            //If the user picked a quantity greater than what is in stock, they are sent back to change what they'd like
            console.log(`Insufficient stock quantity. We currently have ${data[0].stock_quantity}. Please change quantity`);
            orderQuantity(purchaseID);
        } else {
            //If the user picks a product that has a value and they pick a quantity that we have in stock we move to fill the order
            console.log(`You have selected quantity ${quantity} of ${data[0].product_name}(s)`);
            console.log(`${spacer}Calculating Total${spacer}`);
            const remainingQuantity = data[0].stock_quantity - quantity;
            //If current item sales are null then return 0, otherwise return the total product sales
            //It will be null if the manager app adds a product
            let currentItemSales = 0;
            if (data[0].product_sales != null) {
                currentItemSales = data[0].product_sales;
            };
            //Pass quantity and remainingQuantity to show how much they've purchased and update the database
            fillOrder(purchaseID, quantity, remainingQuantity, data[0].product_name, data[0].price, currentItemSales);
        };
    });
};

const getTotal = (name, quantity, price) => {
    console.log(`Total Price: ${(quantity * price).toFixed(2)} for ${quantity} ${name}(s)`);
    console.log(`Congratulations on your new ${name}(s)! Your credit card has been charged and it's on the way.`)
    connection.end();
};

//Change quantity to quantityPurchased to help distinguish the two quantities
const fillOrder = (purchaseID, quantityPurchased, remainingQuantity, name, price, currentItemSales) => {
    //Update the table to show the ID has the remaining quantity left
    const query = `UPDATE products SET ? WHERE ?`;
    connection.query(query, [
        {
            stock_quantity: remainingQuantity
        }, {
            item_id: purchaseID
        }], err => { if (err) { throw err } });
    //Updates the product sales in the database to keep track of department earnings
    const saleAmount = quantityPurchased * price;
    const newSaleTotal = saleAmount + currentItemSales;
    connection.query(`UPDATE products SET ? WHERE ?`, [
        {
            product_sales: newSaleTotal
        }, {
            item_id: purchaseID
        }], err => { if (err) { throw err } });
    getTotal(name, quantityPurchased, price);
};