import resource from 'resource-router-middleware'
import * as staffDAO from '../daos/staff-dao'

export default ({config, db}) => resource({
	/** Property name to store preloaded entity on `request`. */
	id: 'emailID',
	
	/** GET / - Return all teachers with their given section */
	list(req, res) {
		staffDAO.getAllStaff(db)
			.then(staff => {
				res.status(200).json(staff)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	}, 

	/** GET /:teacherID - Return a given teacher */
	read(req, res) {
		staffDAO.getStaff(req.params.emailID, db)
			.then(staff => {
				res.status(200).json(staff)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	},

	/** POST - Create a new teacher */
	create(req, res) {
		staffDAO.createStaff(req.body.staff, db)
			.then(() => {
				res.sendStatus(201)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	},


	/** DELETE /:teachersID - Delete a given teacher based on their email */
	delete(req, res) {
		staffDAO.deleteStaff(req.params.emailID, db)
			.then(() => {
				res.sendStatus(204)
			})
			.catch(err => {
				console.error(err)
				res.sendStatus(404)
			})
	}

})