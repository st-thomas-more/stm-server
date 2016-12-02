import { getGradeForAlg } from '../../daos/grade-dao'
import { savePlacement } from '../../daos/placement-dao'

export default function place(db) {
	return getGradeForAlg(7, db)
		.then(data => {
			let students = data.students
			let numSections = data.teachers.length

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
			for (let i = 0; i < numSections; i++) {
				sections.push({
					teacher: {
						firstName: data.teachers[i].firstName,
						lastName: data.teachers[i].lastName
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

			for (let section of sections) {
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
			let placement = { 'grade': 7, 'sections': sections }
			return savePlacement(7, placement)
		})
}