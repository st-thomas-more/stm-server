import fs from 'fs'
import path from 'path'
import gradeDao from './grade-dao.js'

function getPath(grade) {
  let name
  switch(grade) {   
    case 0:
      name = 'kindergarten'
      break
    case 1:
      name = 'first'
      break
    case 2:
      name = 'second'
      break
    case 3:
      name = 'third'
      break
    case 4:
      name = 'fourth'
      break
    case 5:
      name = 'fifth'
      break
    case 6:
      name = 'sixth'
      break
    case 7:
      name = 'seventh'
      break
    case 8:
      name = 'eighth'
      break
  }
  return path.join(__dirname, `../mock-data/placements/${name}-placement.json`)
}

// TODO - replace with calls to database
export function getPlacement(grade,db) {
  return new Promise((resolve, reject) => {
    var result = []
    
    const filepath = getPath(grade)
    fs.readFile(filepath, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(data))
      }
    })
  })
}

export function savePlacement(grade, placement) {
  return new Promise((resolve, reject) => {
    const filepath = getPath(grade)
    fs.writeFile(filepath, JSON.stringify(placement, null, 2), 'utf8', function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function deletePlacement(grade) {
  return new Promise((resolve, reject) => {
    const filepath = getPath(grade)
    fs.unlink(filepath, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}