export function getGrades(db) {
  var result = []
  return new Promise((resolve, reject) => {
    getGrade('K', db)
      .then(gradeK => {
        result = result.concat(gradeK)
        getGrade('1', db)
          .then(grade1 => {
            result = result.concat(grade1)
            getGrade('2', db)
              .then(grade2 => {
                result = result.concat(grade2)
                getGrade('3', db)
                  .then(grade3 => {
                    result = result.concat(grade3)
                    getGrade('4', db)
                      .then(grade4 => {
                        result = result.concat(grade4)
                        getGrade('5', db)
                          .then(grade5 => {
                            result = result.concat(grade5)
                            getGrade('6', db)
                              .then(grade6 => {
                                result = result.concat(grade6)
                                getGrade('7', db)
                                  .then(grade7 => {
                                    result = result.concat(grade7)
                                    getGrade('8', db)
                                      .then(grade8 => {
                                        result = result.concat(grade8)
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

function getStudentsInGrade(grade, db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT `id`, `sex`, `firstName`, `lastName`, `behavior`, `facultyStudent`, `newStudent`, `medicalConcern`, ' +
      '`hmp`, `workEthic`, `mathBench`, `dra`, `asp`, `elaTotal`, `mathTotal`, `cogAT`' +
      'FROM `student` NATURAL JOIN `ydsd` NATURAL JOIN `takes` NATURAL JOIN `section` WHERE `grade` = ?', grade,
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities)
        }
      })
  })
}

function getTeachersInGrade(grade, db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT `firstName`, `lastName` FROM `staff` NATURAL JOIN `teaches` NATURAL JOIN `section` WHERE `grade` = ?', grade,
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities)
        }
      })
  })
}

function getSections(grade, db) {
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

function getStudentsInSection(sectionId, db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM `student` NATURAL JOIN `ydsd` NATURAL JOIN `takes` WHERE `sectionId` = ?', sectionId, function (err, entities) {
      if (err) {
        reject(err)
      } else {
        resolve(entities)
      }
    })
  })
}

export function getGrade(grade, db) {
  return new Promise((resolve, reject) => {
    db.query('select *, student.firstName as studentFName, student.lastName as studentLName ' +
      'from student natural join ydsd natural join takes natural join section natural join teaches, staff where grade = ? and staff.emailID = teaches.emailID',
      grade,
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          let result = {
            grade: grade,
            sections: []
          }
          for (let i in entities) {
            let sectionIndex = getSectionIndex(entities[i].sectionID, result.sections)
            if (sectionIndex == -1) {
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
            if (grade === 'k') {
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
    getStudentsInGrade(grade - 1, db)
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
