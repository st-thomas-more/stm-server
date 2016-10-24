import kindergartenRaw from '../mock-data/raw/kindergarten-raw'

// TODO - replace with calls to database
export function getKindergartenRaw() {
  return new Promise((resolve) => {
    resolve(kindergartenRaw)
  })
}