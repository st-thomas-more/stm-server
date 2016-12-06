//For this function we need to first update ydsd table so that gradeEntering is incremented and year is incremented, and then we can increment the year. Consider changing method name for this reason.
export function incrementDashYear(db) {
  return new Promise((resolve, reject) => {
	  getDashYear(db)
	  .then(year => {
		  deleteFutureYDSD(year,db)
		  .then(() => {
			  updateYDSD(year,db)
			  .then( () => {
				  incrementYear(year,db)
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

//This function has year+1 as the year value since you need to delete the ydsd of the next year if it exists so that there are no conflicts when writing to the db in updateYDSD
export function deleteFutureYDSD(year,db){
    return new Promise((resolve, reject) => {
	    db.query('set SQL_SAFE_UPDATES = 0; delete from ydsd where year = ?; set SQL_SAFE_UPDATES = 1;',year + 1,
		     function (err) {
                         if (err) {
                             reject(err)
                         } else {
			     resolve()
                         }
                     })
	})
}

export function updateYDSD(year,db){
    return new Promise((resolve, reject) => {
	    db.query('Insert into ydsd( id, year,comments,homeroomTeacher,asp,nextMeetingSch,advancedMath,speechLanguage,studentDevelopment, mathEnrichment, IUreadingServices, IUmathServices,earobics, workEthic, youngestChild, onlyChild, newStudent, medicalConcern, hmp, dra, RAZ, WTW,iStation, mathBench, Dibels, cogAT, IOWA, elaTotal,ExtendedELA, mathTotal, facultyStudent, potentialDelay, behaviorObservation, selfHelp, socialEmotional, dial4, gradeEntering, ge) SELECT id, year + 1, comments,homeroomTeacher,asp,nextMeetingSch,advancedMath, speechLanguage, studentDevelopment, mathEnrichment, IUreadingServices, IUmathServices, earobics, workEthic, youngestChild, onlyChild, newStudent, medicalConcern, hmp, dra, RAZ, WTW, iStation, mathBench, Dibels, cogAT, IOWA, elaTotal,ExtendedELA, mathTotal, facultyStudent, potentialDelay, behaviorObservation, selfHelp, socialEmotional, dial4, gradeEntering + 1, ge from ydsd where year = ?;', year,
		     function (err) {
                         if (err) {
                             reject(err)
                         } else {
                             resolve()
                         }
                     })
	})
	}

export function incrementYear(year,db){
    return new Promise((resolve, reject) => {
	    db.query('UPDATE currentDashboardYear set currentYear = currentYear + 1 WHERE currentYear = ?;',year
		     , function (err) {
			 if (err) {
			     reject(err)
			 } else {
			     resolve()
			 }
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
