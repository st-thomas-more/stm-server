import mysql from 'mysql'
import config from './config.json'

export default callback => {
	// connect to a database if needed, the pass it to `callback`:
	callback(mysql.createConnection({
        host: config.mysql_host,
        user: config.mysql_user,
        password: config.mysql_password,
        database: "STM_DB"
    }))
}
