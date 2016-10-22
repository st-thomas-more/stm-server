import placeStudents from './kindergarten-sort.js'

describe('kindergarten-sort', () => {
  it('runs', () => {
    let result = placeStudents()
    console.log(JSON.stringify(result, null, 2))
  })
})

