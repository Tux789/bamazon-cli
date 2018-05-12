var dotenv = require('dotenv').config();
var connectionParams = require("./database.js");
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection(connectionParams.db);

function getSupervisorInstruction(connection){
	inquirer.prompt({
		type: "list",
		message: "What do you want to do? ",
		choices: ["View Product Sales by Department","Create New Department"],
		name: "managerInstruction"
	}).then(function(response){
			switch(response.managerInstruction){
				case "View Product Sales by Department":
					getSalesByDept(connection);
				break;
				case "Create New Department":
					promptNewDept(connection);
				break;
			}
	});
}

function promptNewDept(connection){
	inquirer.prompt([{
		type: "input",
		message: "Department Name?: ",
		name: "deptName"
	},{
		type: "input",
		message: "Department Overhead Costs?: ",
		name: "deptCosts",
		validate: function(value){
			if(isNaN(value) === false){
				return true;
			}else{
				console.error("\nERROR: Input is Not a Valid Number");
				return false;
			}
		}
	}]).then(function(response){
			createNewDept(response.deptName,response.deptCosts, connection);
	});
}

function createNewDept(deptName, deptCosts, connection){
	connection.query("INSERT INTO departments SET ?",{
		department_name: deptName,
		over_head_costs: deptCosts,
	},function(err,res){
		if(err){
			console.error(err);
			throw err;
		}else{
			console.log("Insert Successful");
			getSupervisorInstruction(connection);
		}
	});
}

function getSalesByDept(connection){
	connection.query("SELECT dept.department_id, dept.department_name, dept.over_head_costs, FORMAT(IFNULL(SUM(pro.product_sales),0),2) AS product_sales, FORMAT(IFNULL(SUM(pro.product_sales),0)-IFNULL(dept.over_head_costs,0),2) AS profit FROM departments dept LEFT JOIN products pro ON pro.department_name = dept.department_name GROUP BY pro.department_name ORDER BY dept.department_id ASC",
			function(err,res){
				if(err){
					console.error(err);
					throw err;
				}else{
					//console.log(res);
					displaySales(res,connection, getSupervisorInstruction);
				}
			});
}

function displaySales(salesArray, connection, cb){
		
		var table = new Table({
			head: ["department_id","department_name","over_head_costs", "product_sales","total_profit"],
			//colWidths: [50,50,50,50,50],
		});
		for(var i =0; i<salesArray.length;i++){
			table.push([salesArray[i].department_id,salesArray[i].department_name,salesArray[i].over_head_costs,salesArray[i].product_sales,salesArray[i].profit]);
		}
		console.log(table.toString());
		//promptSale(productsArray, connection);
		cb(connection);
}

getSupervisorInstruction(connection);