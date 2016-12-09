export function getStudents(db) {
  return new Promise((resolve, reject) => {
    db.query('select student.id, student.firstName, student.lastName, staff.firstName as teacherFirstName, staff.lastName as teacherLastName, staff.emailID as teacherEmailID, ' +
      'takes.sectionID, grade from (student natural join takes) left join (section natural join teaches natural join staff) on takes.sectionID = teaches.sectionID where takes.year = (select year from time);',
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
    db.query('select *, staff.firstName as teacherFirstName, staff.lastName as teacherLastName ' +
      'from (student natural join takes) left join (section natural join teaches natural join staff) on takes.sectionID = teaches.sectionID, ydsd where student.id = ydsd.id and takes.year = (select year from time) AND student.id  =?;', studentID,
      function (err, student) {
        if (student.length === 0) {
          reject(new Error('Student Not Found'))
        } else if (err) {
          reject(err)
        } else {
          student = student[0]
          student.teacher = {
            firstName: student.teacherFirstName,
            lastName: student.teacherLastName,
            emailID: student.emailID
          }
          delete student.teacherFirstName
          delete student.teacherLastName
          delete student.emailID
          delete student.accessLevel
          delete student.gradeTeaching
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
      id: student.id,
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
      'INSERT INTO `ydsd` SET ?, year = (SELECT year FROM time); ' +
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
    delete student['teacherFName']
    delete student['teacherLName']

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
