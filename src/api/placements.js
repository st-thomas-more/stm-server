import resource from 'resource-router-middleware'
import * as placementDao from '../daos/placement-dao'
import placeKindergarten from '../services/placement-algorithms/kindergarten-placement'
import placeThird from '../services/placement-algorithms/third-placement'
import placeSixth from '../services/placement-algorithms/sixth-placement'

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id: 'grade',

	/** GET /:id - Return a given entity */
	read(req, res) {
		switch (parseInt(req.params.grade)) {
			case 0:
				placementDao.getKindergartenPlacement()
					.then(placement => {
						res.status(200).json(placement)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
				break
			case 3:
				placementDao.getThirdPlacement()
					.then(placement => {
						res.status(200).json(placement)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
				break
			case 6:
				placementDao.getSixthPlacement()
					.then(placement => {
						res.status(200).json(placement)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
				break
			default:
				res.sendStatus(404)
		}
	},
	/** PUT /:id - Run the algorithm */
	update(req, res) {
		switch (parseInt(req.params.grade)) {
			case 0:
				placeKindergarten()
					.then(() => {
						res.sendStatus(200)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
				break
			case 3:
				placeThird()
					.then(() => {
						res.sendStatus(200)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
				break
			case 6:
				placeSixth()
					.then(() => {
						res.sendStatus(200)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
				break
			default:
				res.sendStatus(404)
		}
		},
		/** DELETE /:id - Delete a given entity */
		delete(req, res) {
		switch (parseInt(req.params.grade)) {
			case 0:
				placementDao.deleteKindergartenPlacement()
					.then(() => {
						res.sendStatus(204)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
				break
			case 3:
				placementDao.deleteThirdPlacement()
					.then(() => {
						res.sendStatus(204)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
				break
			case 6:
				placementDao.deleteSixthPlacement()
					.then(() => {
						res.sendStatus(204)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
				break
			default:
				res.sendStatus(404)
		}
		}
})
