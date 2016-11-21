'use strict';

var extend = require('lodash').assign;
var mysql = require('mysql');
var config = require('../../config');

/*
function getConnection () {
  return mysql.createConnection(extend({
    database: 'STM_DB'
  }, {
    host: config.get('MYSQL_HOST'),
    user: config.get('MYSQL_USER'),
    password: config.get('MYSQL_PASSWORD')
  }));
}*/

function insert_student (data, cb) {
    return new Promise ((resolve, reject) => {
        db.query('INSERT INTO `student` (ID, LName, FName, DOB) VALUES (?, ?, ?, ?)',data)
       if(err){
        reject(err)
       }else{
        resolve(entities)
       }
    })
}

module.exports = {
    insert_student: insert_student
};

if (module == require.main) {
    // call the data
    var data;

    // run the insert
    for (var i in data){
        insert(data[i], function (err, res) {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
}
