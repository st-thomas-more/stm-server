import kindergartenPlacement from '../mock-data/placements/kindergarten-placement.json'
// TODO - replace with reads from database
export function kindergarten() {
  return new Promise((resolve, reject) => {
    if (kindergartenPlacement) {
      resolve(kindergartenPlacement)
    } else {
      reject('file not found')
    }
  })
}