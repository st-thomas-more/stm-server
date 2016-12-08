import * as fs from 'fs'
import csvjson from 'csvjson'

import * as util from '../../lib/util'

export default function insertCSV(filename, db) {
    console.log('starting insertCSV...')
	let data = fs.readFileSync(filename, { encoding: 'utf8' })
	const options = { delimiter: ',' }
	let result = csvjson.toObject(data, options)

	return new Promise((resolve, reject) => {
		for (let i in result) {
			if (result[i].id !== ' ') {
                let rc = validateInput(result[i])
                if (rc !== 'success') {
                    reject(new Error(rc))
                } else {
				    insertStudent([result[i].id, result[i].lastName, result[i].firstName, result[i].sex, result[i].dob], db)
				    insertYdsd([result[i].id, result[i].year, result[i].comments, result[i].homeroomTeacher, result[i].asp, result[i].nextMeetingSch, result[i].advancedMath, result[i].speechLanguage, result[i].studentDevelopment, result[i].mathEnrichment, result[i].IUreadingServices, result[i].IUmathServices, result[i].earobics, result[i].workEthic, result[i].youngestChild, result[i].onlyChild, result[i].newStudent, result[i].medicalConcern, result[i].hmp, result[i].dra, result[i].RAZ, result[i].WTW, result[i].iStation, result[i].mathBench, result[i].Dibels, result[i].cogAT, result[i].IOWA, result[i].elaTotal, result[i].ExtendedELA, result[i].mathTotal, result[i].facultyStudent, result[i].potentialDelay, result[i].behaviorObservation, result[i].selfHelp, result[i].socialEmotional, result[i].dial4, result[i].gradeEntering, result[i].ge], db)
				    	.catch(err => {
				    		reject(err)
				    	})
                }
			}
		}
        console.log('done insertCSV')
		resolve()
	}
	)
}

function validateInput(entity) {
    return 'success'
}

function insertStudent(data, db) {
	return new Promise((resolve, reject) => {
		let data2 = data
		let data3 = data2.concat(data)
		db.query(
			'INSERT INTO `student` (id, lastName, firstName, sex, dob) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE  id = ?, `lastName`= ?, `firstName`=?, `sex`= ?, `dob`=?;',
			data3,
			function (err) {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
	})
}

function insertYdsd(data, db) {
	return new Promise((resolve, reject) => {
        let numericKeys = ['mathBench', 'cogAT', 'dra', 'elaTotal', 'mathTotal', 'behaviorObservation', 'dial4']
        let values = [data[23], data[25],data[19],data[27], data[29], data[32], data[34]]
        for (let i = 0; i < numericKeys.length; i++) {
            let key = numericKeys[i]
            let val = values[i]
            if (utils.validateScore(key,val) ==='error') {
      	        let err = 'Invalid format for student '+data[0]
      	        reject(err)
            } else {
                let data2 = data
                let data3 = data2.concat(data)
                db.query(
      	            'INSERT INTO `ydsd` (id, year, comments, homeroomTeacher, asp, nextMeetingSch, advancedMath, speechLanguage, studentDevelopment, mathEnrichment, IUreadingServices, IUmathServices, earobics, workEthic, youngestChild, onlyChild, newStudent, medicalConcern, hmp, dra, RAZ, WTW, iStation, mathBench, Dibels, cogAT, IOWA, elaTotal, ExtendedELA, mathTotal, facultyStudent, potentialDelay, behaviorObservation, selfHelp, socialEmotional, dial4, gradeEntering, ge) VALUES (?,?,?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,?, ?) ON DUPLICATE KEY UPDATE  `id` = ?, `year`=?, `comments`=?, `homeroomTeacher`=?, `asp`=?, `nextMeetingSch`=?, `advancedMath`=?, `speechLanguage`=?, `studentDevelopment`=?, `mathEnrichment`=?, `IUreadingServices`=?, `IUmathServices`=?, `earobics`=?, `workEthic`=?, `youngestChild`=?, `onlyChild`=?, `newStudent`=?, `medicalConcern`=?, `hmp`=?, `dra`=?, `RAZ`=?, `WTW`=?, `iStation`=?, `mathBench`=?, `Dibels`=?, `cogAT`=?, `IOWA`=?, `elaTotal`=?, `ExtendedELA`=?, `mathTotal`=?, `facultyStudent`=?, `potentialDelay`=?, `behaviorObservation`=?, `selfHelp`=?, `socialEmotional`=?, `dial4` =?, `gradeEntering` = ?, `ge`=?;',
			        data3, function (err) {
				        if (err) {
					    reject(err)
				        } else {
					        resolve()
				        }
			        })
	        }
       }
   })
}
