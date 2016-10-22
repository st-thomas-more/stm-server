class Student{
/*
    main object for students
    holds all attributes a student will have even if they are null
    just used for get methods
*/
    constructor(attributes){
    /*
        constructor for Student that takes in JSON object that holds
        all available values for the Student
    */
        this.firstname = attributes.firstname;
        this.lastname = attributes.lastname;
        this.sex = attributes.sex;
        this.behavior = parseInt(attributes.behavior);


    toString(){
        return ("Name: " + this.firstname + " " + this.lastname + " Sex: " + this.dob + " Behavior: " +
                this.behavior);
    }

}

function seventh_sort(students, num_classes){
	
	var girl_array = [];
	var boy_array = [];
	
	//separate boys and girls in arrays
	if(students[i].sex == 'F'){
        girl_array.push(students[i]);
    }
    else{
        boy_array.push(students[i]);
    }
    //sort arrays based on student behavior
    girl_array.sort(function(a, b){return b.behavior - a.behavior;});
    boy_array.sort(function(a, b){return b.behavior - a.behavior;});
	
	for(var i = 0; i < girl_array.length; i++){
        var round_num = Math.floor(i / num_classes);
        var index = i % num_classes;
        if (round_num % 2 == 0){
            index = num_classes - index - 1;
        }
        console.log("pushing " + girl_array[i].firstname + " " + girl_array[i].lastname + " with behavior: " + girl_array[i].behavior +
        " to class " + index);
        classes[index].push(girl_array[i]);
    }
    
    //put the boys into their classrooms
    for(var i = 0; i < boy_array.length; i++){
        var round_num = Math.floor(i / num_classes);
        var index = i % num_classes;
        if (round_num % 2 == 0) {
            index = num_classes - index - 1;
        }
        console.log("pushing " + boy_array[i].firstname + " " + boy_array[i].lastname + " with behavior: " + boy_array[i].behavior +
        " to class " + index);
        classes[index].push(boy_array[i]);
    }
	
	
	return classes;
}




var students = [];
csv
 .fromPath("7th_data.csv")
 .on("data", function(data){
    console.log("Processing: " + data[1] + ' ' + data[2]);
    /*
    var firstName = data[5];
    var lastName = data[4];
    var sex = data[3];
    var behavior = data[12];
*/
    var attributes = {"sex": sex, "firstname": first_name, "lastname": last_name,
                     "behavior": behavior};
    var temp_student = new Student(attributes)
    students.push(temp_student);
 })
 .on("end", function(){
    console.log("done processing");
    console.log("length = " + students.length);
    seventh_sort(students, 4);
 });
