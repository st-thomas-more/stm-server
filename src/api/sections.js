import resource from 'resource-router-middleware'
import * as sectionDAO from '../daos/section-dao'

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id: 'sectionID',

	/** GET /:sectionID - Return a given entity */
	read(req, res) {
		sectionDAO.getSection(req.params.sectionID, db)
			.then(section => {
				res.status(200).json(section)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	}
})
