const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
var mongoClient = require('mongodb').MongoClient
const app = express()
const port = process.env.PORT || 3000
var connection = mysql.createConnection({
  host     : 'db-instance.cz8fkapsud6o.us-east-2.rds.amazonaws.com',
  port: '3306',
  user     : 'db_user',
  password : 'db_password',
  database : 'SSC_temp'
});

app.use(cors());

connection.query('SELECT * FROM sensor', function (error, results, fields) {
	if (error) throw error;
	// connected!
	app.get('/selectAllSensor', (req, res) => res.send(results));
})
connection.query('SELECT * FROM node WHERE nodeTypeId=2', function (error, results, fields) {
	if (error) throw error;
	// connected!
	app.get('/selectNodeWarehouse', (req, res) => res.send(results));
})
connection.query('SELECT * FROM node WHERE nodeTypeId=1', function (error, results, fields) {
	if (error) throw error;
	// connected!
	app.get('/selectNodeTruck', (req, res) => res.send(results));
})
connection.query('SELECT sensor.sensorId, node_sensors.nodeId, sensor.sensorTypeId, sensor.location, sensor.status, sensor.setup_date, sensor.last_update FROM node_sensors RIGHT JOIN sensor ON sensor.sensorId=node_sensors.sensorId LEFT JOIN node ON node.nodeId=node_sensors.nodeId WHERE node.nodeTypeId=1', function (error, results, fields) {
	if (error) throw error;
	// connected!
	app.get('/selectSensorTruck', (req, res) => res.send(results));
})
connection.query('SELECT sensor.sensorId, node_sensors.nodeId, sensor.sensorTypeId, sensor.location, sensor.status, sensor.setup_date, sensor.last_update FROM node_sensors RIGHT JOIN sensor ON sensor.sensorId=node_sensors.sensorId LEFT JOIN node ON node.nodeId=node_sensors.nodeId WHERE node.nodeTypeId=2', function (error, results, fields) {
	if (error) throw error;
	// connected!
	app.get('/selectSensorWarehouse', (req, res) => res.send(results));
})


//MongoDB
const url ='mongodb://admin:admin@54.67.2.154:27017/admin';
mongoClient.connect(url, function (err, client) {
  if (err) throw err

  var db = client.db('SmartSupplyChainDB')
  // db.listCollections().toArray(function (err, result) {
  // 	if (err) throw err

  // 	console.log(result)
  // })

  db.collection('sensor_data').find().toArray(function (err, result) {
    if (err) throw err

    app.get('/sensorData', (req, res) => res.send(result));
  })
})

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Express app listening on port ${port}!`))
connection.end()


