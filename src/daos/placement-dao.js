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
    var promise = deletePlacement(grade,db);
    promise.then( () => {
	    savePlaceHelper(grade,placement,db);
	    }).catch(err => {
		    reject(err)
		})
		   }
		     

export function savePlaceHelper(grade,placement,db){
    var year = 1950;
    var sectCount = 1;
    for(let section of placement.sections){
	insertSection(section,sectCount,grade,db)
	    .then(sectC => {
		    insertStudents(section,sectC,grade,db) //also inserts the 'takes' table
		    insertTeaches(section,sectC,grade,db)
		    .then(res2 => {
			    resolve()
			})
		})
	    sectCount++
	    }
}

function insertStudent(section,student,grade,db){
    var year = '1950';
    return new Promise((resolve, reject) => {
            db.query("INSERT into ydsd values ('" 
		     + student.id + "','" 
		     + year + "','"
		     + student.comments + "','"
		     + student.homeroomTeacher + "','"
		     + student.asp + "','"
		     + student.nextMeetingSch + "','"
		     + student.advancedMath + "','"
		     + student.speechLanguage + "','" 
		     + student.studentDevelopment + "','"
		     + student.mathEnrichment + "','"
		     + student.IUreadingServices + "','"
		     + student.IUmathServices + "','"
		     + student.earobics + "','"
		     + student.workEthic + "','"
		     + student.youngestChild + "','" 
		     + student.onlyChild + "','" 
		     + student.newStudent + "','"
		     + student.medicalConcern + "','"
		     + student.hmp + "','"
		     + student.dra + "','"
		     + student.RAZ + "','"
		     + student.WTW + "','"
		     + student.iStation + "','" 
		     + student.mathBench + "','"
		     + student.Dibels + "','"
		     + student.cogAT + "','" 
		     + student.IOWA + "','" 
		     + student.elaTotal + "','"
		     + student.ExtendedELA + "','"
		     + student.mathTotal + "','"
		     + student.facultyStudent + "','"
		     + student.potentialDelay + "','" //potential delay
		     + student.behaviorObservation + "','" //behaviorObservation in db
		     + student.selfHelp + "','" //self help
		     + student.socialEmotional + "','" //social emotional
		     + student.dial4 + "','"
		     + student.gradeEntering + "','"
		     + student.ge + "'" 
		     + ");"
                     , function (err, entities){
                         if(err){
                             reject(err)
                         } else {
                             resolve()
                         }
                     })
        })
}

function insertTakes(section,sectID,student,grade,db){
    var year = 1950;
    return new Promise((resolve, reject) => {
	    var q = "INSERT into takes values ('" + student.id + "','" + year + "','" + sectID + "');";
            db.query(q
                     , function (err, entities){
                         if(err){
                             reject(err)
                         } else {
                             resolve()
                         }
                     })
        })
}

function insertStudents(section,sectID,grade,db){
    var year = 1950;
    for(let student of section.students){
	insertStudent(section,student,grade,db)
	    .then(res => {
		    insertTakes(section,sectID,student,grade,db)
		    .then(res2 => {
			    resolve()
			})
		})
	    }
}
    
function insertTeaches(section,sectID,grade,db){
    var year = 1950;
    return new Promise((resolve, reject) => {
	    var q = "INSERT into teaches values ('" + section.teacher.emailID + "','" + sectID + "','" + year + "');";
            db.query(q
                     , function (err, entities){
                         if(err){
                             reject(err)
                         } else {
                             resolve()
                         }
                     })
        })
}	    

function insertSection(section,id,grade,db){
    var year = 1950;
    return new Promise((resolve, reject) => {
	    var q = "INSERT into section values ('" + id + "','" + year + "','" + grade + "');"
	    db.query(q
		     , function (err, entities){
			 if(err){
			     reject(err)
			 } else {
			     resolve(id)
			 }
		     })
	})
}

export function deletePlacement(grade,db){
    var year = 1950;
    return new Promise((resolve, reject) => {
    deleteSection(grade,year,db)
	.then(res => {
		deleteStudents(grade,year,db)
		.then(res2 => {
			deleteTeaches(grade,year,db)
			.then(res3 => {
				deleteTakes(grade,year,db)
				.then(res4 => {
					resolve()
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
	.catch(err => {
		reject(err)
	    })
	})
	     }


function deleteTakes(grade,year,db){
    return new Promise((resolve, reject) => {
	    var q = 'DELETE from takes where year ="' + year + '"'
            db.query(q
                     , function (err){
                         if(err){
                             reject(err)
                         } else {
                             resolve()
                         }
                     })
        })
	}

function deleteTeaches(grade,year,db){
    return new Promise((resolve, reject) => {
	    var q = 'DELETE from teaches where year ="' + year + '"';
            db.query(q
                     , function (err){
                         if(err){
                             reject(err)
                         } else {
			     resolve()
                         }
                     })
        })
	}

function deleteSection(grade,year,db){
    return new Promise((resolve, reject) => {
	    var q = 'DELETE from section where year ="' + year + '"'
            db.query(q
                     , function (err){
                         if(err){
                             reject(err)
                         } else {
			     resolve()
                         }
                     })
        })
}

function deleteStudents(grade,year,db){
    return new Promise((resolve, reject) => {
	    var q = 'DELETE from ydsd where year ="' + year + '"';
            db.query(q
                     , function (err){
                         if(err){
                             reject(err)
                         } else {
			     resolve()
                         }
                     })
        })
	}
