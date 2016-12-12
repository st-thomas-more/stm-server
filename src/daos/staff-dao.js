export function getStaff(emailID, db) {
  return new Promise((resolve, reject) => {
    db.query('SELECT `*` FROM `staff` where `emailID` = ?;',
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

/*right now there are no teaches in year 2016 so it looks at the teachers that will be there next year*/
export function getAllStaff(db) {
  return new Promise((resolve, reject) => {
    db.query('select *,staff.emailID from staff left outer join teaches on staff.emailID = teaches.emailID and teaches.year = (select year+1 from time)',
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          console
          resolve(entities)
        }
      })
  })
}

/* creates or updates a staff and all of its columns*/
export function createStaff(staff, db) {
  return new Promise((resolve, reject) => {
    delete staff.name
    let data = [staff, staff]
    db.query('INSERT INTO `staff` SET ? ON DUPLICATE KEY UPDATE ?;',
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
    db.query('DELETE FROM `staff` WHERE `emailID`= ?;', emailID,
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
