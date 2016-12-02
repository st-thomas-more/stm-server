export function getStudents(db) {
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
        getStudentSectionAndTeacher(studentID, db)
          .then(result => {
            console.log(result[0].firstName)
            student[0].teacher = {
              firstName: result[0].firstName,
              lastName: result[0].lastName
            }
            student[0].sectionID = result[0].sectionID
            student[0].grade = result[0].grade
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
      dob: student.dob,
      //dial4: student.dial4
    }
    delete student['lastName']
    delete student['firstName']
    delete student['sex']
    delete student['dob']
    //delete student['dial4']
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
    db.query('DELETE FROM `student` WHERE `id` = ?; DELETE FROM `ydsd` WHERE `id` = ?', [studentID, studentID], function (err) {
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
    db.query('INSERT INTO `student` (`id`, `lastName`, `firstName`, `sex`, `dob`, `dial4`) VALUES(?, ?, ?, ?, ?,?);' +
      'INSERT INTO `ydsd` VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
      [student.id, student.lastName, student.firstName, student.sex, student.dob, student.dial4,
      student.id, student.year, student.comments, student.homeroomTeacher, student.asp, student.nextMeetingSch,
      student.advancedMath, student.speechLanguage, student.studentDevelopment, student.mathEnrichment, student.IUreadingServices,
      student.IUmathServices, student.earobics, student.behavior, student.workEthic, student.youngestChild, student.onlyChild,
      student.newStudent, student.medicalConcern, student.hmp, student.dra, student.raz, student.wtw, student.iStation, student.mathBench,
      student.Dibels, student.cogAT, student.IOWA, student.elaTotal, student.ExtendedELA, student.mathTotal, student.facultyStudent], function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}
