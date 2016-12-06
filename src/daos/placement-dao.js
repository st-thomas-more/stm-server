import * as gradeDao from './grade-dao.js'
import * as currentYearDao from './current-year-dao.js'
import * as staffDao from './staff-dao.js'

export function getPlacement(grade, db) {
  return new Promise((resolve, reject) => {
    gradeDao.getGradeForPlacement(grade, db)
      .then(placement => {
        calculateStats(placement).then(() => {
          resolve(placement)
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

function calculateStats(placement) {
  return new Promise((resolve, reject) => {
    switch (placement.grade) {
      case 0:
        {
          const reducer = (stats, student) => {
            stats.behavior += student.behaviorObservation
            stats.dial4 += student.dial4
            stats.age += student.age
            if (student.sex === 'F') {
              stats.females++
            } else {
              stats.males++
            }
            if (student.potentialDelay) {
              stats.potentialDelays++
            }
            stats.count++
            return stats
          }

          for (let section of placement.sections) {
            let stats = section.students.reduce(reducer, {
              behavior: 0,
              dial4: 0,
              age: 0,
              females: 0,
              males: 0,
              potentialDelays: 0,
              count: 0
            })
            stats['avgBehavior'] = stats.behavior / stats.count
            stats['avgDial4'] = stats.dial4 / stats.count
            stats['avgAge'] = stats.age / stats.count
            stats['genderRatio'] = stats.males / stats.females
            section.stats = stats
          }
        }
        break
      case 1:
      case 2:
      case 3:
        {
          const reducer = (stats, student) => {
            stats.behavior += student.behaviorScore
            stats.score += student.weightedScore
            if (student.sex === 'F') {
              stats.females++
            } else {
              stats.males++
            }
            if (student.asp) {
              stats.asps++
            }
            if (student.hmp) {
              stats.hmps++
            }
            if (student.advancedMath) {
              stats.advancedMaths++
            }
            if (student.medicalConcern) {
              stats.medicalConcerns++
            }
            if (student.facultyStudent) {
              stats.facultyStudents++
            }
            if (student.newStudent) {
              stats.newStudents++
            }
            stats.count++
            return stats
          }

          for (let section of placement.sections) {
            let stats = section.students.reduce(reducer, {
              asps: 0,
              hmps: 0,
              advancedMaths: 0,
              behavior: 0,
              score: 0,
              females: 0,
              males: 0,
              medicalConcerns: 0,
              facultyStudents: 0,
              newStudents: 0,
              count: 0
            })
            stats['avgBehavior'] = stats.behavior / stats.count
            stats['avgTestScore'] = stats.score / stats.count
            stats['genderRatio'] = stats.males / stats.females
            section.stats = stats
          }
        }
        break
      case 4:
      case 5:
      case 6:
        {
          const reducer = (stats, student) => {
            stats.behavior += student.behaviorScore
            stats.score += student.weightedScore
            if (student.sex === 'F') {
              stats.females++
            } else {
              stats.males++
            }
            if (student.asp) {
              stats.asps++
            }
            if (student.hmp) {
              stats.hmps++
            }
            if (student.advancedMath) {
              stats.advancedMaths++
            }
            if (student.medicalConcern) {
              stats.medicalConcerns++
            }
            if (student.facultyStudent) {
              stats.facultyStudents++
            }
            if (student.newStudent) {
              stats.newStudents++
            }
            stats.count++
            return stats
          }

          for (let section of placement.sections) {
            let stats = section.students.reduce(reducer, {
              asps: 0,
              hmps: 0,
              advancedMaths: 0,
              behavior: 0,
              score: 0,
              females: 0,
              males: 0,
              medicalConcerns: 0,
              facultyStudents: 0,
              newStudents: 0,
              count: 0
            })
            stats['avgBehavior'] = stats.behavior / stats.count
            stats['avgTestScore'] = stats.score / stats.count
            stats['genderRatio'] = stats.males / stats.females
            section.stats = stats
          }
        }
        break
      case 7:
        {
          const reducer = (stats, student) => {
            stats.behavior += student.behaviorScore
            if (student.sex === 'F') {
              stats.females++
            } else {
              stats.males++
            }
            stats.count++
            return stats
          }

          for (let section of placement.sections) {
            let stats = section.students.reduce(reducer, {
              behavior: 0,
              females: 0,
              males: 0,
              count: 0
            })
            stats['avgBehavior'] = stats.behavior / stats.count
            stats['genderRatio'] = stats.males / stats.females
            section.stats = stats
          }
        }
        break
      case 8:
        {
          const reducer = (stats, student) => {
            if (student.sex === 'F') {
              stats.females++
            } else {
              stats.males++
            }
            stats.count++
            return stats
          }

          for (let section of placement.sections) {
            let stats = section.students.reduce(reducer, {
              females: 0,
              males: 0,
              count: 0
            })
            stats['genderRatio'] = stats.males / stats.females
            section.stats = stats
          }
        }
        break
      default:
        reject(new Error(`Invalid placement grade: ${placement.grade}`))
    }
    resolve()
  })
}

function insertSection(year, gradeSection, grade, db) {
  let sectionIn = [gradeSection, year, grade, gradeSection, year, grade]
  return new Promise((resolve, reject) => {
    let sectionIn = [gradeSection, year, grade, gradeSection, year, grade]
    db.query('INSERT INTO `section` (sectionID, year,grade) VALUES(?,?,?) ON DUPLICATE KEY UPDATE `sectionID` =?, `year`=?, `grade`=?;',
      sectionIn,
      function (err) {
        if (err) {
          reject(err)
        } else {
          console.log('success2')
          resolve()
        }
      })
  })
}

function insertTeaches(year, gradeSection, emailID, db) {
  return new Promise((resolve, reject) => {
    let teachIn = [emailID, gradeSection, year, emailID, gradeSection, year]
    db.query('INSERT INTO `teaches` (emailID,sectionID, year) VALUES(?,?,?) ON DUPLICATE KEY UPDATE `emailID`=?,`sectionID` =?, `year`=?;',
      teachIn,
      function (err) {
        if (err) {
          reject(err)
        } else {
          console.log('success1')
          resolve()
        }
      })
  })
}

function insertTakes(year, gradeSection, id, db) {
  console.log('in insertTakes')
  return new Promise((resolve, reject) => {
    let takesIn = [id, year, gradeSection, id, year, gradeSection]
    db.query('INSERT INTO `takes` (ID, year,sectionID) VALUES(?,?,?) ON DUPLICATE KEY UPDATE `ID`=?, `year`=?, `sectionID`=?;',
      takesIn,
      function (err) {
        if (err) {
          console.log('not working')
          reject(err)
        } else {
          console.log('success')
          resolve()
        }
      })
  })
}

//for(let student of placement.studnet){


export function savePlacement(placement, db) {

  let year = 0
  let sectionNum = 0
  let gradeSection = ''
  let sectionPromises = []
  let teachesPromises = []
  let studentPromises = []
  return new Promise((resolve, reject) => {
    calculateStats(placement)
      .then(() => {
        currentYearDao.getDashYear(db)
          .then(result => {
            year = result + 1
            console.log(year)
            for (let section of placement.sections) {
              gradeSection = `${placement.grade}${sectionNum.toString()}`
              sectionNum++
              sectionPromises.push(insertSection(year, gradeSection, placement.grade, db))
              sectionPromises.push(insertTeaches(year, gradeSection, section.teacher.emailID, db))
              console.log(section.student)
              for (let student of section.students) {
                console.log('sstudnet')
                studentPromises.push(insertTakes(year, gradeSection, student.id, db))
              }
            }
            Promise.all(sectionPromises).then(() => {
              Promise.all(teachesPromises).then(() => {
                Promise.all(studentPromises).then(() => {
                  resolve(placement)
                })
              })
            })
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}


