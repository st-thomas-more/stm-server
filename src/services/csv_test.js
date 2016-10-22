var csv = require("fast-csv");
var KindergartenModule = require("./KindergartenSort.js");
var StudentModule = require("./Student.js");
console.log("starting");


var students = [];
csv
 .fromPath("../mockdata/kindergarten_data.csv")
 .on("data", function(data){
    console.log("Processing: " + data[1] + ' ' + data[2]);
    var sex = data[0];
    var last_name = data[1];
    var first_name = data[2];
    var dial4 = data[3];
    var behavior = data[4];
    var self_help = data[5];
    var social_emotional = data[6];
    var potential_delay = data[7];
    var age = data[8];
    if(potential_delay == 'X'){
    	potential_delay = 1;
    }
    else{
    	potential_delay = 0;
    }
    age = age.split(" ");
    var year = age[0];
    var month = age[2];
    age = parseInt(month) + parseInt(year) * 12;
    //console.log(sex + ', ' + last_name + ', ' + first_name + ', ' + dial4 +
    //			', ' + behavior + ', ' + self_help + ', ' + social_emotional + ', ' + potential_delay + ', ' + age);
    var attributes = {"sex": sex, "firstname": first_name, "lastname": last_name,
    				 "dial4": dial4, "behavior_observation": behavior,
    				 "potential_delay": potential_delay, "dob": age};
    var temp_student = new StudentModule.Student(attributes)
    students.push(temp_student);
 })
 .on("end", function(){
    console.log("done processing");
    console.log("length = " + students.length);
    KindergartenModule.place_students(students, 4);
 });
