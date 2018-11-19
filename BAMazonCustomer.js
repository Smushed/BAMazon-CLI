//Hides the password for mySQL server
require(`dotenv`).config()
const mysql = require(`mysql`);
const inquirer = require(`inquirer`);

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
        const spacer = `----------`
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
            return orderItems();
        } else if (!Number(purchaseID)) {
            console.log(`Please enter a number`);
            return orderItems();
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
        if (!Number(quantity)) {
            console.log(`Please enter a number`);
            return orderQuantity();
        } else if (quantity < 0) {
            console.log(`Please enter a number 0 or greater`)
            return orderQuantity();
        } else {
            buyProduct(purchaseID, quantity);
        };
    });
};

const buyProduct = (purchaseID, quantity) => {
    const query = `SELECT * FROM products WHERE ?`;
    connection.query(query, { item_id: purchaseID }), (err, data) => {
        console.log(`working`);
        if (err) { throw err };
        console.log(data);
    };
    connection.end();
}