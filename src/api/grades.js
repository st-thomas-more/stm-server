import resource from 'resource-router-middleware'
import * as gradeDao from '../daos/grade-dao'

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id: 'grade',

	/** GET / - Return all grades */
	list(req, res) {
		gradeDao.getGrades()
			.then(grades => {
				res.status(200).json(grades)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	},

	/** GET /:grade - Return grade by # */
	read(req, res) {
		gradeDao.getGrade(req.params.grade)
			.then(grade => {
				res.status(200).json(grade)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	}

})

