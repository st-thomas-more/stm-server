import kindergartenData from '../mock-data/grades/kindergarten-grade'

// TODO - replace with reads from database
export function kindergarten() {
  return new Promise((resolve) => {
    resolve(kindergartenData)
  })
}