import fs from 'fs'
import path from 'path'
import { getKindergartenRaw } from '../../daos/grade-dao'

export default function place() {
  return getKindergartenRaw()
    .then(data => {
      let students = data.students
      //constants for the calculating weighted quantitative score
      const dial4Weight = .65
      const ageWeight = .35

      //get min and max ages of students   
      let minAge = students[0].age
      let maxAge = students[0].age

      for (let i = 0; i < students.length; i++) {
        if (students[i].age > maxAge) {
          maxAge = students[i].age
        }
        else if (students[i].age < minAge) {
          minAge = students[i].age
        }
      }

      //convert age and dial4 to percentage out of 100 for each student
      //then calculate their weighted quantitative score
      for (let i = 0; i < students.length; i++) {
        let agePercentage = (students[i].age - minAge) / maxAge
        let dial4Percentage = students[i].dial4 / 105
        students[i].weighted_score = dial4Weight * dial4Percentage + ageWeight * agePercentage
      }

      let girls = []
      let boys = []
      let flags = []

      for (let i = 0; i < students.length; i++) {
        if (students[i].potentialDelay === true || students[i].behavior > 5) {
          flags.push(students[i])
        }
        else if (students[i].sex === 'F') {
          girls.push(students[i])
        }
        else {
          boys.push(students[i])
        }
      }

      //sort the boy and girl array based off weighted score in descending order
      girls.sort(function (a, b) { return b.weighted_score - a.weighted_score })
      boys.sort(function (a, b) { return b.weighted_score - a.weighted_score })

      //sort the flagged students array based off behavior
      flags.sort(function (a, b) { return b.behaviorObservation - a.behaviorObservation })

      //create the correct number of classrooms that will be sorted into
      let classes = []
      for (let i = 0; i < data.sections; i++) {
        classes.push([])
      }

      //put the girls into their classrooms using a snake algorithm
      for (let i = 0; i < girls.length; i++) {
        let roundNum = Math.floor(i / data.sections)
        let index = i % data.sections
        if (roundNum % 2 === 0) {
          index = data.sections - index - 1
        }
        classes[index].push(girls[i])
      }

      //put the boys into their classrooms
      for (let i = 0; i < boys.length; i++) {
        let roundNum = Math.floor(i / data.sections)
        let index = i % data.sections
        if (roundNum % 2 === 0) {
          index = data.sections - index - 1
        }
        classes[index].push(boys[i])
      }

      for (let i = 0; i < flags.length; i++) {
        let roundNum = Math.floor(i / data.sections)
        let index = i % data.sections
        if (roundNum % 2 === 0) {
          index = data.sections - index - 1
        }
        classes[index].push(flags[i])
      }

      //calculate averages
      for (let i = 0; i < data.sections; i++) {
        let totalBehavior = 0.0
        let totalDial4 = 0.0
        let male_count = 0
        let potentialDelayCount = 0
        let totalAge = 0.0
        let count = 0.0
        for (let j = 0; j < classes[i].length; j++) {
          totalBehavior += classes[i][j].behaviorObservation
          totalDial4 += classes[i][j].dial4
          totalAge += classes[i][j].age
          count++
          if (classes[i][j].sex === 'M')
            male_count++
          if (classes[i][j].potentialDelay === 1)
            potentialDelayCount++
        }
        let avgBehavior = totalBehavior / count
        let femaleCount = count - male_count
        let avgDial4 = totalDial4 / count
        let avgAge = totalAge / count

        let stats = {
          'avgBehavior': avgBehavior, 'femaleCount': femaleCount,
          'maleCount': male_count, 'avgDial4': avgDial4,
          'genderRatio': male_count / femaleCount, 'avgAge': avgAge,
          'potentialDelays': potentialDelayCount
        }
        classes[i] = { 'stats': stats, 'students': classes[i], 'teacher': data.teachers[i].name }
      }
      let placement = { 'grade': 0, 'sections': classes }
      return new Promise((resolve, reject) => {
        let filepath = path.join(__dirname, '../../mock-data/placements/kindergarten-placement.json')
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
