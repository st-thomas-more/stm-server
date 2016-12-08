import resource from 'resource-router-middleware'
import { incrementYear, decrementYear, getDashYear } from '../daos/current-year-dao'

export default ({ config, db }) => resource({

	/** POST / - Go to the next year */
	create(req, res) {
		let increment = null
		if(req.body.increment === 'Y')
			increment = true
		else if(req.body.increment === 'N')
			increment = false
		else if(increment == null){
			console.error('ERROR: unexpected body arguments , expect Y/N')
			res.sendStatus(404)
			return
		}
		if(increment){
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
	},


	/** GET get the current year */
	list(req, res){
		getDashYear(db).then(year=>{
			res.status(200).json(year)
		}).catch(err=>{
			console.error(err)
			res.sendStatus(404)
		})
	}


})
