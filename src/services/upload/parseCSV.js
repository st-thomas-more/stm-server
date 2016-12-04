import * as fs from 'fs'
import csvjson from 'csvjson'
import * as model from './insertToDB'

export default function parse_csv(filename,db) {

    var data = fs.readFileSync(filename, { encoding : 'utf8'})
    var options = { delimiter : ','}
    var result = csvjson.toObject(data, options)

    for (var i in result) 
    {
        model.insertStudent([result[i].id, result[i].lastName, result[i].firstName,result[i].sex, result[i].dob], db)
        model.insertYdsd([result[i].id, result[i].year, result[i].comments ,result[i].homeroomTeacher ,result[i].asp ,result[i].nextMeetingSch ,result[i].advancedMath ,result[i].speechLanguage ,result[i].studentDevelopment ,result[i].mathEnrichment ,result[i].IUreadingServices ,result[i].IUmathServices ,result[i].earobics ,result[i].workEthic ,result[i].youngestChild ,result[i].onlyChild ,result[i].newStudent ,result[i].medicalConcern ,result[i].hmp ,result[i].dra ,result[i].RAZ ,result[i].WTW ,result[i].iStation ,result[i].mathBench ,result[i].Dibels ,result[i].cogAT ,result[i].IOWA ,result[i].elaTotal ,result[i].ExtendedELA ,result[i].mathTotal ,result[i].facultyStudent ,result[i].potentialDelay ,result[i].behaviorObservation ,result[i].selfHelp ,result[i].socialEmotional ,result[i].dial4 ,result[i].gradeEntering, result[i].ge],db)
    }
    return result
}

