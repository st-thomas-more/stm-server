import resource from 'resource-router-middleware'
import * as studentDAO from '../daos/student-dao'

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id: 'studentID',

	/** GET / - Return all students */
	list(req, res) {
		studentDAO.getStudents(db)
			.then(students => {
				res.status(200).json(students)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	},
	
	/** GET /:studentID - Return a given student */
	read(req, res) {
		studentDAO.getStudent(req.params.studentID, db)
			.then(student => {
				res.status(200).json(student)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	},

	/** POST - Create a new student */
	create(req, res) {
		studentDAO.createStudent(req.body.student, db)
			.then(() => {
				res.sendStatus(201)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	},

	/** PUT / - Update a students info, this expects a json object of all of the students data */
	update(req, res) {
		studentDAO.updateStudent(req.body.student, db)
			.then(() => {
				res.sendStatus(200)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	},

	/** DELETE /:studentID - Delete a given student based on their id */
	delete(req, res) {
		studentDAO.deleteStudent(req.params.studentID, db)
			.then(() => {
				res.sendStatus(204)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	}
})
