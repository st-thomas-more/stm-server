import resource from 'resource-router-middleware'

export default ({ config, db }) => resource({
	
	/** GET / - get section and student for use in similar student function */
	read(req, res) {
		req.body.section
		req.body.student
	}
})