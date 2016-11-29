import fs from 'fs'
import path from 'path'
import * as gradeDao from './grade-dao.js'

function getPath(grade) {
  let name
  switch(grade) {   
    case 0:
      name = 'kindergarten'
      break
    case 1:
      name = 'first'
      break
    case 2:
      name = 'second'
      break
    case 3:
      name = 'third'
      break
    case 4:
      name = 'fourth'
      break
    case 5:
      name = 'fifth'
      break
    case 6:
      name = 'sixth'
      break
    case 7:
      name = 'seventh'
      break
    case 8:
      name = 'eighth'
      break
  }
  return path.join(__dirname, `../mock-data/placements/${name}-placement.json`)
}

export function getPlacement(grade, db) {
    var result = {grade: grade}
    console.log(grade);
    var studentGrade = grade - 1;
    console.log(studentGrade)
    return new Promise((resolve, reject) => {
	    gradeDao.getStudentsInGrade(studentGrade, db)
            .then(students => {
                result.students = students
                gradeDao.getTeachersInGrade(grade, db)
		.then(teachers => {
                        result.teachers = teachers
                        gradeDao.getSections(grade, db)
			.then(sections => {
                                result.sections = sections.length
                                resolve(result)
                            })
			.catch(err => {
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



export function savePlacement(grade, placement,db){
    //get sections
    var year = 1950;
    console.log("in savePlacement");
    for(var section in placement.sections){
	console.log("in section: " + section.sectionID);
	insertSection(section,grade,db)
	    .then(res => {
		    insertStudents(section,grade,db) //also inserts the 'takes' table
		    insertTeaches(section,grade,db)
		    .then(res2 => {
			})
		})
	    }
}

function insertStudent(section,student,grade,db){
    var year = 1950;
    return new Promise((resolve, reject) => {
            db.query("INSERT into 'ydsd' values ('" 
		     + student.id + "','" 
		     + year + "','"
		     + student.comments + "',' "
		     + student.presentTeacher + "','"
		     + student.asp + "','"
		     + "''" + "','" //nextMeetingSch ??
		     + student.advancedMath + "','"
		     + "''" + "','" //speechLanguage
		     + '' + ',' //studentDevelopment
		     + "''" + "','" //mathEnrichment 
		     + student.iuRreadingSvcs + "','"
		     + student.iuMathSvcs + "','"
		     + student.earobics + "','"
		     + student.behavior + "','"
		     + student.workEthic + "','"
		     + student.youngest + "','" //youngestChild in db
		     + student.only + "','" //onlyChild in db
		     + student.newStudent + "','"
		     + student.medicalConcern + "','"
		     + student.hpm + "','"
		     + student.dra + "','"
		     + student.raz + "','"
		     + student.wtwBook + "','"
		     + "''" + "','" //iStation
		     + student.mathBench + "','"
		     + student.dibels + "','"
		     + "''" + "','" //cogAT
		     + "''" + "','" //IOWA
		     + student.elaTotal + "','"
		     + student.extendedEla + "','"
		     + student.mathTotal + "','"
		     + student.facultyStudent + "','"
		     + "''" + "','" //potential delay
		     + student.ge + "','"
		     + student.behavior + "','" //behaviorObservation in db
		     + "''" + "','" //self help
		     + "''" + "','" //social emotional
		     + student.dial4 + "','"
		     + student.gradeEntering + "','"
		     + "');"
                     , function (err, entities){
                         if(err){
                             reject(err)
                         } else {
                             resolve(entities)
                         }
                     })
        })
}

function insertTakes(section,student,grade,db){
    var year = 1950;
    return new Promise((resolve, reject) => {
            db.query('INSERT into "takes" values (' + student.id + ',' + year + ',' + section.sectionID + ');'
                     , function (err, entities){
                         if(err){
                             reject(err)
                         } else {
                             resolve(entities)
                         }
                     })
        })
}

function insertStudents(section,grade,db){
    var year = 1950;
    for(var student in section.students){
	insertStudent(section,student,grade,db)
	    .then(res => {
		    insertTakes(section,student,grade,db)
		    .then(res2 => {
			})
		})
	    }
}
    
function insertTeaches(section,grade,db){
    var year = 1950;
    return new Promise((resolve, reject) => {
            db.query('INSERT into "teaches" values (' + section.teacher.emailID + ',' + section.sectionID + ',' + year + ');'
                     , function (err, entities){
                         if(err){
                             reject(err)
                         } else {
                             resolve(entities)
                         }
                     })
        })
}	    

function insertSection(section,grade,db){
    var year = 1950;
    console.log("attempting to insert section: " + section.sectionID + " in year " + year);
    return new Promise((resolve, reject) => {
	    db.query('INSERT into "section" values (' + section.sectionID + ',' + year + ',' + grade + ');'
		     , function (err, entities){
			 if(err){
			     console.log("we had a terrible error!");
			     reject(err)
			 } else {
			     resolve(entities)
			 }
		     })
	})
}

export function deletePlacement(grade,db){
    var year = 1950;
    deleteSection(grade,year,db)
	.then(res => {
		deleteStudents(grade,year,db)
		.then(res2 => {
			deleteTeaches(grade,year,db)
			.then(res3 => {
				deleteTakes(grade,year,db)
				.then(res4 => {
				    })
			    })
		    })
	    })
	}

function deleteTakes(grade,year,db){
    return new Promise((resolve, reject) => {
            db.query('DELETE from "takes" where year ="' + year + '"'
                     , function (err, entities){
                         if(err){
                             reject(err)
                         } else {
                             resolve(entities)
                         }
                     })
        })
	}

function deleteTeaches(grade,year,db){
    return new Promise((resolve, reject) => {
            db.query('DELETE from "teaches" where year ="' + year + '"'
                     , function (err, entities){
                         if(err){
                             reject(err)
                         } else {
                             resolve(entities)
                         }
                     })
        })
	}

function deleteSection(grade,year,db){
    return new Promise((resolve, reject) => {
            db.query('DELETE from "section" where year ="' + year + '"'
                     , function (err, entities){
                         if(err){
                             reject(err)
                         } else {
                             resolve(entities)
                         }
                     })
        })
}

function deleteStudents(grade,year,db){
    return new Promise((resolve, reject) => {
            db.query('DELETE from "ydsd" where year ="' + year + '"'
                     , function (err, entities){
                         if(err){
                             reject(err)
                         } else {
                             resolve(entities)
                         }
                     })
        })
	}
