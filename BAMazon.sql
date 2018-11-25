DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    stock_quantity INTEGER(10) NULL,
    product_sales DECIMAL(10, 2) NULL
);

CREATE TABLE departments (
	department_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    over_head_costs INT NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pink Wig", "Cosmetics", 15.83, 7), ("Purple Paint", "Art", 4.25, 15), ("Back Massager", "Health", 72.35, 3), ("Canvas", "Art", 7.00, 20), ("Ergonomic Chair", "Health", 432.97, 2), ("Dry Shampoo", "Cosmetics", 7.32, 36), ("Micron Pen", "Art", 3.20, 19), ("Shoe Insoles", "Health", 14.95, 56), ("Nail Polish", "Cosmetics", 5.20, 152), ("Size 2 Paintbrush", "Art", 14.25, 3);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Cosmetics", 10000), ("Art", 75000), ("Health", 25000);

SELECT * FROM bamazon_db.products;
SELECT * FROM bamazon_db.departments;