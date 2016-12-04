import { getGrade } from '../../daos/grade-dao'
import { savePlacement } from '../../daos/placement-dao'

export default function place() {
	return getGrade(7)
		.then(data => {
			let students = data.students

			let pool = {
				girls: [], boys: []
			}

			for (let student of students) {
				student.behaviorScore = (student.behavior ? student.behavior : 0) + (student.workEthic ? student.workEthic : 0)
				if (student.sex === 'F') {
					pool.girls.push(student)
				} else {
					pool.boys.push(student)
				}
			}

			// sort by behavior score
			pool.girls.sort((a, b) => { return b.behaviorScore - a.behaviorScore })
			pool.boys.sort((a, b) => { return b.behaviorScore - a.behaviorScore })


			// initialize the sections
			let sections = []
			for (let i = 0; i < data.sections; i++) {
				sections.push({
					teacher: {
						name: data.teachers[i].name
					},
					students: [],
					stats: {}
				})
			}

			// distribute the students
			for (let key in pool) {
				if (pool.hasOwnProperty(key)) {
					sections.sort((a, b) => { return a.students.length - b.students.length })
					let group = pool[key]
					for (let i = 0; i < group.length; i++) {
						sections[i % sections.length].students.push(group[i])
					}
				}
			}

			let placement = { 'grade': 7, 'sections': sections }
			return savePlacement(placement)
		})
}