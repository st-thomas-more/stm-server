export function updateGrade(emailID, gradeTeaching, db) {
  return new Promise((resolve, reject) => {
    db.query('UPDATE staff set gradeTeaching = ? WHERE emailID = ?;', [gradeTeaching, emailID],
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

export function getGrade(emailID, db) {
  return new Promise((resolve, reject) => {
    db.query('select * from staff WHERE emailID = ?;', emailID,
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities[0].gradeTeaching)
        }
      })
  })
}