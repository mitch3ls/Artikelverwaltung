const mysql = require('promise-mysql')

const config = {
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'artikelverwaltung'
}
module.exports = (queryString, variables) =>
  mysql.createConnection(config)
    .then(con => {
      const results = con.query(queryString, variables)
      con.end()
      return results
    })