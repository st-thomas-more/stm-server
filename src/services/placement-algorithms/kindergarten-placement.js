import { getGradeForAlg } from '../../daos/grade-dao'
import { savePlacement } from '../../daos/placement-dao'

export default function place(db) {
  return getGradeForAlg(0, db)
    .then(data => {
      let students = data.students
      let numSections = data.teachers.length
      //constants for the calculating weighted quantitative score
      const dial4Weight = .65
      const ageWeight = .35
      const dial4Score = 105
      const behaviorLimit = 5

      // get min and max ages
      let minAge = Number.POSITIVE_INFINITY
      let maxAge = Number.NEGATIVE_INFINITY

      for (let student of students) {
        const age = student.age
        if (age > maxAge) {
          maxAge = student.age
        } else if (age < minAge) {
          minAge = age
        }
      }

      let pool = {
        girls: [], boys: [], flags: []
      }

      for (let student of students) {
        // get weighted quantitative score
        let agePercentage = (student.age - minAge) / maxAge
        let dial4Percentage = student.dial4 / dial4Score
        student.weightedScore = (dial4Weight * dial4Percentage) + (ageWeight * agePercentage)
        // segregate
        if (student.potentialDelay || student.behavior > behaviorLimit) {
          pool.flags.push(student)
        } else if (student.sex === 'F') {
          pool.girls.push(student)
        } else {
          pool.boys.push(student)
        }
      }

      // sort by weighted score
      pool.girls.sort((a, b) => { return b.weighted_score - a.weighted_score })
      pool.boys.sort((a, b) => { return b.weighted_score - a.weighted_score })

      // sort by behavior
      pool.flags.sort((a, b) => { return b.behaviorObservation - a.behaviorObservation })
      console.log(data.teachers)
      console.log('num sections: ' + data.sections)
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
        stats.behavior += student.behaviorObservation
        stats.dial4 += student.dial4
        stats.age += student.age
        if (student.sex === 'F') {
          stats.females++
        } else {
          stats.males++
        }
        if (student.potentialDelay) {
          stats.potentialDelays++
        }
        stats.count++
        return stats
      }

      for (let section of sections) {
        let stats = section.students.reduce(reducer, {
          behavior: 0,
          dial4: 0,
          age: 0,
          females: 0,
          males: 0,
          potentialDelays: 0,
          count: 0
        })
        stats['avgBehavior'] = stats.behavior / stats.count
        stats['avgDial4'] = stats.dial4 / stats.count
        stats['avgAge'] = stats.age / stats.count
        stats['genderRatio'] = stats.males / stats.females
        section.stats = stats
      }
      let placement = { 'grade': 0, 'sections': sections }
      return savePlacement(0, placement,db)
    })
}
