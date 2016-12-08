import resource from 'resource-router-middleware'
import { incrementYear, decrementYear } from '../daos/current-year-dao'

export default ({ config, db }) => resource({

	/** POST / - Go to the next year */
	create(req, res) {
		let increment = false
		if(req.body.increment === 'Y')
			increment = true
		if(increment){
			console.log('here')
			incrementYear(db).then(() => {
				res.sendStatus(200)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
		} else{
			decrementYear(db).then(() => {
							res.sendStatus(200)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
		}
	}


})
