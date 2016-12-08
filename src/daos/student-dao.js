export function getStudents(db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT student.id, student.firstName, student.lastName, student.sex, section.grade, section.sectionID, staff.firstName as teacherFirstName, staff.lastName as teacherLastName, staff.emailID as teacherEmailID'
      + ' FROM student JOIN takes on student.id = takes.id JOIN teaches on takes.sectionID = teaches.sectionID JOIN staff on teaches.emailID = staff.emailID JOIN section on takes.sectionID = section.sectionID',
      function (err, students) {
        if (err) {
          reject(err)
        }
        for (let student of students) {
          student.teacher = {
            firstName: student.teacherFirstName,
            lastName: student.teacherLastName,
            emailID: student.teacherEmailID
          }
          delete student.teacherFirstName
          delete student.teacherLastName
          delete student.teacherEmailID
        }
        resolve(students)
      }
    )
  })
}

export function getStudent(db, studentID) {
  return new Promise((resolve, reject) => {
    db.query('SELECT student.*, ydsd.*, takes.sectionID, section.grade, staff.firstName as teacherFirstName, staff.lastName as teacherLastName, staff.emailID as teacherEmailID' +
      ' FROM student JOIN ydsd on student.id = ydsd.id JOIN takes on student.id = takes.id JOIN section on takes.sectionID = section.sectionID JOIN teaches on teaches.sectionID = takes.sectionID JOIN staff on teaches.emailID = staff.emailID' +
      ' WHERE student.id = ?', studentID,
      function (err, student) {
        if (err) {
          reject(err)
        } else {
          student = student[0]
          student.teacher = {
            firstName: student.teacherFirstName,
            lastName: student.teacherLastName,
            emailID: student.teacherEmailID
          }
          delete student.teacherFirstName
          delete student.teacherLastName
          delete student.teacherEmailID
          resolve(student)
        }
      })
  })
}

export function createStudent(db, student) {
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
    delete student.teacher
    delete student.grade

    db.query('INSERT INTO `student` SET ?;' +
      'INSERT INTO `ydsd` SET ?; ' +
      'INSERT INTO `takes` SET ?, year = (SELECT year FROM time);',
      [studentData, student, takesData], function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

export function updateStudent(db, student) {
  return new Promise((resolve, reject) => {
    const studentUpdate = {
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

    db.query('UPDATE student SET ? WHERE id = ?; UPDATE ydsd SET ? WHERE id = ?',
      [studentUpdate, student.id, student, student.id], function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

export function deleteStudent(db, studentID) {
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
