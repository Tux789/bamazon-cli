# bamazon-cli

## About
bamazon-cli is a collection of terminal based Javascript program representing three different roles in a simple store-management system
It uses Node and a MySQL database. These programs are ran using the command "node `<program name>`" in terminal (*please see build steps below to run these applications*)
## bamazonCustomer
* Product Table will be shown on screen
* Customer will enter the id of the product desired
* Customer will enter the quantity desired
* If sufficient quantity, a total will be displayed to the customer
https://drive.google.com/file/d/1g9jjvurbB5htb5peGr380loK_1u-UlF5/view?usp=sharing

## bamazonManager
 * **Veiw Products for Sale**- outputs the product table
 * **View Low Inventory**- outputs a table showing all products with a quantity less than 5
 * **Add to Inventory**- allows user to add (or subtract) an amount of stock to the existing quantity.
 * **Add New Product**- allows user to add a new product to the product table
 https://drive.google.com/file/d/1ZQn4v0n5EOlmr0PkUdwnNXegfa8XzT0w/view?usp=sharing
 
 ## bamazonSupervisor
 * **View Product Sales by Department**- aggregates the sales data of all products based on the product's department and displays it for each department
 * **Create New Department**- allows user to add a new department to the department table
 https://drive.google.com/file/d/1Qs2gDXIXLVAnQNqSHIK2KAIujPnU93hq/view?usp=sharing
 
## Building
Before running a series of steps must be taken
### Node and NPM Packages
* install Node
* run "npm install" in terminal
### Define .env
The following need to bew defined in an .env file
* DB_HOST
* DB_PORT
* DB_USER
* DB_PASSWORD
* DB_DATABASE
### MySQL Database
* run "schema.sql"
* run "seed.sql"


