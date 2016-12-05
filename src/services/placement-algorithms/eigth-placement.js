import { getGradeForAlg } from '../../daos/grade-dao'
import { savePlacement } from '../../daos/placement-dao'

export default function place(db) {
	return getGradeForAlg(8, db)
		.then(data => {
			let students = data.students
			let numSections = data.teachers.length

			let pool = {
				girls: [], boys: []
			}

			for (let student of students) {
				if (student.sex === 'F') {
					pool.girls.push(student)
				} else {
					pool.boys.push(student)
				}
			}

			// sort alphabetically by last name
			pool.girls.sort((a, b) => { return a.lastName.localeCompare(b.lastName) })
			pool.boys.sort((a, b) => { return a.lastName.localeCompare(b.lastName) })


			// initialize the sections
			let sections = []
			for (let i = 0; i < numSections; i++) {
				sections.push({
					teacher: {
						firstName: data.teachers[i].firstName,
						lastName: data.teachers[i].lastName,
						emailID: data.teachers[i].emailID
					},
					students: [],
					stats: {}
				})
			}

			// distribute the students
			for (let key in pool) {
				if (pool.hasOwnProperty(key)) {
					let group = pool[key]
					let sectionSize = Math.floor(group.length / sections.length)
					let remainderCount = group.length % sections.length
					let sectionNum = 0
					let pushCount = 0
					let secSize = sectionSize
					for (let i = 0; i < group.length; i++) {
						sections[sectionNum].students.push(group[i])
						pushCount++
						if (pushCount === secSize) {
							sectionNum++
							pushCount = 0
							if (remainderCount !== 0) {
								secSize = sectionSize + 1
								remainderCount--
							}
						}
					}
				}
			}

			let placement = { 'grade': 8, 'sections': sections }
			return savePlacement(placement)
		})
}