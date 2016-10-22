function place_students(students, num_classes){
    /*
        sorts students into their classes for the new year
        inputs:
            students: array of pre-k student objects that will be placed into classes
            num_classes: int value that is the number of kindergarten classes to be made
        returns:
            array of array of student objects representing the new classes for the new year
            
    */
    
    //constants for the calculating weighted quantitative score
    var dial4_weight = .65;
    var dob_weight = .35;
     
    //get min and max ages of students   
    var min_age = students[0].dob;
    var max_age = students[0].dob;
    
    for(var i = 0; i < students.length; i++){
        if(students[i].dob > max_age){
            max_age = students[i].dob;
        }
        else if(students[i].dob < min_age){
            min_age = students[i].dob;
        }
    }
    
    //convert dob and dial4 to percentage out of 100 for each student
    //then calculate their weighted quantitative score
    for(var i = 0; i < students.length; i++){
        var dob_percentage = (students[i].dob - min_age)/max_age;
        var dial4_percentage = students[i].dial4 / 105;
        students[i].weighted_score = dial4_weight * dial4_percentage + dob_weight * dob_percentage;
    }
    
    var girl_array = [];
    var boy_array = [];
    var flag_array = [];
    
    for(var i = 0; i<students.length; i++){
        if(students[i].potential_delay == true || students[i].behavior > 5){
            flag_array.push(students[i]);
        }
        else if(students[i].sex == 'F'){
            girl_array.push(students[i]);
        }
        else{
            boy_array.push(students[i]);
        }
    }
    
    //sort the boy and girl array based off weighted score in descending order
    girl_array.sort(function(a, b){return b.weighted_score - a.weighted_score;});
    boy_array.sort(function(a, b){return b.weighted_score - a.weighted_score;});
    
    //sort the flagged students array based off behavior
    flag_array.sort(function(a, b){return b.behavior_observation - a.behavior_observation;});
    
    //create the correct number of classrooms that will be sorted into
    var classes = [];
    for(var i = 0; i < num_classes; i++){
        classes.push([]);
    }
    
    //put the girls into their classrooms using a snake algorithm
    for(var i = 0; i < girl_array.length; i++){
        var round_num = Math.floor(i / num_classes);
        var index = i % num_classes;
        if (round_num % 2 == 0){
            index = num_classes - index - 1;
        }
        classes[index].push(girl_array[i]);
    }
    
    //put the boys into their classrooms
    for(var i = 0; i < boy_array.length; i++){
        var round_num = Math.floor(i / num_classes);
        var index = i % num_classes;
        if (round_num % 2 == 0) {
            index = num_classes - index - 1;
        }
        classes[index].push(boy_array[i]);
    }
    
    for(var i = 0; i < flag_array.length; i++){
        var round_num = Math.floor(i / num_classes);
        var index = i % num_classes;
        if (round_num % 2 == 0) {
            index = num_classes - index - 1;
        }
        console.log("pushing " + flag_array[i].firstname + " " + flag_array[i].lastname + " with behavior: " + flag_array[i].behavior_observation +" to class " + index);
        classes[index].push(flag_array[i]);
    }
    
    //make sure the average behavior counts are similar
    for(var i = 0; i < num_classes; i++){
        var total_behavior = 0.0;
        var count = 0.0;
        console.log("class[" + i + "] student list: ");
        for(var j = 0; j < classes[i].length; j++){
            total_behavior += classes[i][j].behavior_observation;
            count++;
            console.log(classes[i][j].toString());
        }
        classes[i].avg_behavior = total_behavior / count;   
        
        //for now print out the class behavior averages
        //TODO: balance out the behaviors to an acceptable level
        console.log("class[" + i + "] size = " + classes[i].length + " average behavior = " + classes[i].avg_behavior);
    }
    
    return classes;
}

module.exports.place_students = place_students