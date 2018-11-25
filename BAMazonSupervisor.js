//Hides the password for mySQL server
require(`dotenv`).config()
const mysql = require(`mysql`);
const inquirer = require(`inquirer`);
const cTable = require(`console.table`);

//Spacer is something I use to assist in readability of the command line
const spacer = `----------`

//Department object so it can display properly on the command line with console table
const departments = {};
//Constructor so the new departments can be added dynamically
function NewDepartment(deptID, overHead) {
    this.departmentID = deptID;
    this.overHead = overHead;
}

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
    getDepartmentData();
});

//Populate the department constructor
const getDepartmentData = () => {
    const query = `SELECT * FROM departments`;
    connection.query(query, (err, data) => {
        if (err) { throw err };
        for (let i = 0; i < data.length; i++) {
            departments[data[i].department_name] = new NewDepartment(data[i].department_id, data[i].over_head_costs);
        };
        getDepartmentSales();
    });
};

const getDepartmentSales = () => {
    //Have the original search organized when returned through the query
    const query = `SELECT * FROM products ORDER BY products.department_name`;
    connection.query(query, (err, data) => {
        if (err) { throw err };

        //Checks for the last item that was returned, if different put a separator inbetween the lines
        let lastDepartment = ``;
        let productSales = 0;
        const departmentSales = {};
        for (let i = 0; i < data.length; i++) {
            if (lastDepartment != data[i].department_name) {
                //Resets the product_sales section
                productSales = 0;
            };
            productSales += data[i].product_sales;
            //Adds product sales to the department object
            departments[data[i].department_name].productSales = productSales
            lastDepartment = data[i].department_name;
        };
        console.log(departments)
        connection.end();
    });
};