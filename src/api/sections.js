import resource from 'resource-router-middleware'
import * as sectionsDao from '../daos/sections-dao'

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id: 'section',

	/** GET /:id - Return a given entity */
	read(req, res) {
		const section = parseInt(req.params.section)
			sectionsDao.getSection(section)
				.then(sec => {
					res.status(200).json(sec)
				})
				.catch(err => {
					console.error(err)
					res.sendStatus(404)
				})
	}
})