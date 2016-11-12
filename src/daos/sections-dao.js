import fs from 'fs'
import path from 'path'
import sections from '../mock-data/raw/sections-raw'

export function getSection(sectionID) {
  return new Promise((resolve, reject) => {
    const res = sections.filter(section => section.sectionID === sectionID)
    if (res.length === 1) {
      resolve(res[0])
    } else {
      reject(new Error('Section not found'))
    }
  })
}