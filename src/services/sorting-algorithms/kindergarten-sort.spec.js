import csv from 'fast-csv'
import placeStudents from './kindergarten-sort.js'
import Student from '../../models/student.js'

describe('kindergarten-sort', () => {
  it('runs', () => {
    let students = []
    csv
      .fromPath('../../mock-data/kindergarten_data.csv')
      .on('data', function (data) {
        console.log('Processing: ' + data[1] + ' ' + data[2])
        let sex = data[0]
        let last_name = data[1]
        let first_name = data[2]
        let dial4 = data[3]
        let behavior = data[4]
        let self_help = data[5]
        let social_emotional = data[6]
        let potential_delay = data[7]
        let age = data[8]
        potential_delay = (potential_delay === 'X') ? 1 : 0
        age = age.split(' ')
        let year = age[0]
        let month = age[2]
        age = parseInt(month) + parseInt(year) * 12

        let attributes = {
          'sex': sex, 'firstname': first_name, 'lastname': last_name,
          'dial4': dial4, 'behavior_observation': behavior,
          'potential_delay': potential_delay, 'dob': age
        }
        let temp_student = new Student(attributes)
        students.push(temp_student)
      })
      .on('end', function () {
        console.log('done processing')
        console.log('length = ' + students.length)
        placeStudents(students, 4)
      })
  })
})

