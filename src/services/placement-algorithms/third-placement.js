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

      let girl_array = []
      let boy_array = []
      let behavior_array = []
      let ASP_array = []
      let advancedMath_array = []
      let medical_array = []
      let HMP_array = []
      let facultyStudent_array = []
      let newStudent_array = []

      for (let i = 0; i < students.length; i++) {
        if (students[i].facultyStudent == 1 || students[i].newStudent == 1 || students[i].advancedMath == 1 || students[i].hmp == 1 || students[i].medicalConcern == 1 || students[i].asp == 1) {
          if (students[i].asp == 1) {
            ASP_array.push(students[i])
          }
          else if (students[i].advancedMath == 1) {
            advancedMath_array.push(students[i])
          }

          else if (students[i].medicalConcern == 1) {
            medical_array.push(students[i])
          }
          else if (students[i].hmp == 1) {
            HMP_array.push(students[i])
          }
          else if (students[i].facultyStudent == 1) {
            facultyStudent_array.push(students[i])
          }
          else if (students[i].newStudent == 1) {
            newStudent_array.push(students[i])
          }
        }

        else if (students[i].behavior_score < 2) {
          behavior_array.push(students[i])
        }
        else if (students[i].sex == 'F') {
          girl_array.push(students[i])
        }
        else {
          boy_array.push(students[i])
        }
      }

      //sort the boy and girl array based off weighted score in descending order
      girl_array.sort(function (a, b) { return b.weighted_score - a.weighted_score })
      boy_array.sort(function (a, b) { return b.weighted_score - a.weighted_score })
      behavior_array.sort(function (a, b) { return b.weighted_score - a.weighted_score })

      //sort the flagged students array based off behavior
      ASP_array.sort(function (a, b) { return b.behavior_score - a.behavior_score })
      advancedMath_array.sort(function (a, b) { return b.behavior_score - a.behavior_score })
      medical_array.sort(function (a, b) { return b.behavior_score - a.behavior_score })
      HMP_array.sort(function (a, b) { return b.behavior_score - a.behavior_score })
      facultyStudent_array.sort(function (a, b) { return b.behavior_score - a.behavior_score })
      newStudent_array.sort(function (a, b) { return b.behavior_score - a.behavior_score })


      //create the correct number of classrooms that will be sorted into
      let classes = []
      for (let i = 0; i < data.sections; i++) {
        classes.push([])
      }

      //put the girls into their classrooms using a snake algorithm
      for (let i = 0; i < girl_array.length; i++) {
        let round_num = Math.floor(i / data.sections)
        let index = i % data.sections
        if (round_num % 2 == 0) {
          index = data.sections - index - 1
        }
        classes[index].push(girl_array[i])
      }

      //put the boys into their classrooms
      for (let i = 0; i < boy_array.length; i++) {
        let round_num = Math.floor(i / data.sections)
        let index = i % data.sections
        if (round_num % 2 == 0) {
          index = data.sections - index - 1
        }
        classes[index].push(boy_array[i])
      }

      //put the behavior kids into their classrooms
      for (let i = 0; i < behavior_array.length; i++) {
        let round_num = Math.floor(i / data.sections)
        let index = i % data.sections
        if (round_num % 2 == 0) {
          index = data.sections - index - 1
        }
        classes[index].push(behavior_array[i])
      }

      //put the flagged kids into their classrooms

      for (let i = 0; i < newStudent_array.length; i++) {
        let round_num = Math.floor(i / data.sections)
        let index = i % data.sections
        if (round_num % 2 == 0) {
          index = data.sections - index - 1
        }
        //    console.log("pushing " + newStudent_array[i].firstName + " " + newStudent_array[i].lastName + " with behavior: " + newStudent_array[i].behavior_score +" to class " + index)
        classes[index].push(newStudent_array[i])
      }

      for (let i = 0; i < facultyStudent_array.length; i++) {
        let round_num = Math.floor(i / data.sections)
        let index = i % data.sections
        if (round_num % 2 == 0) {
          index = data.sections - index - 1
        }
        //    console.log("pushing " + facultyStudent_array[i].firstName + " " + facultyStudent_array[i].lastName + " with behavior: " + facultyStudent_array[i].behavior_score +" to class " + index)
        classes[index].push(facultyStudent_array[i])
      }

      for (let i = 0; i < HMP_array.length; i++) {
        let round_num = Math.floor(i / data.sections)
        let index = i % data.sections
        if (round_num % 2 == 0) {
          index = data.sections - index - 1
        }
        //     console.log("pushing " + HMP_array[i].firstName + " " + HMP_array[i].lastName + " with behavior: " + HMP_array[i].behavior_score +" to class " + index)
        classes[index].push(HMP_array[i])
      }

      for (let i = 0; i < medical_array.length; i++) {
        let round_num = Math.floor(i / data.sections)
        let index = i % data.sections
        if (round_num % 2 == 0) {
          index = data.sections - index - 1
        }
        //      console.log("pushing " + medical_array[i].firstName + " " + medical_array[i].lastName + " with behavior: " + medical_array[i].behavior_score +" to class " + index)
        classes[index].push(medical_array[i])
      }

      for (let i = 0; i < advancedMath_array.length; i++) {
        let round_num = Math.floor(i / data.sections)
        let index = i % data.sections
        if (round_num % 2 == 0) {
          index = data.sections - index - 1
        }
        //      console.log("pushing " + advancedMath_array[i].firstName + " " + advancedMath_array[i].lastName + " with behavior: " + advancedMath_array[i].behavior_score +" to class " + index)
        classes[index].push(advancedMath_array[i])
      }

      for (let i = 0; i < ASP_array.length; i++) {
        let round_num = Math.floor(i / data.sections)
        let index = i % data.sections
        if (round_num % 2 == 0) {
          index = data.sections - index - 1
        }
        //      console.log("pushing " + ASP_array[i].firstName + " " + ASP_array[i].lastName + " with behavior: " + ASP_array[i].behavior_score +" to class " + index)
        classes[index].push(ASP_array[i])
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