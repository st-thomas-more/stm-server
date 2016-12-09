import * as gradeDao from './grade-dao.js'
import * as currentYearDao from './current-year-dao.js'

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

export function savePlacement(placement, db) {
  return new Promise((resolve, reject) => {
    calculateStats(placement)
      .then(() => {
        currentYearDao.getDashYear(db)
          .then(year => {
            let sections = []
            for (let i = 0; i < placement.sections.length; i++) {
              sections.push([placement.grade, `${placement.grade}${i}`, year+1])
            }

            db.query('REPLACE INTO section (grade, sectionID, year) VALUES ?;', [sections], function (err) {
              if (err) {
                reject(err)
              } else {
                let teaches = []
                for (let i = 0; i < placement.sections.length; i++) {
                  teaches.push([placement.sections[i].teacher.emailID, `${placement.grade}${i}`, year+1])
                }
                db.query('REPLACE teaches (emailID, sectionID, year) VALUES ?;', [teaches], function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    let takes = []
                    for (let i = 0; i < placement.sections.length; i++) {
                      for (let student of placement.sections[i].students) {
                        takes.push([student.id, `${placement.grade}${i}`, year+1])
                      }
                    }
                    db.query('REPLACE takes (id, sectionID, year) VALUES ?;', [takes], function (err) {
                      if (err) {
                        reject(err)
                      } else {
                        resolve(placement)
                      }
                    })
                  }
                })
              }
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
