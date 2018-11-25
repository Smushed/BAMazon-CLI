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
function NewDepartment(deptName, deptID, overHead) {
    this.department_ID = deptID;
    this.department_name = deptName;
    this.over_head_costs = overHead;
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
    supervisorMenu();
});

const supervisorMenu = () => {
    inquirer.prompt([
        {
            name: `action`,
            type: `list`,
            message: `What would you like to do?`,
            choices: [
                `Add New Department`,
                `View Departmental Profit`,
                `Disconnect`
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case `Add New Department`:
                addNewDepartment();
                break;
            case `View Departmental Profit`:
                getDepartmentData();
                break;
            case `Disconnect`:
                connection.end();
                break;
        };
    });
};

const addNewDepartment = () => {
    inquirer.prompt([
        {
            name: `name`,
            type: `input`,
            message: `What is this department's name?`
        }, {
            name: `overhead`,
            type: `input`,
            message: `What is this department's overhead costs?`,
            validate: value => {
                if (Number(value)) {
                    return true
                };
                //Gives a clue as to why it didn't take their overhead cost
                console.log(`\nPlease input a number`);
                return false;
            }
        }
    ]).then(answer => {
        const query = `INSERT INTO departments SET ?`;
        connection.query(query, [{
            department_name: answer.name,
            over_head_costs: answer.overhead
        }], err => {
            if (err) { throw err };
            //The please contact technology is because of the hard coded departments within the console.table
            console.log(`${answer.name} Successfully Added.\nPlease contact technology to add it to the table`);
            supervisorMenu();
        })
    });
};

//Populate the department constructor
const getDepartmentData = () => {
    const query = `SELECT * FROM departments`;
    connection.query(query, (err, data) => {
        if (err) { throw err };
        //Iterates over the departments in the database and grabs the data needed to display
        for (let i = 0; i < data.length; i++) {
            departments[data[i].department_name] = new NewDepartment(data[i].department_name, data[i].department_id, data[i].over_head_costs);
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

        for (let i = 0; i < data.length; i++) {
            if (lastDepartment != data[i].department_name) {
                //Resets the product_sales section if we move to a new department
                productSales = 0;
            };
            productSales += data[i].product_sales;
            //Adds product sales to the department object
            departments[data[i].department_name].product_sales = productSales
            lastDepartment = data[i].department_name;
        };
        getDepartmentProfit();
    });
};

const getDepartmentProfit = () => {
    //Adds a new key value pair to the departments object for total profit
    for (const i in departments) {
        departments[i].total_profit = departments[i].product_sales - departments[i].over_head_costs;
    };
    displayDepartmentTable();
};

const displayDepartmentTable = () => {
    //Hard coding these departments for now until I can figure out a way to iterate over this
    console.table([departments.Cosmetics, departments.Art, departments.Health]);
    supervisorMenu();
};