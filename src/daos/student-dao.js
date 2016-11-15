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

export function getStudent(studentID) {
  return new Promise((resolve, reject) => {
    const filepath = getPath(studentID)
    fs.readFile(filepath, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(data))
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