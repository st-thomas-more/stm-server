'use strict';

var dotenv = require('dotenv');
dotenv.config();

var extend = require('lodash').assign;
var mysql = require('mysql');



function getConnection () {
  return mysql.createConnection(extend({
    database: 'STM_DB',
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }));
}

function insert_student (data, cb) {
    var connection = getConnection();
    var data2 = data;
    var data3 = data2.concat(data);
    console.log(data3);
    connection.query(
        'INSERT INTO `student` (id, lastName, firstName, sex, dob) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE  id = ?, `lastName`= ?, `firstName`=?, `sex`= ?, `dob`=?;',
        data3,
        cb
    );
    connection.end();
}

function insert_ydsd(data,cb){
  var connection = getConnection();
    var comment = connection.query(
    'SELECT comments from ydsd where id = ?;',
    data[0],
    cb
    );
    if(commment!='' && data[2] ==''){
       data[2] = commment;
    }

  var data2 = data;
  var data3 = data2.concat(data);
  console.log(data3);
  connection.query(
      'INSERT INTO `ydsd` (id, year, comments, homeroomTeacher, asp, nextMeetingSch, advancedMath, speechLanguage, studentDevelopment, mathEnrichment, IUreadingServices, IUmathServices, earobics, behavior, workEthic, youngestChild, onlyChild, newStudent, medicalConcern, hmp, dra, RAZ, WTW, iStation, mathBench, Dibels, cogAT, IOWA, elaTotal, ExtendedELA, mathTotal, facultyStudent, potentialDelay, behaviorObservation, selfHelp, socialEmotional, dial4, gradeEntering) VALUES (?,?,?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,?) ON DUPLICATE KEY UPDATE  `id` = ?, `year`=?, `comments`=?, `homeroomTeacher`=?, `asp`=?, `nextMeetingSch`=?, `advancedMath`=?, `speechLanguage`=?, `studentDevelopment`=?, `mathEnrichment`=?, `IUreadingServices`=?, `IUmathServices`=?, `earobics`=?, `behavior`=?, `workEthic`=?, `youngestChild`=?, `onlyChild`=?, `newStudent`=?, `medicalConcern`=?, `hmp`=?, `dra`=?, `RAZ`=?, `WTW`=?, `iStation`=?, `mathBench`=?, `Dibels`=?, `cogAT`=?, `IOWA`=?, `elaTotal`=?, `ExtendedELA`=?, `mathTotal`=?, `facultyStudent`=?, `potentialDelay`=?, `behaviorObservation`=?, `selfHelp`=?, `socialEmotional`=?, `dial4` =?, `gradeEntering` = ?;',
      data3,
      cb
    );

  connection.end();
}


module.exports = {
    insert_student: insert_student,
    insert_ydsd: insert_ydsd
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

if (module == require.main) {
  console.log(process.env.MYSQL_HOST);
}
