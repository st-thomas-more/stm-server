import kindergartenData from '../../mock-data/kindergarten-data.json'

export default function placeStudents(){
    /*
        sorts students into their classes for the new year
        inputs:
            students: array of pre-k student objects that will be placed into classes
            numClasses: int value that is the number of kindergarten classes to be made
        returns:
            array of array of student objects representing the new classes for the new year
            
    */
    //TODO replace num classes and students with calls to database
    //num classes is determined by number of teachers
    const numClasses = 4

    let students = []
    for (let student of kindergartenData) {
        let age = student.age.split(' ')
        let year = age[0]
        let month = age[2]
        student.age = parseInt(month) + parseInt(year) * 12
        student.potentialDelay = (student.potentialDelay === 'X') ? 1 : 0

        let attributes = {
          'sex': student.sex, 'firstName': student.firstName, 'lastName': student.lastName,
          'dial4': student.dial4, 'behaviorObservation': student.behaviorObservation,
          'potentialDelay': student.potentialDelay, 'dob': student.age
        }

        students.push(attributes)
    }
    
    //constants for the calculating weighted quantitative score
    const dial4Weight = .65
    const dobWeight = .35
     
    //get min and max ages of students   
    let minAge = students[0].dob
    let maxAge = students[0].dob
    
    for(let i = 0; i < students.length; i++){
        if(students[i].dob > maxAge){
            maxAge = students[i].dob
        }
        else if(students[i].dob < minAge){
            minAge = students[i].dob
        }
    }
    
    //convert dob and dial4 to percentage out of 100 for each student
    //then calculate their weighted quantitative score
    for(let i = 0; i < students.length; i++){
        let dobPercentage = (students[i].dob - minAge)/maxAge
        let dial4Percentage = students[i].dial4 / 105
        students[i].weighted_score = dial4Weight * dial4Percentage + dobWeight * dobPercentage
    }
    
    let girls = []
    let boys = []
    let flags = []
    
    for(let i = 0; i < students.length; i++){
        if(students[i].potentialDelay === true || students[i].behavior > 5){
            flags.push(students[i])
        }
        else if(students[i].sex === 'F'){
            girls.push(students[i])
        }
        else{
            boys.push(students[i])
        }
    }
    
    //sort the boy and girl array based off weighted score in descending order
    girls.sort(function(a, b){return b.weighted_score - a.weighted_score})
    boys.sort(function(a, b){return b.weighted_score - a.weighted_score})
    
    //sort the flagged students array based off behavior
    flags.sort(function(a, b){return b.behaviorObservation - a.behaviorObservation})
    
    //create the correct number of classrooms that will be sorted into
    let classes = []
    for(let i = 0; i < numClasses; i++){
        classes.push([])
    }
    
    //put the girls into their classrooms using a snake algorithm
    for(let i = 0; i < girls.length; i++){
        let roundNum = Math.floor(i / numClasses)
        let index = i % numClasses
        if (roundNum % 2 === 0){
            index = numClasses - index - 1
        }
        classes[index].push(girls[i])
    }
    
    //put the boys into their classrooms
    for(let i = 0; i < boys.length; i++){
        let roundNum = Math.floor(i / numClasses)
        let index = i % numClasses
        if (roundNum % 2 === 0) {
            index = numClasses - index - 1
        }
        classes[index].push(boys[i])
    }
    
    for(let i = 0; i < flags.length; i++){
        let roundNum = Math.floor(i / numClasses)
        let index = i % numClasses
        if (roundNum % 2 === 0) {
            index = numClasses - index - 1
        }
        classes[index].push(flags[i])
    }
    
    //calculate averages
    for(let i = 0; i < numClasses; i++){
        let totalBehavior = 0.0
        let totalDial4 = 0.0
        let male_count = 0
        let potentialDelayCount = 0
        let totalAge = 0.0
        let count = 0.0
        for(let j = 0; j < classes[i].length; j++){
            totalBehavior += classes[i][j].behaviorObservation
            totalDial4 += classes[i][j].dial4
            totalAge += classes[i][j].dob
            count++
            if(classes[i][j].sex === 'M')
                male_count++
            if(classes[i][j].potentialDelay === 1)
                potentialDelayCount++
        }
        let avgBehavior = totalBehavior / count
        let femaleCount = count - male_count
        let avgDial4 = totalDial4 / count
        let avgAge = totalAge / count

        let stats = {'avgBehavior' : avgBehavior, 'femaleCount' : femaleCount, 
                     'maleCount' : male_count, 'avgDial4' : avgDial4, 
                     'genderRatio' : male_count / femaleCount, 'avgAge' : avgAge,
                     'potentialDelays' : potentialDelayCount
                    }

        classes[i] = {'stats': stats, 'students': classes[i], 'teacher': 'Placement Teacher'}
        }
    let grade = {'grade': 0, 'sections': classes}
    return grade
}
