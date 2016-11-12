import gradeRaw from '../mock-data/raw/grade-raw'
import kindergartenRaw from '../mock-data/raw/kindergarten-raw'
import thirdRaw from '../mock-data/raw/third-raw'
import sixthRaw from '../mock-data/raw/sixth-raw'

// TODO - replace with calls to database
export function get(grade) {
	return new Promise((resolve, reject) => {
		if (grade === undefined) {
			resolve(gradeRaw)
		} else {
			switch(grade) {
				case 0:
					resolve(kindergartenRaw)
					break
				case 3:
					resolve(thirdRaw)
					break
				case 6:
					resolve(sixthRaw)
					break
				default:
					reject()
			}
		}
	})
}
