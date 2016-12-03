import { getGradeForAlg } from '../../daos/grade-dao'
import { savePlacement } from '../../daos/placement-dao'

export default function place(grade, db) {
  if(grade < 1 || grade > 3){
    console.log('ERROR: grade' + grade + ' outside of bounds for third grade placement')
    return false
  }
  return getGradeForAlg(grade, db)
    .then(data => {
      let students = data.students
      console.log(data)
      let numSections = data.teachers.length
      //constants for the calculating weighted quantitative score
      const draWeight = .6
      const mathBenchWeight = .4
      const draScore = 70
      const behaviorLimit = 2

      for (let student of students) {
        let draPercentage = (student.dra * 100) / draScore
        student.weightedScore = (draWeight * draPercentage) + (mathBenchWeight * student.mathBench)
        student.behaviorScore = (isNaN(student.behavior) ? 0 : student.behavior) + (isNaN(student.workEthic) ? 0 : student.workEthic)
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
            pool[key].sort((a, b) => { return b.weightedScore - a.weightedScore })
          } else {
            pool[key].sort((a, b) => { return b.behaviorScore - a.behaviorScore })
          }
        }
      }

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
        stats.score += student.weightedScore
        if (student.sex === 'F') {
          stats.females++
        } else {
          stats.males++
        }
        if (student.asp) {
          stats.asps++
        }
        if (student.hmp) {
          stats.hmps++
        }
        if (student.advancedMath) {
          stats.advancedMaths++
        }
        if (student.medicalConcern) {
          stats.medicalConcerns++
        }
        if (student.facultyStudent) {
          stats.facultyStudents++
        }
        if (student.newStudent) {
          stats.newStudents++
        }
        stats.count++
        return stats
      }

      for (let section of sections) {
        let stats = section.students.reduce(reducer, {
          asps: 0,
          hmps: 0,
          advancedMaths: 0,
          behavior: 0,
          score: 0,
          females: 0,
          males: 0,
          medicalConcerns: 0,
          facultyStudents: 0,
          newStudents: 0,
          count: 0
        })
        stats['avgBehavior'] = stats.behavior / stats.count
        stats['avgTestScore'] = stats.score / stats.count
        stats['genderRatio'] = stats.males / stats.females
        section.stats = stats
      }
      let placement = { 'grade': grade, 'sections': sections }
      return savePlacement(grade, placement,db)
    })
}

function pushStudent(student, females, males) {
  if (student.sex === 'F') {
    females.push(student)
  } else {
    males.push(student)
  }
}