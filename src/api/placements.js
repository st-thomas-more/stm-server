import resource from 'resource-router-middleware'
import * as placementDao from '../daos/placement-dao'
import placeKindergarten from '../services/placement-algorithms/kindergarten-placement'
import placeThird from '../services/placement-algorithms/third-placement'
import placeSixth from '../services/placement-algorithms/sixth-placement'
import placeSeventh from '../services/placement-algorithms/seventh-placement'
import placeEigth from '../services/placement-algorithms/eigth-placement'

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id: 'grade',

	/** GET /:id - Return a given entity */
	read(req, res) {
		const grade = parseInt(req.params.grade)
		if (grade >= 0 && grade <= 8) {
			placementDao.getPlacement(grade)
				.then(placement => {
					res.status(200).json(placement)
				})
				.catch(err => {
					console.error(err)
					res.sendStatus(404)
				})
		} else {
			res.sendStatus(404)
		}
	},
	/** PUT /:id - Update the placement */
	update(req, res) {
		const grade = parseInt(req.params.grade)
		const { placement } = req.body
		placementDao.savePlacement(grade, placement).then(() => {
				res.sendStatus(200)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
		})
	},

	/** POST - Run the algorithm
		Grade is given as a JSON object in the body */
	create(req, res) {
		console.log('running algorithm for grade ' + req.body.grade)
		switch (parseInt(req.body.grade)) {
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
			case 7:
				placeSeventh()
					.then(() => {
						res.sendStatus(200)
					})
					.catch(err => {
						console.error(err)
						res.sendStatus(404)
					})
				break
			case 8:
				placeEigth()
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
		const grade = parseInt(req.params.grade)
		if (grade >= 0 && grade <= 8) {
			placementDao.deletePlacement(grade)
				.then(() => {
					res.sendStatus(204)
				})
				.catch(err => {
					console.error(err)
					res.sendStatus(404)
				})
		} else {
			res.sendStatus(404)
		}
	}
})
