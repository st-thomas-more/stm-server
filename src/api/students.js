import resource from 'resource-router-middleware'
import * as studentsDao from '../daos/student-dao'

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id: 'studentID',

	/** GET /:id - Return a given student */
	read(req, res) {
		const studentID = parseInt(req.params.studentID)
		if (studentID >= 0) {
			studentsDao.getStudent(studentID)
				.then(student => {
					res.status(200).json(student)
				})
				.catch(err => {
					console.error(err)
					res.sendStatus(404)
				})
		} else {
			res.sendStatus(404)
		}
	},

	/** POST - Create a new student */
	create(req, res) {
		studentsDao.createStudent(req.body.student)
			.then(() => {
				res.sendStatus(200)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	},

	/** PUT /:id - update a students info, this expects a json object of all of the students data */
	update(req, res) {
		const studentID = req.body.student.id
		if (studentID >= 0) {
			studentsDao.updateStudent(req.body.student)
				.then(() => {
					res.sendStatus(200)
				})
				.catch(err => {
					console.error(err)
					res.sendStatus(404)
				})
		} else {
			res.sendStatus(404)
		}
	},

	/** DELETE /:id - Delete a given student based on their id */
	delete(req, res) {
		const studentID = parseInt(req.params.studentID)
		if (studentID > 0) {
			studentsDao.deleteStudent(studentID)
				.then(() => {
					res.sendStatus(200)
				})
				.catch(err => {
					console.error(err)
					res.sendStatus(404)
				})
		} else {
			res.sendStatus(404)
		}
	}
})
