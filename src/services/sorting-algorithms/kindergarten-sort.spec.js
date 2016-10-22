import placeStudents from './kindergarten-sort.js'
import Student from '../../models/student.js'
import data from '../../mock-data/kindergarten-data.json'

describe('kindergarten-sort', () => {
  it('runs', () => {
    let students = []
    for (let student of data) {
        console.error(student)
        let age = student.age.split(' ')
        let year = age[0]
        let month = age[2]
        student.age = parseInt(month) + parseInt(year) * 12
        student.potentialDelay = (student.potentialDelay === 'X') ? 1 : 0

        let attributes = {
          'sex': student.sex, 'firstname': student.firstName, 'lastname': student.lastName,
          'dial4': student.dial4, 'behavior_observation': student.behavior,
          'potential_delay': student.potentialDelay, 'dob': age
        }

        let temp_student = new Student(attributes)
        students.push(temp_student)
    }
    let result = placeStudents(students, 4)
    // print result output here
  })
})

