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

  /** POST / - Run the algorithm */
  create(req, res) {
    switch (parseInt(req.body.grade)) {
      case 0:
        placeKindergarten(db)
          .then(() => {
            console.log('in then for kindergarten-placement')
            res.sendStatus(200)
          })
          .catch(err => {
            console.error(err)
            res.sendStatus(404)
          })
        break
      case 1: case 2: case 3:
        placeThird(parseInt(req.params.grade), db)
          .then(() => {
            res.sendStatus(200)
          })
          .catch(err => {
            console.error(err)
            res.sendStatus(404)
          })
        break
      case 4: case 5: case 6:
        placeSixth(parseInt(req.params.grade), db)
          .then(() => {
            res.sendStatus(200)
          })
          .catch(err => {
            console.error(err)
            res.sendStatus(404)
          })
        break
      case 7:
        placeSeventh(db)
          .then(() => {
            res.sendStatus(200)
          })
          .catch(err => {
            console.error(err)
            res.sendStatus(404)
          })
        break
      case 8:
        placeEigth(db)
          .then(() => {
            res.sendStatus(200)
          })
          .catch(err => {
            console.error(err)
            res.sendStatus(404)
          })
        break
      default:
        console.log('NOT FOUND- in update placements.js')
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
  },

	/** GET /:id - Return a given entity */
	read(req, res) {
		const grade = parseInt(req.params.grade)
		if (grade >= 0 && grade <= 8) {
			placementDao.getPlacement(grade, db)
				.then(placement => {
					placement.sections.forEach(section => {
						section.students.sort((a, b) => { return a.lastName.localeCompare(b.lastName) })
					})
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
		const placement = req.body
		placement.sections.forEach(section => {
			section.students.sort((a, b) => { return a.lastName.localeCompare(b.lastName) })
		})
		placementDao.savePlacement(placement, db).then(placement => {
				res.status(200).json(placement)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
		})
	}
})
