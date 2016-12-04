export function insertStudent (data, db) {
    return new Promise((resolve, reject)=>{
    var data2 = data
    var data3 = data2.concat(data)
    db.query(
        'INSERT INTO `student` (id, lastName, firstName, sex, dob) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE  id = ?, `lastName`= ?, `firstName`=?, `sex`= ?, `dob`=?;',
        data3,
        function(err){
          if(err){
            reject(err)
          }else{
            resolve()
          }
        })
    })
}

export function insertYdsd(data,db){
  return new Promise((resolve, reject)=>{
  var data2 = data
  var data3 = data2.concat(data)
  db.query(
      'INSERT INTO `ydsd` (id, year, comments, homeroomTeacher, asp, nextMeetingSch, advancedMath, speechLanguage, studentDevelopment, mathEnrichment, IUreadingServices, IUmathServices, earobics, workEthic, youngestChild, onlyChild, newStudent, medicalConcern, hmp, dra, RAZ, WTW, iStation, mathBench, Dibels, cogAT, IOWA, elaTotal, ExtendedELA, mathTotal, facultyStudent, potentialDelay, behaviorObservation, selfHelp, socialEmotional, dial4, gradeEntering, ge) VALUES (?,?,?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,?, ?) ON DUPLICATE KEY UPDATE  `id` = ?, `year`=?, `comments`=?, `homeroomTeacher`=?, `asp`=?, `nextMeetingSch`=?, `advancedMath`=?, `speechLanguage`=?, `studentDevelopment`=?, `mathEnrichment`=?, `IUreadingServices`=?, `IUmathServices`=?, `earobics`=?, `workEthic`=?, `youngestChild`=?, `onlyChild`=?, `newStudent`=?, `medicalConcern`=?, `hmp`=?, `dra`=?, `RAZ`=?, `WTW`=?, `iStation`=?, `mathBench`=?, `Dibels`=?, `cogAT`=?, `IOWA`=?, `elaTotal`=?, `ExtendedELA`=?, `mathTotal`=?, `facultyStudent`=?, `potentialDelay`=?, `behaviorObservation`=?, `selfHelp`=?, `socialEmotional`=?, `dial4` =?, `gradeEntering` = ?, `ge`=?;',
      data3, function(err){
        if(err){
          reject(err)
        }else {
          resolve()
        }
      })
  })
}
