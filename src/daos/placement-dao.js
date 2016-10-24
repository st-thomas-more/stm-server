import fs from 'fs'
import path from 'path'

// TODO - replace with calls to database
export function getKindergartenPlacement() {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../mock-data/placements/kindergarten-placement.json')
    fs.readFile(filepath, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(data))
      }
    })
  })
}

export function deleteKindergartenPlacement() {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../mock-data/placements/kindergarten-placement.json')
    fs.unlink(filepath, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// TODO - replace with calls to database
export function getThirdPlacement() {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../mock-data/placements/third-placement.json')
    fs.readFile(filepath, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(data))
      }
    })
  })
}

export function deleteThirdPlacement() {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../mock-data/placements/third-placement.json')
    fs.unlink(filepath, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}