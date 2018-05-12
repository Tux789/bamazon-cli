var dotenv = require('dotenv').config();
var connectionParams = require("./database.js");
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection(connectionParams.db);

function getProducts(connection){
		connection.query("SELECT * FROM products",function(err,res){
			if(err){
				console.error(err);
				 throw err;
				}
			displayProducts(res, connection);
		});
}
function displayProducts(productsArray, connection){
		
		var table = new Table({
			head: ["ID","Name","Dept","Price","In Stock"],
			//colWidths: [50,50,50,50,50],
		});
		for(var i =0; i<productsArray.length;i++){
			table.push([productsArray[i].item_id,productsArray[i].product_name,productsArray[i].department_name,productsArray[i].price,productsArray[i].stock_quantity]);
		}
		console.log(table.toString());
		promptSale(productsArray, connection);
}

function promptSale(productsArray, connection){
	inquirer.prompt({
		type: "input",
		message: "Product ID to buy?: ",
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
			name: "saleQuantity",
			validate: function(value){
				if(isNaN(value) === false && Number.isInteger(Number(value))){
					if(value >= 0 && value <= productsArray[productId-1].stock_quantity){
						return true;
					}else{
						console.error("\nERROR: Insufficient Quantity");
						return false;
					}
				}else{
					console.error("\nERROR: Input is Not a Valid Number");
					return false;
				}
			}
		}).then(function(response){
		//console.log(productId,response.saleQuantity);
		processSale(productId, response.saleQuantity, productsArray, connection);
		//getProducts(connection);
	});// end of quantity prompt
	});// end of product id prompt
}// end of salePrompt()

function processSale(productId, saleQuantity, productsArray, connection){
	connection.query("UPDATE products SET ? WHERE ?",[{
		stock_quantity: productsArray[productId-1].stock_quantity - saleQuantity,
		product_sales: productsArray[productId-1].product_sales + getSalePrice(productsArray[productId-1].price,saleQuantity),
	},{
		item_id: productId
	}],function(err,res){
		if (err){
			console.error(err);
			throw err;
		}else{
			console.log("Sale was successful");
			console.log(`You were charged $${getSalePrice(productsArray[productId-1].price,saleQuantity)} for your purchase.`)
			getProducts(connection);
		}
	});
}
function getSalePrice(unitPrice,quantity){
	var number = unitPrice*quantity;
	return number.toFixed(2);
}
getProducts(connection);