export function getAge(dateString) {
	let today = new Date()
	let birthdate = new Date(dateString)
	let age = today.getFullYear() - birthdate.getFullYear()
	let months = (age * 12)
	let m = today.getMonth() - birthdate.getMonth()
	months += m
		
	return months
}