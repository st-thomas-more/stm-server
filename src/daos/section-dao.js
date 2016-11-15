import sections from '../mock-data/raw/sections-raw'

export function getSection(sectionID) {
  return new Promise((resolve, reject) => {
    if (typeof sectionID === 'string' && !isNaN(sectionID))
      sectionID = parseInt(sectionID, 10)
    const res = sections.filter(section => section.sectionID === sectionID)
    if (res.length === 1) {
      resolve(res[0])
    } else {
      reject(new Error(`Unable to find section with ID: ${sectionID}`))
    }
  })
}