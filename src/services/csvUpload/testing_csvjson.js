
'use strict';

var fs = require('fs');
var path = require('path');
var csvjson = require('csvjson');
var model = require('./load_csv_data');

function parse_csv(err,filename) {
    
    if (err) throw err;
    //console.log('in testing_csvjson');
    console.log(filename);
    var data = fs.readFileSync(filename, { encoding : 'utf8'});
    console.log(data);
    var options = { delimiter : ','};
    var result = csvjson.toObject(data, options);
    console.log(result);
    for (var i in result) {
        console.log(result[i].id);
        model.insert_student([result[i].id, result[i].lastName, result[i].firstName,result[i].sex, result[i].dob], function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });
        model.insert_ydsd([result[i].id, result[i].year, result[i].comments ,result[i].homeroomTeacher ,result[i].asp ,result[i].nextMeetingSch ,result[i].advancedMath ,result[i].speechLanguage ,result[i].studentDevelopment ,result[i].mathEnrichment ,result[i].IUreadingServices ,result[i].IUmathServices ,result[i].earobics ,result[i].behavior ,result[i].workEthic ,result[i].youngestChild ,result[i].onlyChild ,result[i].newStudent ,result[i].medicalConcern ,result[i].hmp ,result[i].dra ,result[i].RAZ ,result[i].WTW ,result[i].iStation ,result[i].mathBench ,result[i].Dibels ,result[i].cogAT ,result[i].IOWA ,result[i].elaTotal ,result[i].ExtendedELA ,result[i].mathTotal ,result[i].facultyStudent ,result[i].potentialDelay ,result[i].behaviorObservation ,result[i].selfHelp ,result[i].socialEmotional ,result[i].dial4 ,result[i].gradeEntering], function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
    return result;
}

module.exports = parse_csv;
