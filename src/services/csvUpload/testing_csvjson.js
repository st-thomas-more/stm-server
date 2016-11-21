
'use strict';

var fs = require('fs');
var path = require('path');
var csvjson = require('csvjson');
var model = require('./load_csv_data');

function parse_csv(err,filename) {
    
    if (err) throw err;
    //console.log('in testing_csvjson');
    //console.log(filename);
    var data = fs.readFileSync(filename, { encoding : 'utf8'});
    
    var options = { delimiter : ','};
    var result = csvjson.toObject(data, options);
    
    for (var i in result) {
        model.insert_student([result[i].ID, result[i].LName, result[i].FName, result[i].DOB], function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
    console.log("just before result");
    return result;
}

module.exports = parse_csv;
