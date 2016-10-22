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
        this.dob = parseInt(attributes.dob);
        this.dial4 = parseInt(attributes.dial4);
        this.behavior_observation = parseInt(attributes.behavior_observation);
        this.potential_delay = parseInt(attributes.potential_delay);
        this.sex = attributes.sex;
        this.homeroom_teacher = attributes.homeroom_teacher
        this.yo = attributes.yo
        this.faculty_student = attributes.faculty_student
        this.advanced_math = attributes.advanced_math
        this.medical_concern = attributes.medical_concern
        this.support = attributes.support
        this.new_student = attributes.new_student
        this.behavior = parseInt(attributes.behavior)
        this.work_habits = parseInt(attributes.work_habits)
        this.dra = parseInt(attributes.dra)
        this.wtw_book = attributes.wtw_book
        this.sort_attr = parseInt(attributes.sort_attr)
        this.raz = attributes.raz
        this.ge = parseFloat(attributes.ge)
        this.math_benchmark = parseInt(attributes.math_benchmark)
        this.dibels = parseInt(attributes.dibels)
        this.ela = parseInt(attributes.ela)
        this.extended_ela = parseInt(attributes.extended_ela)
        this.math_total = parseInt(attributes.math_total)
        this.comments = attributes.comments
    }

    toString(){
        return ("Name: " + this.firstname + " " + this.lastname + " DOB: " + this.dob + " Dial4: " +
                this.dial4 + " BO: " + this.behavior_observation +
                " potential_delay: " + this.potential_delay + " sex: " + this.sex);
    }

}

module.exports.Student = Student