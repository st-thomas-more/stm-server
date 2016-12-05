import * as gradeDao from './grade-dao.js'
import * as currentYearDao from './current-year-dao.js'
import * as staffDao from './staff-dao.js'

export function getPlacement(grade, db) {
  return new Promise((resolve, reject) => {
    gradeDao.getGradeForPlacement(grade, db)
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        reject(err)
      })
  })
}

function calculateStats(placement) {
  return new Promise(resolve => {
    placement.stats = {}
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
    }
    resolve()
  })
}

export function savePlacement(placement, db) {
    let year = 0
    return new Promise((resolve, reject) => {
        calculateStats(placement)
            .then(() => {
                return currentYearDao.getDashYear(db)
            })
            .then(result => {
                year = result
                for (let section of placement.sections) {
                    
                }
            })
    })
}
