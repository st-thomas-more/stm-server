import resource from 'resource-router-middleware'
import similarStudent from '../services/similar-student/similar-student'

export default ({ config, db }) => resource({
	
	/** GET / - get section and student for use in similar student function */
	create(req, res) {
		console.log("here")
		const { student, section } = req.body
		let list = similarStudent(student, section)
			.then(() => { // this isnt a thing
				res.status(200).json(similarStudents)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	}
})