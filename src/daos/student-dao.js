// TODO - replace with calls to database
import fs from 'fs'
import path from 'path'
//not needed after the database is connected
function getPath(studentID) {
  const id = parseInt(studentID, 10)
  let name
  switch(id) {   
    case 0:
      name = 'kindergarten'
      break
    case 3:
      name = 'third'
      break
    case 6:
      name = 'sixth'
      break
    default:
      console.log('error finding path for studentid' + studentID)
  }
  return path.join(__dirname, `../mock-data/raw/${name}-students-raw.json`)
}

export function getStudent(studentID, db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT `id`, `sex`, `firstName`, `lastName`, `classroomBehavior` AS `behavior`, `facStudent` AS `facultyStudent`, `newStudent`, `medicalConcern`, `HMP` AS `hmp`, `workHabits` AS `workEthic`, `mathBenchmark` AS `mathBench`, `DRA` AS `dra`, `aspDate` AS `asp`  FROM `student` NATURAL JOIN `ydsd` WHERE `id` = ?', studentID, function (err, entities){
      if (err) {
        reject(err)
      } else {
        resolve(entities)
      }
    })
  })
}

export function updateStudent(student) {
  const filepath = getPath(student.id)
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, JSON.stringify(student, null, 2), 'utf8', function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(student)
      }
    })
  })
}

export function deleteStudent(studentID) {
  //not implemented rn since parsing a file is too much effort
  //connect this to database
  return
}

export function createStudent(student){
  //not implemented yet since its not necessary until db is connected
}
