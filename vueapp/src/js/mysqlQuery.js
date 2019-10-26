var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'db-instance.cz8fkapsud6o.us-east-2.rds.amazonaws.com:3306',
  user     : 'db_user',
  password : 'db_password',
  database : 'ssc'
});

// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
// }

export default {
	sensor_select_all() {
		var ret;
		connection.query('SELECT * FROM sensor', function (error, results, fields) {
			if (error) throw error;
			// connected!
			console.log(results);
			ret = results;
		});
		return ret;
	},
	end_connection() {
		connection.end();
	}
}

