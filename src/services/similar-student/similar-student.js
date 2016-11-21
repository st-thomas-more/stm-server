
export default function similarStudent(student, section){

	let swapStudent = student
	let swapSection = section
	
	let similarStudents = []
	
	for ( let i = 0; i < swapSection.length; i++ ){
		swapSection.students[i].dif =  Math.abs(swapStudent.weightedScore - swapSection.students[i].weightedScore)
		if(swapStudent.sex === swapSection.students[i].sex)
			similarStudents.push(swapSection.students[i])
	}
	
	similarStudents.sort((a, b) => { return b.dif - a.dif})
	
	similarStudents = similarStudents.slice(0,5)
	
	return similarStudents
}