import studentRaw from '../mock-data/raw/student-raw'

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

export function updateStudent(student, db) {
  return new Promise((resolve, reject) => {
    var student_update = {
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
    [student_update, student.id, student, student.id], function (err) {
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
    db.query('DELETE FROM `student` WHERE `id` = ?', studentID, function (err) {
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
      student.id, student.year, student.comments, student.homeroomTeacher, student.aspDate, student.nextMeetingSch,
      student.advancedMath, student.speechLanguage, student.studentDevelopment, student.mathEnrichment, student.IUreadingServices,
      student.IUmathServices, student.earobics, student.classroomBehavior, student.workHabits, student.youngestChild, student.onlyChild,
      student.newStudent, student.medicalConcern, student.HMP, student.DRA, student.RAZ, student.WTW, student.iStation, student.mathBenchmark,
      student.Dibels, student.CogAT, student.IOWA, student.ELA, student.ExtendedELA, student.mathTotal, student.facStudent], function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
