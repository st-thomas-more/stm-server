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
    var studentGrade = grade - 1
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


export function savePlacement(grade, placement) {
  return new Promise((resolve, reject) => {
    const filepath = getPath(grade)
    fs.writeFile(filepath, JSON.stringify(placement, null, 2), 'utf8', function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function deletePlacement(grade) {
  return new Promise((resolve, reject) => {
    const filepath = getPath(grade)
    fs.unlink(filepath, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}