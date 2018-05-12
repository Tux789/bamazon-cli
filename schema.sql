DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;



CREATE TABLE departments(
department_id INT AUTO_INCREMENT NOT NULL,
PRIMARY KEY(department_id),
department_name VARCHAR(100) NULL,
over_head_costs DECIMAL(10,2) NOT NULL
);



CREATE TABLE products(
item_id INT AUTO_INCREMENT NOT NULL,
PRIMARY KEY(item_id),
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT NOT NULL,
product_sales DECIMAL(10,2) NOT NULL
);

