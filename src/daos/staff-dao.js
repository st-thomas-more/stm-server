 import * as currentYearDao from './current-year-dao.js'


export function getStaff(emailID, db) {
  return new Promise((resolve, reject) => {
        db.query('SELECT `*` FROM `staff` natural join `section` WHERE `emailID` = ?;',
           emailID,
            function (err, entities) {
            if (err) {
              reject(err)
            } else {
              if (entities.length === 0) {
                reject(new Error(emailID + ' Not Found'))
              }
              resolve(entities[0])
            }
          })
  })
}
export function getAllStaff(db) {
  return new Promise((resolve, reject) => {
      currentYearDao.getDashYear(db)
      .then(year =>{
        db.query('SELECT `*` FROM `staff` NATURAL JOIN `teaches` WHERE `year`= ?;',
          year,
          function (err, entities) {
            if (err) {
              reject(err)
            } else {
              resolve(entities)
            }
          })
      }).catch(err => {
        reject(err)
      })
    })
}

/* creates or updates a staff and all of its columns*/
export function createStaff(staff, db) {
  return new Promise((resolve, reject) => {
    let data = [staff.emailID, staff.accessLevel, staff.firstName, staff.lastName, staff.gradeTeaching, staff.accessLevel, staff.gradeTeaching]
    db.query('INSERT INTO staff (emailID, accessLevel, firstName, lastName, gradeTeaching) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE accessLevel = ?, gradeTeaching = ?;',
      data,
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}


/*deletes staff from the db*/
export function deleteStaff(emailID, db) {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM `staff` WHERE `emailID`= ?', emailID,
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
