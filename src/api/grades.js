import resource from 'resource-router-middleware'
import * as gradeDao from '../daos/grade-dao'

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

