//For this function we need to first update ydsd table so that gradeEntering is incremented and year is incremented, and then we can increment the year. Consider changing method name for this reason.
export function incrementDashYear(db) {
  return new Promise((resolve, reject) => {
	  getDashYear(db)
	  .then(year => {
		  db.query('Insert into ydsd( id, year,comments,homeroomTeacher,asp,nextMeetingSch,advancedMath,speechLanguage,studentDevelopment, mathEnrichment, IUreadingServices, IUmathServices,earobics, workEthic, youngestChild, onlyChild, newStudent, medicalConcern, hmp, dra, RAZ, WTW,iStation, mathBench, Dibels, cogAT, IOWA, elaTotal,ExtendedELA, mathTotal, facultyStudent, potentialDelay, behaviorObservation, selfHelp, socialEmotional, dial4, gradeEntering, ge) SELECT id, year + 1, comments,homeroomTeacher,asp,nextMeetingSch,advancedMath, speechLanguage, studentDevelopment, mathEnrichment, IUreadingServices, IUmathServices, earobics, workEthic, youngestChild, onlyChild, newStudent, medicalConcern, hmp, dra, RAZ, WTW, iStation, mathBench, Dibels, cogAT, IOWA, elaTotal,ExtendedELA, mathTotal, facultyStudent, potentialDelay, behaviorObservation, selfHelp, socialEmotional, dial4, gradeEntering + 1, ge from ydsd where year = ?;', year,
			   function(err){
			       if(err){
				   console.log('part 1 of incrementDashYear failure')
				   reject(err)
			       }else{
				   console.log('success @ part 1 of incremenetDashYear')
				   db.query('UPDATE currentDashboardYear set currentYear = currentYear + 1;'
					    , function (err) {
						if (err) {
						    reject(err)
						} else {
						    resolve()
						}
					    })
			       }
			   }
			   )
	      })
	  
	  .catch(err => {
		  reject(err)
	      })
	      })
      }
      
export function decrementDashYear(db) {
  return new Promise((resolve, reject) => {
    db.query('UPDATE currentDashboardYear set currentYear = currentYear - 1;'
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
    db.query('select * from currentDashboardYear;'
      , function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities[0].currentYear)
        }
      })
  })
}
