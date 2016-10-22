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
       

    toString(){
        return ("Name: " + this.firstname + " " + this.lastname + " Sex: " + this.sex);
    }

}

function eighth_sort(students, num_classes){
	
	var girl_array = [];
	var boy_array = [];
	
	//separate boys and girls in arrays
	if(students[i].sex == 'F'){
        girl_array.push(students[i]);
    }
    else{
        boy_array.push(students[i]);
    }
	
	//alphabetically sort students
	girl_array.sort();
	boy_array.sort();
	
	//put the girls into their classrooms
	var index = 0;
	for(var i = 0; i < girl_array.length; i++){
	    classes[index].push(girl_array[i]);
	    if(index == classes.length){
	    	index = 0;
	    }else{
	    	index++;
	    }
	}
	//put the boys into their classrooms
	var index = 0;
	for(var i = 0; i < boy_array.length; i++){
	    classes[index].push(boy_array[i]);
	    if(index == classes.length){
	    	index = 0;
	    }else{
	    	index++;
	    }
	}
	
	return classes;
}



var students = [];
csv
 .fromPath("seventh_data.csv")
 .on("data", function(data){
    console.log("Processing: " + data[1] + ' ' + data[2]);
    /*
    var firstName = data[5];
    var lastName = data[4];
    var sex = data[3];
  
*/
  
    var attributes = {"sex": sex, "firstname": first_name, "lastname": last_name};
    var temp_student = new Student(attributes)
    students.push(temp_student);
 })
 .on("end", function(){
    console.log("done processing");
    console.log("length = " + students.length);
    eighth_sort(students, 4);
 });