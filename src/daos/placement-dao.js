import * as gradeDao from './grade-dao.js'
import * as currentYearDao from './current-year-dao.js'
import * as staffDao from './staff-dao.js'

<<<<<<< HEAD
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

export function savePlacement(grade, placement, db) {
=======
function getPath(grade) {
  let name
  switch (grade) {
    case 0:
      name = 'kindergarten'
      break
    case 1:
      name = 'first'
      break
    case 2:
      name = 'second'
      break
    case 3:
      name = 'third'
      break
    case 4:
      name = 'fourth'
      break
    case 5:
      name = 'fifth'
      break
    case 6:
      name = 'sixth'
      break
    case 7:
      name = 'seventh'
      break
    case 8:
      name = 'eighth'
      break
  }
  return path.join(__dirname, `../mock-data/placements/${name}-placement.json`)
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

// TODO - replace with calls to database
export function getPlacement(grade) {
>>>>>>> master
  return new Promise((resolve, reject) => {
    currentYearDao.getDashYear(db)
      .then(results => {
        var year = results + 1
        var promise = deletePlacement(grade, db, year)
        promise.then(() => {
          savePlaceHelper(grade, placement, db, year)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

<<<<<<< HEAD
export function savePlaceHelper(grade, placement, db, year) {
  return new Promise((resolve, reject) => {
    var sectCount = 1
    for (let section of placement.sections) {
      //console.log(section)
      insertSection(section, sectCount, grade, db, year)
        .then(sectC => {
          insertStudents(section, sectC, grade, db, year) //also inserts the 'takes' table
            .catch(err => {
              reject(err)
            })
          insertTeaches(section, sectC, grade, db, year)
            .catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
      sectCount++
    }
    resolve()
  })
}

function insertStudent(section, student, grade, db, year) {
  return new Promise((resolve, reject) => {
    db.query('INSERT into ydsd values (\''
      + student.id + '\',\''
      + year + '\',\''
      + student.comments + '\',\''
      + student.homeroomTeacher + '\',\''
      + student.asp + '\',\''
      + student.nextMeetingSch + '\',\''
      + student.advancedMath + '\',\''
      + student.speechLanguage + '\',\''
      + student.studentDevelopment + '\',\''
      + student.mathEnrichment + '\',\''
      + student.IUreadingServices + '\',\''
      + student.IUmathServices + '\',\''
      + student.earobics + '\',\''
      + student.workEthic + '\',\''
      + student.youngestChild + '\',\''
      + student.onlyChild + '\',\''
      + student.newStudent + '\',\''
      + student.medicalConcern + '\',\''
      + student.hmp + '\',\''
      + student.dra + '\',\''
      + student.RAZ + '\',\''
      + student.WTW + '\',\''
      + student.iStation + '\',\''
      + student.mathBench + '\',\''
      + student.Dibels + '\',\''
      + student.cogAT + '\',\''
      + student.IOWA + '\',\''
      + student.elaTotal + '\',\''
      + student.ExtendedELA + '\',\''
      + student.mathTotal + '\',\''
      + student.facultyStudent + '\',\''
      + student.potentialDelay + '\',\'' //potential delay
      + student.behaviorObservation + '\',\'' //behaviorObservation in db
      + student.selfHelp + '\',\'' //self help
      + student.socialEmotional + '\',\'' //social emotional
      + student.dial4 + '\',\''
      + (parseInt(student.gradeEntering) + 1) + '\',\''
      + student.ge + '\''
      + ');'
      , function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function insertTakes(section, sectID, student, grade, db, year) {
  return new Promise((resolve, reject) => {
    var q = 'INSERT into takes values (\'' + student.id + '\',\'' + year + '\',\'' + sectID + '\');'
    db.query(q
      , function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function insertStudents(section, sectID, grade, db, year) {
  return new Promise((resolve, reject) => {
    for (let student of section.students) {
      insertStudent(section, student, grade, db, year)
        .then(() => {
          insertTakes(section, sectID, student, grade, db, year)
            .catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
    }
    resolve()
  })
}

function insertTeaches(section, sectID, grade, db, year) {
  return new Promise((resolve, reject) => {
    var q = 'INSERT into teaches values (\'' + section.teacher.emailID + '\',\'' + sectID + '\',\'' + year + '\');'
    db.query(q
      , function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function insertSection(section, id, grade, db, year) {
  return new Promise((resolve, reject) => {
    var q = 'INSERT into section values (\'' + id + '\',\'' + year + '\',\'' + grade + '\');'
    db.query(q
      , function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(id)
        }
      })
=======
export function savePlacement(placement) {
  return new Promise((resolve, reject) => {
    calculateStats(placement).then(() => {
      const filepath = getPath(placement.grade)
      fs.writeFile(filepath, JSON.stringify(placement, null, 2), 'utf8', function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(placement)
        }
      })
    })

>>>>>>> master
  })
}

export function deletePlacement(grade, db, year) {
  return new Promise((resolve, reject) => {
    deleteSection(grade, year, db)
      .then(() => {
        deleteStudents(grade, year, db)
          .then(() => {
            deleteTeaches(grade, year, db)
              .then(() => {
                deleteTakes(grade, year, db)
                  .then(() => {
                    resolve()
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


function deleteTakes(grade, year, db) {
  return new Promise((resolve, reject) => {
    var q = 'DELETE from takes where year ="' + year + '"'
    db.query(q
      , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function deleteTeaches(grade, year, db) {
  return new Promise((resolve, reject) => {
    var q = 'DELETE from teaches where year ="' + year + '"'
    db.query(q
      , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function deleteSection(grade, year, db) {
  return new Promise((resolve, reject) => {
    var q = 'DELETE from section where year ="' + year + '"'
    db.query(q
      , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function deleteStudents(grade, year, db) {
  return new Promise((resolve, reject) => {
    var q = 'DELETE from ydsd where year ="' + year + '"'
    db.query(q
      , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}
