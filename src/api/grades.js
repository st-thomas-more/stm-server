import resource from 'resource-router-middleware'
import * as gradeDao from '../daos/grade-dao'

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id: 'grade',
	
	list(req, res){
		gradeDao.get()
			.then(g => {
				res.status(200).json(g)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	},
	
	/** GET /:id - Return a given entity */
	read(req, res) {
		const grade = parseInt(req.params.grade)
		if (grade >= 0 && grade <= 8) {
			gradeDao.get(grade)
				.then(g => {
					res.status(200).json(g)
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

