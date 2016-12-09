export function getSection(sectionID, db) {
  return new Promise((resolve, reject) => {
    db.query('select *, student.firstName as studentFName, student.lastName as studentLName from student natural join ydsd natural join takes natural join section, teaches natural join staff where teaches.sectionID = takes.sectionID and section.sectionID = ? and section.year = 2016;',
      sectionID, function (err, entities) {
        if (err) {
          reject(err)
        } else {
          if (entities.length == 0) {
            reject(new Error('nothing found in section'))
          }
          let result = {
            sectionID: sectionID,
            students: [],
            teacher: {
              emailID: entities[0].emailID,
              firstName: entities[0].firstName,
              lastName: entities[0].lastName
            }
          }
          for (let i in entities) {
            result.students.push(convertToStudentJSON(entities[i]))
          }
          resolve(result)
        }
      })
  })
}

function convertToStudentJSON(entity) {
  return {
    id: entity.id,
    firstName: entity.studentFName,
    lastName: entity.studentLName,
    sex: entity.sex,
    dob: entity.dob,
    dial4: entity.dial4,
    presentTeacher: entity.firstName + ' ' + entity.lastName,
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
    comments: entity.comments,
    behaviorObservation: entity.behaviorObservation,
    selfHelp: entity.selfHelp,
    socialEmotional: entity.socialEmotional,
    potentialDelay: entity.potentialDelay
  }
}
