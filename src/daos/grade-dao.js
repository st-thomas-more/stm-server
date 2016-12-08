import * as currentYearDao from './current-year-dao.js'

export function getGrades(db) {
  let result = []
  return new Promise((resolve, reject) => {
    let curr = getGrade(0, db)
    for (let i = 1; i <= 8; i++) {
      curr = curr
        .then(grade => {
          result = result.concat(grade)
          return getGrade(i, db)
        })
        .catch(err => {
          reject(err)
        })
    }
    curr.then(grade => {
      result = result.concat(grade)
      resolve(result)
    })
      .catch(err => {
        reject(err)
      })
  })
}

export function getStudentsForPlacement(grade, db) {
  return new Promise((resolve, reject) => {
    currentYearDao.getDashYear(db)
      .then(y => {
        var year = y + 1
        db.query('SELECT `*` FROM `student` NATURAL JOIN `ydsd` NATURAL JOIN takes NATURAL JOIN section WHERE `grade` = ? and year = ?;', [grade, year],
          function (err, entities) {
            if (err) {
              reject(err)
            } else {
              resolve(entities)
            }
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function getStudentsInGrade(grade, db) {
  return new Promise((resolve, reject) => {
    currentYearDao.getDashYear(db)
      .then(year => {
        db.query('SELECT `*` FROM `student` NATURAL JOIN `ydsd` NATURAL JOIN `takes` NATURAL JOIN `section` WHERE `grade` = ? and year = ?', [grade, year],
          function (err, entities) {
            if (err) {
              reject(err)
            } else {
              resolve(entities)
            }
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}


export function getStudentsRisingGrade(grade, db) {
  return new Promise((resolve, reject) => {
        db.query('select * from student natural join ydsd where gradeEntering = ? and year = (select year from tiime);',
          grade, function (err, entities) {
            if (err) {
              reject(err)
            } else {
              resolve(entities)
            }
          })
  })
}

export function getTeachersInGrade(grade, db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT `firstName`, `lastName`,`emailID` FROM `staff` where gradeTeaching = ?', grade,
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities)
        }
      })
  })
}

export function getSectionsForPlacement(grade, db) {
  return new Promise((resolve, reject) => {
    currentYearDao.getDashYear(db)
      .then(y => {
        var year = y + 1
        db.query('SELECT * FROM `section` WHERE `grade` = ? AND `year` = ?', [grade, year], function (err, entities) {
          if (err) {
            reject(err)
          } else {
            resolve(entities)
          }
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function getSections(grade, db) {
  return new Promise((resolve, reject) => {
        db.query('SELECT * FROM `section` WHERE `grade` = ?', grade, function (err, entities) {
          if (err) {
            reject(err)
          } else {
            resolve(entities)
          }
        })
  })
}

export function getGradeForPlacement(grade, db) {
  return new Promise((resolve, reject) => {
        db.query('select *, student.firstName as studentFName, student.lastName as studentLName from student natural join ydsd natural join takes natural join section natural join teaches, staff where grade = ? and teaches.emailID = staff.emailID and year = (select year + 1 from tiime);',
          grade,
          function (err, entities) {
            grade = parseInt(grade, 10)
            if (err) {
              reject(err)
            } else if ([0, 1, 2, 3, 4, 5, 6, 7, 8].indexOf(grade) === -1) {
              reject(new Error(`Grade ${grade} not found`))
            } else {
              let result = {
                grade: grade,
                sections: []
              }
              for (let i in entities) {
                let sectionIndex = getSectionIndex(entities[i].sectionID, result.sections)
                if (sectionIndex === -1) {
                  result.sections.push({
                    sectionID: entities[i].sectionID,
                    students: []
                  })
                  sectionIndex = result.sections.length - 1
                }
                result.sections[sectionIndex].teacher = {
                  emailID: entities[i].emailID,
                  lastName: entities[i].lastName,
                  firstName: entities[i].firstName
                }
                let students = result.sections[sectionIndex].students
                if (grade === 0) {
                  students.push(convertToKindJSON(entities[i]))
                } else {
                  students.push(convertToStudentJSON(entities[i]))
                }
              }
              resolve(result)
            }
          })
  })
}

export function getGrade(grade, db) {
  return new Promise((resolve, reject) => {
    currentYearDao.getDashYear(db)
      .then(year => {
        db.query('select *, student.firstName as studentFName, student.lastName as studentLName ' +
          'from student natural join ydsd natural join takes natural join section natural join teaches, staff where grade = ? and staff.emailID = teaches.emailID and year = ?',
          [grade, year],
          function (err, entities) {
            grade = parseInt(grade, 10)
            if (err) {
              reject(err)
            } else if ([0, 1, 2, 3, 4, 5, 6, 7, 8].indexOf(grade) === -1) {
              reject(new Error(`Grade ${grade} not found`))
            } else {
              let result = {
                grade: grade,
                sections: []
              }
              for (let i in entities) {
                let sectionIndex = getSectionIndex(entities[i].sectionID, result.sections)
                if (sectionIndex === -1) {
                  result.sections.push({
                    sectionID: entities[i].sectionID,
                    students: []
                  })
                  sectionIndex = result.sections.length - 1
                }
                result.sections[sectionIndex].teacher = {
                  emailID: entities[i].emailID,
                  lastName: entities[i].lastName,
                  firstName: entities[i].firstName
                }
                let students = result.sections[sectionIndex].students
                if (grade === 0) {
                  students.push(convertToKindJSON(entities[i]))
                } else {
                  students.push(convertToStudentJSON(entities[i]))
                }
              }
              resolve(result)
            }
          })
      })

      .catch(err => {
        reject(err)
      })
  })
}

function convertToKindJSON(entity) {
  return {
    id: entity.id,
    firstName: entity.studentFName,
    lastName: entity.studentLName,
    sex: entity.sex,
    dob: entity.dob,
    dial4: entity.dial4,
    behaviorObservation: entity.behaviorObservation,
    selfHelp: entity.selfHelp,
    socialEmotional: entity.socialEmotional,
    potentialDelay: entity.potentialDelay
  }
}

function convertToStudentJSON(entity) {
  return {
    id: entity.id,
    firstName: entity.studentFName,
    lastName: entity.studentLName,
    sex: entity.sex,
    dob: entity.dob,
    dial4: entity.dial4,
    presentTeacher: entity.firstName,
    gradeEntering: entity.gradeEntering,
    asp: entity.asp,
    advancedMath: entity.advancedMath,
    speechAndLanguage: entity.speechAndLanguage,
    iuReadingSvcs: entity.IUreadingServices,
    iuMathSvcs: entity.IUmathServices,
    earobics: entity.earobics,
    facultyStudent: entity.facultyStudent,
    youngest: entity.youngestChild,
    only: entity.onlyChild,
    newStudent: entity.newStudent,
    medicalConcern: entity.medicalConcern,
    hmp: entity.hmp,
    behavior: entity.behavior,
    workEthic: entity.workEthic,
    dra: entity.dra,
    wtwBook: entity.WTW,
    raz: entity.RAZ,
    ge: entity.ge,
    mathBench: entity.mathBench,
    dibels: entity.Dibels,
    elaTotal: entity.elaTotal,
    extendedEla: entity.extendedEla,
    mathTotal: entity.mathTotal,
    comments: entity.comments
  }
}

function getSectionIndex(sectionID, sections) {
  for (let i in sections) {
    if (sections[i].sectionID === sectionID) {
      return i
    }
  }
  return -1
}

export function getGradeForAlg(grade, db) {
  let result = { grade: grade }
  return new Promise((resolve, reject) => {
    getStudentsRisingGrade(grade, db)
      .then(students => {
        result.students = students
        getTeachersInGrade(grade, db)
          .then(teachers => {
            result.teachers = teachers
            getSections(grade, db)
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
