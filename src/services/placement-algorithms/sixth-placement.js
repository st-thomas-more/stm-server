import fs from 'fs'
import path from 'path'
import { getSixthRaw } from '../../daos/grade-dao'

export default function place() {
	return getSixthRaw()
		.then(data => {
			let students = data.students

			//constants for calculating weighted quantitative score
			const cogatWeight = .4
			const iowaWeight = .35
			const mathBenchWeight = .25

			//convert cogAT to percentage out of 100 for each student (IOWA and Math Benchmark are already percentages)
			//calculate their weighted quantitative score
			//calculate behavior score
			for (let i = 0; i < students.length; i++) {
				let cogatPercentage = (students[i].cogAT * 100) / 160
				students[i].weightedScore = cogatWeight * cogatPercentage + iowaWeight * ((students[i].elaTotal + students[i].mathTotal) / 200) + mathBenchWeight * students[i].mathBench
				if (students[i].behavior != '' && students[i].workEthic != '') {
					students[i].behaviorScore = students[i].behavior + students[i].workEthic
				} else if (students[i].behavior != '' && students[i].workEthic == '') {
					students[i].behaviorScore = students[i].behavior * 2
				} else if (students[i].behavior == '' && students[i].workEthic != '') {
					students[i].behaviorScore = students[i].workEthic * 2
				} else {
					students[i].behaviorScore = 0
				}
			}

			let girls = []
			let boys = []
			let behavior = []
			let asp = []
			let advancedMath = []
			let medical = []
			let hmp = []
			let facultyStudent = []
			let newStudent = []


			for (let i = 0; i < students.length; i++) {
				if (students[i].facultyStudent == 1 || students[i].newStudent == 1 || students[i].advancedMath == 1 || students[i].hmp == 1 || students[i].medicalConcern == 1 || students[i].asp == 1) {
					if (students[i].asp == 1) {
						asp.push(students[i])
					}
					else if (students[i].advancedMath == 1) {
						advancedMath.push(students[i])
					}
					else if (students[i].medicalConcern == 1) {
						medical.push(students[i])
					}
					else if (students[i].facultyStudent == 1) {
						facultyStudent.push(students[i])
					}
					else if (students[i].hmp == 1) {
						hmp.push(students[i])
					}
					else if (students[i].newStudent == 1) {
						newStudent.push(students[i])
					}
				}
				else if (students[i].behaviorScore < 2) {
					behavior.push(students[i])
				}
				else if (students[i].sex == 'F') {
					girls.push(students[i])
				}
				else {
					boys.push(students[i])
				}
			}

			//sort the boy and girl array based off weighted score in descending order
			girls.sort(function (a, b) { return b.weightedScore - a.weightedScore })
			boys.sort(function (a, b) { return b.weightedScore - a.weightedScore })
			behavior.sort(function (a, b) { return b.weightedScore - a.weightedScore })

			//sort the flagged students array based off behavior
			asp.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
			advancedMath.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
			medical.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
			facultyStudent.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
			hmp.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
			newStudent.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })

			//create the correct number of classrooms that will be sorted into
			let classes = []
			for (let i = 0; i < data.sections; i++) {
				classes.push([])
			}

			//put the girls into their classrooms using a snake algorithm
			for (let i = 0; i < girls.length; i++) {
				let roundNum = Math.floor(i / data.sections)
				let index = i % data.sections
				if (roundNum % 2 == 0) {
					index = data.sections - index - 1
				}
				classes[index].push(girls[i])
			}

			//put the boys into their classrooms
			for (let i = 0; i < boys.length; i++) {
				let roundNum = Math.floor(i / data.sections)
				let index = i % data.sections
				if (roundNum % 2 == 0) {
					index = data.sections - index - 1
				}
				classes[index].push(boys[i])
			}

			//put the behavior kids into their classrooms
			for (let i = 0; i < behavior.length; i++) {
				let roundNum = Math.floor(i / data.sections)
				let index = i % data.sections
				if (roundNum % 2 == 0) {
					index = data.sections - index - 1
				}
				classes[index].push(behavior[i])
			}

			//put the flagged kids into their classrooms
			for (let i = 0; i < newStudent.length; i++) {
				let roundNum = Math.floor(i / data.sections)
				let index = i % data.sections
				if (roundNum % 2 == 0) {
					index = data.sections - index - 1
				}
				classes[index].push(newStudent[i])
			}

			for (let i = 0; i < facultyStudent.length; i++) {
				let roundNum = Math.floor(i / data.sections)
				let index = i % data.sections
				if (roundNum % 2 == 0) {
					index = data.sections - index - 1
				}
				classes[index].push(facultyStudent[i])
			}

			for (let i = 0; i < hmp.length; i++) {
				let roundNum = Math.floor(i / data.sections)
				let index = i % data.sections
				if (roundNum % 2 == 0) {
					index = data.sections - index - 1
				}
				classes[index].push(hmp[i])
			}

			for (let i = 0; i < medical.length; i++) {
				let roundNum = Math.floor(i / data.sections)
				let index = i % data.sections
				if (roundNum % 2 == 0) {
					index = data.sections - index - 1
				}
				classes[index].push(medical[i])
			}

			for (let i = 0; i < advancedMath.length; i++) {
				let roundNum = Math.floor(i / data.sections)
				let index = i % data.sections
				if (roundNum % 2 == 0) {
					index = data.sections - index - 1
				}
				classes[index].push(advancedMath[i])
			}

			for (let i = 0; i < asp.length; i++) {
				let roundNum = Math.floor(i / data.sections)
				let index = i % data.sections
				if (roundNum % 2 == 0) {
					index = data.sections - index - 1
				}
				classes[index].push(asp[i])
			}

			//calculate averages
			for (let i = 0; i < data.sections; i++) {
				let totalBehavior = 0.0
				let totalTestScore = 0.0
				let maleCount = 0
				let count = 0.0
				for (let j = 0; j < classes[i].length; j++) {
					totalBehavior += classes[i][j].behaviorScore
					totalTestScore += classes[i][j].weightedScore
					count++
					if (classes[i][j].sex === 'M')
						maleCount++
				}
				let avgBehavior = totalBehavior / count
				let avgTestScore = totalTestScore / count
				let femaleCount = count - maleCount

				let stats = {
					'avgBehavior': avgBehavior, 'avgTestScore': avgTestScore, 'femaleCount': femaleCount, 'maleCount': maleCount, 'genderRatio': maleCount / femaleCount
				}
				classes[i] = { 'stats': stats, 'students': classes[i], 'teacher': data.teachers[i].name }
			}
			let placement = { 'grade': 6, 'sections': classes }

			return new Promise((resolve, reject) => {
				let filepath = path.join(__dirname, '../../mock-data/placements/sixth-placement.json')
				fs.writeFile(filepath, JSON.stringify(placement, null, 2), 'utf8', function (err) {
					if (err) {
						reject(err)
					} else {
						resolve()
					}
				})
			})
		})
}
