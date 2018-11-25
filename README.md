# BAMazon-CLI
<br />
Title: BAMazon-CLI<br />
Developer: Kevin Flerlage<br />
Deployment Date: 11/25/18<br />
For: Northwestern Coding Bootcamp<br />

## Description

This is a mock up Amazon webstore/warehouse command line app. There are 3 seperate files which the user can run from Node, each detailed below.<br />
- BAMazonCustomer
  - Customer App which the user can see the items currently listed in the store and purchase them if desired
- BAMazonManager
  - Manager App which lets the user do the following actions
    - View Products for Sale
      - Like the Customer App above
    - View Low Inventory Levels
      - Any product with fewer than 5 items remaining in store
    - Add to Inventory
      - Allows the user to add additional product to the database
    - Add New Product
      - Allows the user to add new products to the store
- BAMazon Supervisor
  - Supervisor app which allows a view at the summaries of the department. This app allows the user the options detailed below
    - View Sales By Department
      - Allows the user to view the sales, overhead cost and profit of each department
    - Add New Department
      - Allows the user to add new departments to the database

## Database

The inventory in this mock up webstore is run with mySQL. Most of the interaction is driven from the products table in the database. Product data such as: id number, name, department, price, stock amount and value of the sold amount is stored here. The ID number is the primary key for this, and is auto generated.<br />

![Products Table](./images/productsDatabase.PNG)<br />

The departments table is only used within the supervisor app. This is used in determining how profitable each department has been. In future updates, this department table will feed the manager app which would allow them to add new products to departments that have recently been added by the supervisor.<br />

![Departments Table](./images/departmentsDatabase.PNG)<br />

## BAMazon Customer

As a customer in this app the user only have access to view the products currently in stock and select one to purchase based off the ID of the item.<br /><br />
On start the list of items which are currently available are displayed ordered by department. Customers then have the option to pick the item they would like to purchase based off ID number.<br />

![Customer Start Up Screen](./images/customerStart.PNG)<br />

It is ID because the number is much easier to validate than a string. If a customer enters an ID to purchase that is not valid (either not a number or an ID which is greater than the largest ID) than the app will prompt the customer to enter an ID until it is valid.<br />

![Invalid ID Entered](./images/customerIDValidate.PNG)<br />

After selecting a valid ID, it asks for a quantity the user would like to purchase.<br />

![Quantity Prompt Requested](./images/customerQuantityRequested.PNG)<br />

As with the IDs, the quantity is validated. If the user requests an amount which exceeds the current stock of the warehouse, then the app prompts them the current stock and prompts them to request a different stock.<br />

![Insufficient Quantity in Stock](./images/customerInsufficientQuantity.PNG)<br />

Additionally, if the warehouse is currently out of stock, a message is displayed indicating this.<br />

![Out of Stock Message](./images/customerOutOfStock.PNG)<br />

After the user selects an ID which is valid, and an amount which is currently in stock, the database is updated with the product as being sold. The user is prompted with the total that was *charged* to their credit card.<br />

![Purchased Item](./images/customerPurchase.PNG)<br />

![Database Updated](./images/customerDatabaseUpdated.PNG)<br />

## BAMazon Manager

As the manager the user has the ability to view the products which are currently for sale in the app, view the items with inventory levels below five, add inventory to the warehouse as well as add a new product.<br />

When the user starts the app they are prompted with the choices that were detailed above. The manager app will always return to the menu whenever they are done with current task they are doing. By selecting **disconnect** it will end the app.<br />

![Manager Menu](./images/managerStart.PNG)<br />

In selecting View Products for Sale the user will have the same display as the customer app.<br />

![View Products Display](./images/managerViewProducts.PNG)