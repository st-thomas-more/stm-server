import fs from 'fs'
import path from 'path'
import { getThirdRaw } from '../../daos/grade-dao'

export default function place() {
  return getThirdRaw()
    .then(data => {
      let students = data.students
      //constants for the calculating weighted quantitative score
      const draWeight = .6
      const mathBenchWeight = .4

      for (let i = 0; i < students.length; i++) {
        let draPercentage = (students[i].dra * 100) / 70
        students[i].weighted_score = draWeight * draPercentage + mathBenchWeight * students[i].mathBench
        students[i].behavior_score = students[i].behavior + students[i].workEthic
      }

      let girls = []
      let boys = []
      let behaviorM = []
      let behaviorF = []
      let aspM = []
      let aspF = []
      let advancedMathM = []
      let advancedMathF = []
      let medicalM = []
      let medicalF = []
      let hmpM = []
      let hmpF = []
      let facultyStudentM = []
      let facultyStudentF = []
      let newStudentM = []
      let newStudentF = []


      for (let i = 0; i < students.length; i++) {
        if (students[i].facultyStudent == 1 || students[i].newStudent == 1 || students[i].advancedMath == 1 || students[i].hmp == 1 || students[i].medicalConcern == 1 || students[i].asp == 1) {
          if (students[i].asp == 1) {
            if (students[i].sex === 'M')
              aspM.push(students[i])
            else
              aspF.push(students[i])
          }
          else if (students[i].advancedMath == 1) {
            if (students[i].sex === 'M')
              advancedMathM.push(students[i])
            else
              advancedMathF.push(students[i])
          }
          else if (students[i].medicalConcern == 1) {
            if (students[i].sex === 'M')
              medicalM.push(students[i])
            else
              medicalF.push(students[i])
          }
          else if (students[i].facultyStudent == 1) {
            if (students[i].sex === 'M')
              facultyStudentM.push(students[i])
            else
              facultyStudentF.push(students[i])
          }
          else if (students[i].hmp == 1) {
            if (students[i].sex === 'M')
              hmpM.push(students[i])
            else
              hmpF.push(students[i])
          }
          else if (students[i].newStudent == 1) {
            if (students[i].sex === 'M')
              newStudentM.push(students[i])
            else
              newStudentF.push(students[i])
          }
        }
        else if (students[i].behaviorScore < 2) {
          if (students[i].sex === 'M')
            behaviorM.push(students[i])
          else
            behaviorF.push(students[i])
        }
        else if (students[i].sex === 'F') {
          girls.push(students[i])
        }
        else {
          boys.push(students[i])
        }
      }

      //sort the boy and girl array based off weighted score in descending order
      girls.sort(function (a, b) { return b.weightedScore - a.weightedScore })
      boys.sort(function (a, b) { return b.weightedScore - a.weightedScore })
      behaviorM.sort(function (a, b) { return b.weightedScore - a.weightedScore })
      behaviorF.sort(function (a, b) { return b.weightedScore - a.weightedScore })

      //sort the flagged students array based off behavior
      aspM.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      aspF.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      advancedMathM.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      advancedMathF.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      medicalM.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      medicalF.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      facultyStudentM.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      facultyStudentF.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      hmpM.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      hmpF.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      newStudentM.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })
      newStudentF.sort(function (a, b) { return b.behaviorScore - a.behaviorScore })

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
      let classIndex = 0
      for (let i = 0; i < behaviorF.length; i++) {
        classes[classIndex].push(behaviorF[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }
      for (let i = 0; i < behaviorM.length; i++) {
        classes[classIndex].push(behaviorM[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }

      //put the flagged kids into their classrooms
      for (let i = 0; i < newStudentM.length; i++) {
        classes[classIndex].push(newStudentM[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }
      for (let i = 0; i < newStudentF.length; i++) {
        classes[classIndex].push(newStudentF[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }
      for (let i = 0; i < facultyStudentM.length; i++) {
        classes[classIndex].push(facultyStudentM[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }
      for (let i = 0; i < facultyStudentF.length; i++) {
        classes[classIndex].push(facultyStudentF[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }
      for (let i = 0; i < hmpM.length; i++) {
        classes[classIndex].push(hmpM[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }
      for (let i = 0; i < hmpF.length; i++) {
        classes[classIndex].push(hmpF[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }

      for (let i = 0; i < medicalM.length; i++) {
        classes[classIndex].push(medicalM[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }
      for (let i = 0; i < medicalF.length; i++) {
        classes[classIndex].push(medicalF[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }

      for (let i = 0; i < advancedMathM.length; i++) {
        classes[classIndex].push(advancedMathM[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }
      for (let i = 0; i < advancedMathF.length; i++) {
        classes[classIndex].push(advancedMathF[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }

      for (let i = 0; i < aspM.length; i++) {
        classes[classIndex].push(aspM[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }
      for (let i = 0; i < aspF.length; i++) {
        classes[classIndex].push(aspF[i])
        if (classIndex < data.sections - 1)
          classIndex++
        else
          classIndex = 0
      }




      //count # of flagged kids in each class
      for (let i = 0; i < data.sections; i++) {
        let countASP = 0
        let countAdvancedMath = 0
        let countMedical = 0
        let countHMP = 0
        let countFacultyStudent = 0
        let countNewStudent = 0
        let male_count = 0
        let count = 0
        let behaviorFlag = 0
        let testAvg = 0
        let testTot = 0

        for (let j = 0; j < classes[i].length; j++) {
          count++
          testTot += classes[i][j].weighted_score

          if (classes[i][j].asp == 1) {
            countASP++
          }
          if (classes[i][j].advancedMath == 1) {
            countAdvancedMath++
          }

          if (classes[i][j].medicalConcern == 1) {
            countMedical++
          }
          if (classes[i][j].hmp == 1) {
            countHMP++
          }
          if (classes[i][j].facultyStudent == 1) {
            countFacultyStudent++
          }
          if (classes[i][j].newStudent == 1) {
            countNewStudent++
          }
          if (classes[i][j].behavior_score < 2) {
            behaviorFlag++
          }
          if (classes[i][j].sex === 'M') {
            male_count++
          }
        }
        let femaleCount = count - male_count
        testAvg = testTot / count


        let stats = {
          'ASP': countASP, 'advancedMath': countAdvancedMath,
          'maleCount': male_count, 'femaleCount': femaleCount, 'genderRatio': male_count / femaleCount, 'medicalConcern': countMedical,
          'HMP': countHMP, 'facultyStudent': countFacultyStudent,
          'newStudent': countNewStudent, 'testAvg': testAvg
        }

        classes[i] = { 'stats': stats, 'students': classes[i], 'teacher': data.teachers[i].name }
      }
      let placement = { 'grade': data.grade, 'sections': classes }

      return new Promise((resolve, reject) => {
        let filepath = path.join(__dirname, '../../mock-data/placements/third-placement.json')
        fs.writeFile(filepath, JSON.stringify(placement, null, 2), 'utf8', function (err) {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    })
    .catch(err => {
      console.error(err)
    })
}