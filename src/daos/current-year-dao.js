//For this function we need to first update ydsd table so that gradeEntering is incremented and year is incremented, and then we can increment the year. Consider changing method name for this reason.
export function incrementDashYear(db) {
  return new Promise((resolve, reject) => {
    getDashYear(db)
      .then(year => {
            updateYDSD(year, db)
              .then(() => {
                incrementYear(year, db)
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
}


export function updateYDSD(year, db) {
  return new Promise((resolve, reject) => {
    db.query('Insert into ydsd( id, year,comments,homeroomTeacher,asp,nextMeetingSch,advancedMath,speechLanguage,studentDevelopment, mathEnrichment, IUreadingServices, IUmathServices,earobics, workEthic, youngestChild, onlyChild, newStudent, medicalConcern, hmp, dra, RAZ, WTW,iStation, mathBench, Dibels, cogAT, IOWA, elaTotal,ExtendedELA, mathTotal, facultyStudent, potentialDelay, behaviorObservation, selfHelp, socialEmotional, dial4, gradeEntering, ge)'+ 
      'SELECT id, year + 1, comments,homeroomTeacher,asp,nextMeetingSch,advancedMath, speechLanguage, studentDevelopment, mathEnrichment, IUreadingServices, IUmathServices, earobics, workEthic, youngestChild, onlyChild, newStudent, medicalConcern, hmp, dra, RAZ, WTW, iStation, mathBench, Dibels, cogAT, IOWA, elaTotal,ExtendedELA, mathTotal, facultyStudent, potentialDelay, behaviorObservation, selfHelp, socialEmotional, dial4, gradeEntering + 1, ge from ydsd where year = ?;', 
      year,
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

export function incrementYear(db) {
  return new Promise((resolve, reject) => {
    db.query('SET SQL_SAFE_UPDATES = 0; UPDATE time set year = year + 1; SET SQL_SAFE_UPDATES = 1;'
      , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}


export function decrementYear(db) {
  return new Promise((resolve, reject) => {
    db.query('SET SQL_SAFE_UPDATES = 0; UPDATE time set year = year - 1; SET SQL_SAFE_UPDATES = 1;'
      , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

export function getDashYear(db) {
  return new Promise((resolve, reject) => {
    db.query('select * from time;'
      , function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities[0].year)
        }
      })
  })
}
