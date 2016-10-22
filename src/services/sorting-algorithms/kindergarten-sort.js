import kindergartenData from '../../mock-data/kindergarten-data.json'

export default function placeStudents(){
    /*
        sorts students into their classes for the new year
        inputs:
            students: array of pre-k student objects that will be placed into classes
            num_classes: int value that is the number of kindergarten classes to be made
        returns:
            array of array of student objects representing the new classes for the new year
            
    */
    //TODO replace num classes and students with calls to database
    //num classes is determined by number of teachers
    const num_classes = 4

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
    const dial4_weight = .65
    const dob_weight = .35
     
    //get min and max ages of students   
    let min_age = students[0].dob
    let max_age = students[0].dob
    
    for(let i = 0; i < students.length; i++){
        if(students[i].dob > max_age){
            max_age = students[i].dob
        }
        else if(students[i].dob < min_age){
            min_age = students[i].dob
        }
    }
    
    //convert dob and dial4 to percentage out of 100 for each student
    //then calculate their weighted quantitative score
    for(let i = 0; i < students.length; i++){
        let dob_percentage = (students[i].dob - min_age)/max_age
        let dial4_percentage = students[i].dial4 / 105
        students[i].weighted_score = dial4_weight * dial4_percentage + dob_weight * dob_percentage
    }
    
    let girl_array = []
    let boy_array = []
    let flag_array = []
    
    for(let i = 0; i<students.length; i++){
        if(students[i].potentialDelay === true || students[i].behavior > 5){
            flag_array.push(students[i])
        }
        else if(students[i].sex === 'F'){
            girl_array.push(students[i])
        }
        else{
            boy_array.push(students[i])
        }
    }
    
    //sort the boy and girl array based off weighted score in descending order
    girl_array.sort(function(a, b){return b.weighted_score - a.weighted_score})
    boy_array.sort(function(a, b){return b.weighted_score - a.weighted_score})
    
    //sort the flagged students array based off behavior
    flag_array.sort(function(a, b){return b.behaviorObservation - a.behaviorObservation})
    
    //create the correct number of classrooms that will be sorted into
    let classes = []
    for(let i = 0; i < num_classes; i++){
        classes.push([])
    }
    
    //put the girls into their classrooms using a snake algorithm
    for(let i = 0; i < girl_array.length; i++){
        let round_num = Math.floor(i / num_classes)
        let index = i % num_classes
        if (round_num % 2 === 0){
            index = num_classes - index - 1
        }
        classes[index].push(girl_array[i])
    }
    
    //put the boys into their classrooms
    for(let i = 0; i < boy_array.length; i++){
        let round_num = Math.floor(i / num_classes)
        let index = i % num_classes
        if (round_num % 2 === 0) {
            index = num_classes - index - 1
        }
        classes[index].push(boy_array[i])
    }
    
    for(let i = 0; i < flag_array.length; i++){
        let round_num = Math.floor(i / num_classes)
        let index = i % num_classes
        if (round_num % 2 === 0) {
            index = num_classes - index - 1
        }
        classes[index].push(flag_array[i])
    }
    
    //calculate averages
    for(let i = 0; i < num_classes; i++){
        let total_behavior = 0.0
        let total_dial4 = 0.0
        let male_count = 0
        let potential_delay_count = 0
        let total_age = 0.0
        let count = 0.0
        for(let j = 0; j < classes[i].length; j++){
            total_behavior += classes[i][j].behaviorObservation
            total_dial4 += classes[i][j].dial4
            total_age += classes[i][j].dob
            count++
            if(classes[i][j].sex === 'M')
                male_count++
            if(classes[i][j].potentialDelay === 1)
                potential_delay_count++
        }
        let avg_behavior = total_behavior / count
        let female_count = count - male_count
        let avg_dial4 = total_dial4 / count
        let avg_age = total_age / count

        let stats = {'avgBehavior' : avg_behavior, 'femaleCount' : female_count, 
                     'maleCount' : male_count, 'avgDial4' : avg_dial4, 
                     'genderRatio' : male_count / female_count, 'avgAge' : avg_age,
                     'potentialDelays' : potential_delay_count
                    }

        classes[i] = {'stats': stats, 'students': classes[i], 'teacher': 'Placement Teacher'}
        }
    let grade = {'grade': 0, 'sections': classes}
    return grade
}
