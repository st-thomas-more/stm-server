import studentRaw from '../mock-data/raw/student-raw'

export function getStudents(db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT `id`, `sex`, `firstName`, `lastName`, `behavior`, `facultyStudent`, `newStudent`, `medicalConcern`, ' +
             '`hmp`, `workEthic`, `mathBench`, `dra`, `asp`, `elaTotal`, `mathTotal`, `cogAT` ' +
             'FROM `student` NATURAL JOIN `ydsd`',
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
    db.query('SELECT `id`, `sex`, `firstName`, `lastName`, `behavior`, `facultyStudent`, `newStudent`, `medicalConcern`, ' +
             '`hmp`, `workEthic`, `mathBench`, `dra`, `asp`, `elaTotal`, `mathTotal`, `cogAT` ' +
             'FROM `student` NATURAL JOIN `ydsd` WHERE `id` = ?', studentID,
      function (err, entities){
        if (err) {
          reject(err)
        } else {
          resolve(entities)
        }
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
      dial4: student.dial4
    }
    delete student['lastName']
    delete student['firstName']
    delete student['sex']
    delete student['dob']
    delete student['dial4']
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

export function createStudent(student, db){
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
