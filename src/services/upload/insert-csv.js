import * as fs from 'fs'
import csvjson from 'csvjson'

import * as util from '../../lib/util'

export default function insertCSV(filename, db) {
    console.log('starting insertCSV....')
	let data = fs.readFileSync(filename, { encoding: 'utf8' })
	const options = { delimiter: ',' }
	let result = csvjson.toObject(data, options)
	let studentPromises = []
	let ydsdPromises = []
	return new Promise((resolve, reject) => {
		validateInput(result)
		.then(result => {
			for (let i in result) {
			    if (result[i].id !== ' ') {
				studentPromises.push(insertStudent([result[i].id, result[i].lastName, result[i].firstName, result[i].sex, result[i].dob], db))
				ydsdPromises.push(insertYdsd([result[i].id, result[i].year, result[i].comments, result[i].homeroomTeacher, result[i].asp, result[i].nextMeetingSch, result[i].advancedMath, result[i].speechLanguage, result[i].studentDevelopment, result[i].mathEnrichment, result[i].IUreadingServices, result[i].IUmathServices, result[i].earobics, result[i].workEthic, result[i].youngestChild, result[i].onlyChild, result[i].newStudent, result[i].medicalConcern, result[i].hmp, result[i].dra, result[i].RAZ, result[i].WTW, result[i].iStation, result[i].mathBench, result[i].Dibels, result[i].cogAT, result[i].IOWA, result[i].elaTotal, result[i].ExtendedELA, result[i].mathTotal, result[i].facultyStudent, result[i].potentialDelay, result[i].behaviorObservation, result[i].selfHelp, result[i].socialEmotional, result[i].dial4, result[i].gradeEntering, result[i].ge], db))
			    }
			}
			//resolve
			console.log('attempting to resolve insertCSV promises')
			Promise.all(studentPromises).then(() => {
				Promise.all(ydsdPromises).then(() => {
					console.log('resolved insertCSV successfully')
					resolve()
				    })
				.catch(err =>{
					reject(err)
				    })
				    })
			.catch(err => {
				reject(err)
			    })
			    })
		.catch(err => {
			reject(err)
		    })   
		    })
}

function validateInput(result) {
    console.log('in validate input')
    let validationPromises = []
    return new Promise((resolve, reject) => {
	    for(let i in result){
		//console.log('in loop')
		//console.log(result[i])
		let entity = result[i]
		//console.log('derp')
		let ret = 'default'
		//console.log('here!')
		let numericKeys = ['mathBench', 'cogAT', 'dra', 'elaTotal', 'mathTotal', 'behaviorObservation', 'dial4','dob']
		let values = [entity.mathBench,entity.cogAT,entity.dra,entity.elaTotal,entity.mathTotal,entity.behaviorObservation,entity.dial4,entity.dob]
		//console.log('values lengths: ' + values.length)
		//for(i in range(values.length)){
		for (i = 0; i < values.length; i++){
		    validationPromises.push(validateScore(numericKeys[i],values[i]))
		}
	    }
	    console.log('attempting to resolve validateInput promises..')
	    console.log('length is: ' + validationPromises.length + '')
	    console.log('here!')
	    Promise.all(validationPromises).then(() =>{
		    console.log('validationPromises worked!')
		    resolve()
		}).catch(reason => {
			console.log('our all failed!')
			console.log(reason)
			reject(reason)
		    })
	})
	}


function validateScore(key, val){
    //console.log(key)
    //console.log(val)
    return new Promise((resolve, reject) => {
	    let toReject = 0
	    let toResolve = 0;
	    let rejectMessage = ''
	    //console.log('in validateScore')
	    if (typeof val === 'undefined' || val === null) {
		toResolve = 1
	    } else if (typeof val === 'string') {
		if(!val){
		    toResolve = 1
		}else {
		    val = parseInt(val,10)
		    if(isNaN(val)){
			console.log('isNaN failed- rejecting')
			rejectMessage = 'val is NaN'
			toReject = 1
		    }
		}
	    } else if(!val){
		console.log('no val- rejecting upload')
		toReject = 1
		rejectMessage = 'no value found'
	    }else{
		//console.log('in front of switch key in validateScore')
		switch(key){
		case 'mathBench':
		val = parseInt(val,10)
		if(val < 0 || val > 100){
		    console.log('rejecting on mathBench')
		    rejectMessage = 'illegal mathBench'
		    toReject = 1
		}else{
		    toResolve = 1
		}
		break;
		case 'cogAT':
		val = parseInt(val,10)
		if(val < 0 || val > 160){
		    console.log('rejecting cogAT')
		    rejectMessage = 'illegal cogAT'
		    toReject = 1
		}
		else{
		    toResolve = 1
		}
		break;
		case 'dob':
		var pattern = new RegExp("/^\d{2}[./-]\d{2}[./-]\d{4}$")
		var pattern2 = new RegExp("/^\d{1}[./-]\d{2}[./-]\d{4}$.test(val)")
		if(! pattern.test(val)){
		    if(pattern2.test(val)){
		    val = '0'+val
		    }else{
			console.log('rejecting date: ' + val)
			rejectMessage = 'illegal date of birth'
			toReject = 1
		    }
		}
		
		// Parse the date parts to integers
		var parts = val.split("/");
		var day = parseInt(parts[1], 10);
		var month = parseInt(parts[0], 10);
		var year = parseInt(parts[2], 10);

		// Check the ranges of month and year
		if(year < 1000 || year > 3000 || month == 0 || month > 12)
		    console.log('rejecting because year/month was no good')
			rejectMessage = 'illegal date of birth'
		    toReject = 1

		var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		// Adjust for leap years
		if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
		    monthLength[1] = 29;

		// Check the range of the day
		if(day > 0 && day <= monthLength[month - 1]){
		    toResolve = 1
			}else{
		    console.log('rejecting on day / monthLength ')
		    rejectMessage = 'illegal date of birth'
		    toReject = 1
		}
		break;
                case 'dra':
		val = parseInt(val,10)
		if(val < 0 || val > 70){
		    console.log('rejecting dra')
		    rejectMessage = 'illegal dra'
		    toReject = 1
		}
		else{
		    toResolve = 1
		}
		break;
		case 'elaTotal':
		val = parseInt(val,10)
		if(val < 0 || val > 100){
		    console.log('failing on elaTotal')
		    rejectMessage = 'illegal elaTotal'
		    toReject = 1
		}
		else{
		    toResolve = 1
		}
		break;
		case 'mathTotal':
		val = parseInt(val,10)
		if(val < 0 || val > 100){
		    console.log('failing on mathTotal')
		    rejectMessage = 'illegal mathTotal'
		    toReject = 1
		}
		else{
		    toResolve = 1
		}
		break;
		case 'behaviorObservation':
		val = parseInt(val,10)
		if(val < 0 || val > 54){
		    console.log('failing in behaviorObservation')
		    rejectMessgae = 'illegal behaviorObservation'
		    toReject = 1
		}
		else{
		    toResolve = 1
		}
		break;
		case 'dial4':
		val = parseInt(val,10)
		if(val < 0 || val > 105){
		    console.log('failing in dail4')
		    rejectMessage = 'illegal dial4'
		    toReject = 1
		}
		else{
		    toResolve = 1
		}
		break;
		default:
		}
		//outside switch statement
	    }
	    //outside else statement
	    if(toReject === 1){
		reject('error: ' + rejectMessage)
	    }else if(toResolve === 1){
		resolve('success')
	    }else{
		//console.log('both were 0')
		resolve('success')
	    }
	})
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
	        
       
   })
}
