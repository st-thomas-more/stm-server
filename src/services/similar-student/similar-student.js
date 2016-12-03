export default function similarStudent(student, section) {
	return new Promise((resolve, reject) => {
		let swapStudent = student, swapSection = section, similarStudents = []

		for (let i = 0; i < swapSection.students.length; i++) {
			swapSection.students[i].dif = Math.abs(swapStudent.weightedScore - swapSection.students[i].weightedScore)
			if (swapStudent.sex === swapSection.students[i].sex)
				similarStudents.push(swapSection.students[i])
		}
		if (similarStudents.length > 0) {
			similarStudents.sort((a, b) => { return b.dif - a.dif })
			resolve(similarStudents.slice(0, 5))
		} else {
			reject(new Error(`No similar students found for ${student.firstName} ${student.lastName}`))
		}
	})
}