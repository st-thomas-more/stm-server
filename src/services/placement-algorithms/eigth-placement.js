import { getGrade } from '../../daos/grade-dao'
import { savePlacement } from '../../daos/placement-dao'

export default function place() {
  return getGrade(8)
    .then(data => {
		let students = data.students

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
				let group = pool[key]
				let sectionSize = Math.floor(group.length / sections.length)
				let remainderCount = group.length % sections.length
				let sectionNum = 0
				let pushCount = 0
				let secSize = sectionSize
				for (let i = 0; i < group.length; i++) {
					sections[sectionNum].students.push(group[i])
					pushCount++
					if(pushCount === secSize){
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

		const reducer = (stats, student) => {
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
				females: 0,
				males: 0,
				count: 0
        })
        stats['genderRatio'] = stats.males / stats.females
        section.stats = stats
      }
      let placement = { 'grade': 8, 'sections': sections }
      return savePlacement(8, placement)
    })
}