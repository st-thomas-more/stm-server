import gradeRaw from '../mock-data/raw/grade-raw'
import kindergartenRaw from '../mock-data/raw/kindergarten-raw'
import thirdRaw from '../mock-data/raw/third-raw'
import sixthRaw from '../mock-data/raw/sixth-raw'
import seventhRaw from '../mock-data/raw/seventh-raw'
import eigthRaw from '../mock-data/raw/eigth-raw'

// TODO - replace with calls to database
export function getGrades() {
	return new Promise((resolve, reject) => {
		resolve(gradeRaw)
	})
}

export function getGrade(grade) {
	return new Promise((resolve, reject) => {
		if (typeof grade === 'string' && !isNaN(grade))
			grade = parseInt(grade, 10)
		switch (grade) {
			case 0:
				resolve(kindergartenRaw)
				break
			case 3:
				resolve(thirdRaw)
				break
			case 6:
				resolve(sixthRaw)
				break
			case 7:
				resolve(seventhRaw)
				break
			case 8:
				resolve(eigthRaw)
				break
			default:
				reject(new Error(`Unable to get grade: ${grade}`))
		}
	})
}