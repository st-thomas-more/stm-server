<<<<<<< HEAD
 import * as currentYearDao from './current-year-dao.js'


export function getStaff(emailID, db) {
  return new Promise((resolve, reject) => {
        db.query('SELECT `*` FROM `staff` natural join `section` WHERE `emailID` = ?;',
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
=======
/*gets a staff member and all of its points including the section they are teaching by the members emailID*/
export function getStaff(emailID, db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT `*` FROM `staff` WHERE `emailID` = ?;',
      emailID,
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          if (entities.length === 0) {
            reject(new Error(`Staff not found: ${emailID}`))
          }
          resolve(entities[0])
        }
      })
>>>>>>> 49ffc00caa3c96f6d3b0fc0b8563a3f5c56d0af0
  })
}
export function getAllStaff(db) {
  return new Promise((resolve, reject) => {
<<<<<<< HEAD
        db.query('SELECT `*` FROM `staff` nautral join `section`;',
          emailID,
          function (err, entities) {
            if (err) {
              reject(err)
            } else {
              resolve(entities)
            }
          })
=======
    db.query('SELECT `*` FROM `staff`;',
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities)
        }
      })
>>>>>>> 49ffc00caa3c96f6d3b0fc0b8563a3f5c56d0af0
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
