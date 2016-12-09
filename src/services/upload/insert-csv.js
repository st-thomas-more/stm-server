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
	let takesPromises = []
	let validatePromises = []
	let sectionPromises = []

	return new Promise((resolve, reject) => {
		console.log("above result printout")
		for (let student of result) {
			validatePromises.push(
				new Promise((resolve, reject) => {
					validateInput(student)
					.then(() => { 
						let studentData = {
							id: student.id,
							firstName: student.firstName,
							lastName: student.lastName,
							sex: student.sex,
							dob: student.dob
						}
						let takesData = {
							id: student.id,
							sectionID: student.sectionID,
							year: student.year
						}
						let sectionData = {
							grade: student.gradeEntering,
							sectionID: student.sectionID
						}
						delete student.sectionID
						delete student.firstName
						delete student.lastName
						delete student.sex
						delete student.dob
						studentPromises.push(insertStudent(studentData, db))
						ydsdPromises.push(insertYdsd(student, db))
						//sectionPromises.push(insertSection(sectionData,db))
						takesPromises.push(insertTakes(takesData,db))
						resolve()
					})
					.catch(err => {
						reject(err)
					})
				})
				)
			}

			//resolve
			// console.log('attempting to resolve insertCSV promises')
			// console.log(studentPromises.length)
			// console.log(ydsdPromises.length)
			// console.log(takesPromises.length)

			Promise.all(validatePromises).then(() => {
				console.log(studentPromises.length)
				console.log(ydsdPromises.length)
				console.log(takesPromises.length)
				Promise.all(studentPromises).then(() => {
					Promise.all(ydsdPromises).then(() => {
						Promise.all(sectionPromises).then(() =>{
							Promise.all(takesPromises).then(() => {
								console.log('resolved insertCSV successfully')
								resolve()
							})
						})
					})
				})
			})
			.catch(err => {
				reject(err)
			})
		})
		}

		function validateInput(student) {
			return new Promise (( resolve, reject) =>{ 

				if(!('id' in student) || student.id === ''){
					reject(new Error('student missing ID'))
				}
				if(!('lastName' in student) || student.lastName === ''){
					reject(new Error('student missing lastName'))
				}
				if(!('firstName' in student) || student.firstName === ''){
					reject(new Error('student missing firstName'))
				}
				if(!('sex' in  student) || (student.sex !== 'M' && student.sex !== 'F') ){
					reject(new Error('student missing sex or not put in as "M" or "F" '))
				}
				if(!('dob' in student) || !(isValidDOB(student))){
					reject(new Error('student has invalid dob, format dd/mm/yyyy'))
				}
				if(!('gradeEntering' in student) || student.gradeEntering === '' || !(isValidGrade(student.gradeEntering))){
					reject(new Error('grade'))
				}
				if(!('year' in student) || student.year === '' || student.year < 2000 || student.year > 2100 ){
					reject(new Error('year'))
				}
				if(('mathBench' in  student) && student.mathBench !== ''){
					const mathBench = parseInt(student.mathBench,10)
					if(mathBench < 0 || mathBench >100 ){
						reject(new Error(`mathBench not in range: ${mathBench}`))
					}
				} 
				if(('cogAT' in  student) && student.cogAT !== ''){
					const cogAT = parseInt(student.cogAT,10)
					if(cogAT < 0 || cogAT >100 ){
						reject(new Error(`cogAT not in range: ${cogAT}`))
					}
				}
				if(('dra' in  student) && student.dra !== ''){
					const dra = parseInt(student.dra,10)
					if(dra < 0 || dra >100 ){
						reject(new Error(`dra not in range: ${dra}`))
					}
				} 
				if(('elaTotal' in  student) && student.elaTotal !== ''){
					const elaTotal = parseInt(student.elaTotal,10)
					if(elaTotal < 0 || elaTotal >100 ){
						reject(new Error(`elaTotal not in range: ${elaTotal}`))
					}
				} 
				if(('mathTotal' in  student) && student.mathTotal !== ''){
					const mathTotal = parseInt(student.mathTotal,10)
					if(mathTotal < 0 || mathTotal >100 ){
						reject(new Error(`mathTotal not in range: ${mathTotal}`))
					}
				}
				if(('behaviorObservation' in  student) && student.behaviorObservation !== ''){
					const behaviorObservation = parseInt(student.behaviorObservation,10)
					if(behaviorObservation < 0 || behaviorObservation >54){
						reject(new Error(`behaviorObservation not in range: ${behaviorObservation}`))
					}
				}
				if(('dial4' in  student) && student.dial4 !== ''){
					const dial4 = parseInt(student.dial4,10)
					if(dial4 < 0 || dial4 >105){
						reject(new Error(`dial4 not in range: ${dial4}`))
					}
				}
				if(('workEthic' in  student) && student.workEthic !== ''){
					const workEthic = parseInt(student.workEthic,10)
					if(workEthic < 0 || workEthic >3){
						reject(new Error(`workEthic not in range: ${workEthic}`))
					}
				}
				if(('behavior' in  student) && student.behavior !== ''){
					const behavior = parseInt(student.behavior,10)
					if(behavior < 0 || behavior >2){
						reject(new Error(`behavior not in range: ${behavior}`))
					}
				}


				for(let key of Object.keys(student) ){
					if(student[key] === ''){
						student[key] = null
					}
				}
				resolve()

			})	
		}

		function isValidGrade(gradeEntering){
			const grade = parseInt(gradeEntering,10)
			return (grade >= 0 && grade <= 8)
		}



		function isValidDOB(student){
			let date = Date.parse(student.dob)


			if(isNaN(date)){
				return false
			}

			date = new Date (date)

			student.dob = ('0' + (date.getMonth()+1)).slice(-2) + '/'
			+ ('0' + date.getDate()).slice(-2) + '/'
			+ date.getFullYear();
			return true
		}



		function insertTakes(data, db) {
			console.log("in insertTakes")
			return new Promise((resolve, reject) => {
				db.query(
					'INSERT INTO `takes` (id, sectionID, year) select * from (select ?, ?, ?) tmp where not exists(select id from takes where id = ? and sectionID = ? and year = ?) limit 1;',
					[data.id, data.sectionID, data.year, data.id, data.sectionID, data.year], function(err) {
						if (err) {
							reject(err)
						} else {
							resolve()
						}
					}
					)
			})
		}

		function insertStudent(data, db) {
			console.log("in insertstudent")
			return new Promise((resolve, reject) => {
				db.query(
					'INSERT INTO `student` SET ? ON DUPLICATE KEY UPDATE ?;',
					[data, data],
					function (err) {
						if (err) {
							reject(err)
						} else {
							resolve()
						}
					})
			})
		}
		/*function insertSection(data,db){
			console.log("in insertSection")
			return new Promise((resolve, reject) =>{
				db.query(
					'INSERT INTO `section` SET ? ON DUPLICATE KEY UPDATE ?;',
					[data,data],
					function (err){
						if(err){
							reject(err)
						}
						else{
							resolve()
						}
					})
			})
		}*/



		function insertYdsd(data, db) {
			console.log("in insertYdsd")
			return new Promise((resolve, reject) => {
				db.query(
					'INSERT INTO `ydsd` SET ? ON DUPLICATE KEY UPDATE ?;',
					[data, data], function (err) {
						if (err) {
                            console.log(err)
							reject(err)
						} else {
							console.log('successfully inserted into ydsd')
							resolve()
						}
					})


			})
		}
