import * as currentYearDao from './current-year-dao.js'

export function getStudents(db) {
  return new Promise((resolve, reject) => {
    db.query('select student.id, student.firstName, student.lastName, staff.firstName as teacherFName, staff.lastName as teacherLName, ' +
      'sectionID, grade from takes natural join section natural join teaches natural join staff, student natural join ydsd where takes.ID = student.id;',
      function (err, entities) {
        if (err) {
          reject(err)
        }
        for (let i in entities) {
          entities[i].teacher = {
            firstName: entities[i].teacherFName,
            lastName: entities[i].teacherLName
          }
          delete entities[i].teacherFName
          delete entities[i].teacherLName
        }
        resolve(entities)
      }
    )
  })
}

function getStudentsInfo(db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM `student` NATURAL JOIN `ydsd`',
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities)
        }
      })
  })
}

function getStudentSectionAndTeacher(studentID, db) {
  return new Promise((resolve, reject) => {
    db.query('select * from takes natural join section natural join teaches natural join staff where ID = ?;', studentID,
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities)
        }
      })
  })
}

function getStudentInfo(studentID, db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM `student` NATURAL JOIN `ydsd` WHERE `id` = ?', studentID,
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities)
        }
      })
  })
}

export function getStudent(studentID, db) {
  return new Promise((resolve, reject) => {
    getStudentInfo(studentID, db)
      .then(student => {
        if (student.length === 0) {
            reject(new Error('Student Not Found'))
        }
        getStudentSectionAndTeacher(studentID, db)
          .then(result => {
            if (result.length === 0) {
                student[0].teacher = {
                    firstName: null,
                    lastName: null
                }
                student[0].sectionID = null
                student[0].grade = null
            } else {
                student[0].teacher = {
                  firstName: result[0].firstName,
                  lastName: result[0].lastName
                }
                student[0].sectionID = result[0].sectionID
                student[0].grade = result[0].grade
                }
            resolve(student[0])
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

export function updateStudent(student, db) {
  return new Promise((resolve, reject) => {
    var studentUpdate = {
      id: student.id,
      lastName: student.lastName,
      firstName: student.firstName,
      sex: student.sex,
      dob: student.dob
    }
    delete student['lastName']
    delete student['firstName']
    delete student['sex']
    delete student['dob']

    //remove fields added in by student-dao
    delete student['teacher']
    delete student['sectionID']
    delete student['grade']

    console.log(student)
    db.query('UPDATE `student` SET ? WHERE `id` = ?; UPDATE `ydsd` SET ? WHERE `id` = ?',
      [studentUpdate, student.id, student, student.id], function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

export function deleteStudent(studentID, db) {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM `student` WHERE `id` = ?; DELETE FROM `ydsd` WHERE `id` = ?; ' +
      'DELETE FROM `takes` WHERE `id` = ?',
      [studentID, studentID, studentID], function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function createStudent(student, db) {
    return new Promise((resolve, reject) => {
        let studentData = {
            id: student.id,
            lastName: student.lastName,
            firstName: student.firstName,
            sex: student.sex,
            dob: student.dob
        }
        let takesData = {
            ID: student.id,
            sectionID: student.sectionID
        }
        delete student.lastName
        delete student.firstName
        delete student.sex
        delete student.dob
        delete student.sectionID
        currentYearDao.getDashYear(db)
            .then(year => {
                student.year = year
                takesData.year = year
                db.query('INSERT INTO `student` SET ?;' +
                    'INSERT INTO `ydsd` SET ?; ' +
                    'INSERT INTO `takes` SET ?;',
                    [studentData, student, takesData], function (err) {
                      if (err) {
                        reject(err)
                      } else {
                        resolve()
                      }
                    })
            })
    })
}
