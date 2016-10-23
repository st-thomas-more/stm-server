import kindergartenRaw from '../mock-data/raw/kindergarten-raw'
import sixthRaw from '../mock-data/raw/sixth-raw'

// TODO - replace with calls to database
export function getKindergartenRaw() {
  return new Promise((resolve) => {
    resolve(kindergartenRaw)
  })
}

export function getSixthRaw() {
  return new Promise((resolve) => {
    resolve(sixthRaw)
  })
}