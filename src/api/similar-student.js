import resource from 'resource-router-middleware'
import similarStudent from '../services/similar-student/similar-student'

export default ({ config, db }) => resource({
	
	/** GET / - get section and student for use in similar student function */
	create(req, res) {
		const { student, section } = req.body
		let list = similarStudent(student, section)
		if (list.length > 0){
			res.status(200).json(list)
		}else{
			res.sendStatus(404)
		}
	}
})