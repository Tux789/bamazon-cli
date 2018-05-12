var dotenv = require('dotenv').config();
var connectionParams = require("./database.js");
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection(connectionParams.db);

function getManagerInstruction(productsArray, connection){
	inquirer.prompt({
		type: "list",
		message: "What do you want to do? ",
		choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"],
		name: "managerInstruction"
	}).then(function(response){
			switch(response.managerInstruction){
				case "View Products for Sale":
					getProducts(connection, getManagerInstruction);
				break;
				case "View Low Inventory":
					getLowProducts(connection);
				break;
				case "Add to Inventory":
					getProducts(connection, addInventory);
				break;
				case "Add New Product":
				//console.log(getDepartments(connection));
					getDepartments(connection);
				break;
			}
	});
}
function addNewProduct(deptNames, connection){
	//console.log(getDepartments(connection));
	inquirer.prompt([{
		type: "input",
		message: "Product Name?: ",
		name: "productName"
	},
	{
		type: "list",
		message: "Department Name?: ",
		choices: deptNames,
		name: "productDept"

	},
	{
		type: "input",
		message: "Price?: ",
		name: "productPrice",
		validate: function(value){
			if(isNaN(value) === false){
				return true;
			}else{
				return false;
			}
		}
	},
	{
		type: "input",
		message: "Quantity in Stock?: ",
		name: "productStock",
		validate: function(value){
			if(isNaN(value) === false && Number.isInteger(Number(value))){
				return true;
			}else{
				return false;
			}
		}

	}]).then(function(response){
		console.log(response.productName, response.productDept, response.productPrice, response.productStock);
		insertProduct(response.productName, response.productDept, response.productPrice, response.productStock, connection);
	
	});
}
function insertProduct(productName, productDept,productPrice,productStock, connection){
connection.query("INSERT INTO products SET ?",{
	product_name: productName,
	department_name: productDept,
	price: productPrice,
	stock_quantity: productStock,
	product_sales: 0
},function(err,res){
	if(err){
		console.log(err);
		throw err;
	}else{
		console.log("Update Successful");
		getManagerInstruction([],connection);
	}
})
}
	
function addInventory(productsArray, connection){
	inquirer.prompt({
		type: "input",
		message: "Product ID to Change?: ",
		name: "productId",
		validate: function(value){
			if(isNaN(value) === false && Number.isInteger(Number(value))){
				if(value > 0 && value <= productsArray.length){
					return true;
				}else{
					console.error("\nERROR: Input ID Does Not Exist");
					return false;
				}
			}else{
				console.error("\nERROR: Input is Not a Valid Number");
				return false;
			}
		}
	}).then(function(response){
		var productId = response.productId;
		inquirer.prompt({
			type: "input",
			message: "How many?: ",
			name: "changeQuantity",
			validate: function(value){
				if(isNaN(value) === false && Number.isInteger(Number(value))){
					return true;
				}else{
					console.error("\nERROR: Input is Not a Valid Number");
					return false;
				}
			}
		}).then(function(response){
		//console.log(productId,response.saleQuantity);
		changeQuantity(productId, response.changeQuantity, productsArray, connection);
		//getProducts(connection);
	});// end of quantity prompt
	});// end of product id prompt
}// end of salePrompt()

function changeQuantity(productId,deltaQuantity, productsArray, connection){
		connection.query("UPDATE products SET ? WHERE ?",[{
			stock_quantity: parseInt(productsArray[productId-1].stock_quantity) + parseInt(deltaQuantity),
		},{
			item_id: productId
		}],function(err,res){
			if(err){
				console.error(err);
				throw err;
			}else{
				console.log("Quantity Change Successful");
				getProducts(connection,getManagerInstruction);
			}
		});
}
function getDepartments(connection){
	connection.query("SELECT * FROM departments",function(err,res){
			if(err){
				console.error(err);
				throw err;
			}else{
				var deptNames = [];
				//console.log(res);
				for(var i=0;i<res.length;i++){
					deptNames.push(res[i].department_name);
				}
				//console.log(deptNames);
				addNewProduct(deptNames, connection);
			}
	});
}
function getProducts(connection, cb){
		connection.query("SELECT * FROM products", function(err,res){
			if(err){
				console.error(err);
				 throw err;
				}
			displayProducts(res, connection,cb);
		});
}
function getLowProducts(connection){
		connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err,res){
			if(err){
				console.error(err);
				 throw err;
				}
			displayProducts(res, connection, getManagerInstruction);
		});
}
function displayProducts(productsArray, connection, cb){
		
		var table = new Table({
			head: ["ID","Name","Dept","Price","In Stock"],
			//colWidths: [50,50,50,50,50],
		});
		for(var i =0; i<productsArray.length;i++){
			table.push([productsArray[i].item_id,productsArray[i].product_name,productsArray[i].department_name,productsArray[i].price,productsArray[i].stock_quantity]);
		}
		console.log(table.toString());
		//promptSale(productsArray, connection);
		cb(productsArray, connection);
}

getManagerInstruction([],connection);