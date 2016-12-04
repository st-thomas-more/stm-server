export function incrementDashYear(db){
	return new Promise((resolve, reject) => {
            db.query("UPDATE currentDashboardYear set currentYear = currentYear + 1;"
            , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
        })
        })
}

export function decrementDashYear(db){
    return new Promise((resolve, reject) => {
            db.query("UPDATE currentDashboardYear set currentYear = currentYear - 1;"
		     , function (err) {
			 if (err) {
			     reject(err)
			 } else {
			     resolve()
			 }
		     })
        })
	}

export function getDashYear(db){
	return new Promise((resolve, reject) => {
            db.query("select * from currentDashboardYear;"
            , function (err, entities) {
	        if (err) {
	          reject(err)
	        } else {
	          resolve(entities[0].currentYear)
	        }
	        })
        })
}