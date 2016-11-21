import resource from 'resource-router-middleware'
import similarStudent from '../services/similar-student/similar-student'

export default ({ config, db }) => resource({
	
	/** GET / - get section and student for use in similar student function */
	read(req, res) {
		const { student, section } = req.body
		similarStudent(student, section)
			.then(() => {
				res.status(200).json(similarStudent)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	}
})