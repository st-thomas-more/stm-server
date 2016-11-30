import mysql from 'mysql'

export default callback => {
	// connect to a database if needed, the pass it to `callback`:
	callback(mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: 'STM_DB',
        multipleStatements: true
    }))
}
