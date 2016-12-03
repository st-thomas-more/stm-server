import resource from 'resource-router-middleware'
import { incrementDashYear } from '../daos/current-year-dao'

export default ({ config, db }) => resource({
	/** PUT / - Go to the next year */
	create(req, res) {
			incrementDashYear(db).then(() => {
						res.sendStatus(200)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
		}
})
