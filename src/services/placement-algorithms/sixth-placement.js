import { getGrade } from '../../daos/grade-dao'
import { savePlacement } from '../../daos/placement-dao'

export default function place() {
	return getGrade(6)
		.then(data => {
			let students = data.students

			// constants for calculating weighted quantitative score
			const cogatWeight = .4
			const iowaWeight = .35
			const mathBenchWeight = .25
			const cogatScore = 160
			const behaviorLimit = 2

			// convert cogAT to percentage out of 100 for each student (IOWA and Math Benchmark are already percentages)
			// calculate their weighted quantitative score
			// calculate behavior score
			for (let student of students) {
				let cogat = cogatWeight * (student.cogAT / cogatScore)
				let math = mathBenchWeight * student.mathBench
				let iowa = iowaWeight * ((student.elaTotal + student.mathTotal) / 2)
				student.weightedScore = cogat + math + iowa
				student.behaviorScore = (student.behavior ? student.behavior : 0) + (student.workEthic ? student.workEthic : 0)
			}

			let pool = {
        girls: [], boys: [], behaviorF: [], behaviorM: [], aspF: [], aspM: [],
        advancedMathF: [], advancedMathM: [], medicalF: [], medicalM: [],
        hmpF: [], hmpM: [], facultyStudentF: [], facultyStudentM: [],
        newStudentF: [], newStudentM: []
      }

			// segregate
      for (let student of students) {
        if (student.asp) {
          pushStudent(student, pool.aspF, pool.aspM)
        } else if (student.advancedMath) {
          pushStudent(student, pool.advancedMathF, pool.advancedMathM)
        } else if (student.medicalConcern) {
          pushStudent(student, pool.medicalF, pool.medicalM)
        } else if (student.facultyStudent) {
          pushStudent(student, pool.facultyStudentF, pool.facultyStudentM)
        } else if (student.hmp) {
          pushStudent(student, pool.hmpF, pool.hmpM)
        } else if (student.newStudent) {
          pushStudent(student, pool.newStudentF, pool.newStudentM)
        } else if (student.behavior > behaviorLimit) {
          pushStudent(student, pool.behaviorF, pool.behaviorM)
        } else {
          pushStudent(student, pool.girls, pool.boys)
        }
      }

			// sort boys & girls by weighted score, others by behavior
      for (let key in pool) {
        if (pool.hasOwnProperty(key)) {
          if (key === 'girls' || key === 'boys') {
            pool[key].sort((a, b) => { return b.weightedScore - a.weightedScore})
          } else {
            pool[key].sort((a, b) => {return b.behaviorScore - a.behaviorScore})
          }
        }
      }

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

      let placement = { 'grade': 6, 'sections': sections }
      return savePlacement(placement)
		})
}

function pushStudent(student, females, males) {
  if (student.sex === 'F') {
    females.push(student)
  } else {
    males.push(student)
  }
}