import resource from 'resource-router-middleware'
import kindergartenSort from '../services/sorting-algorithms/kindergarten-sort.js'

export default ({ config, db }) => resource({
	
	/** Property name to store preloaded entity on `request`. */
	id: 'grade',
	
	/** GET /:id - Return a given entity */
	read(req, res) {	
		switch(parseInt(req.params.grade)){
			case 0:
				kindergartenSort()
					.then(result => {
						res.status(200).json(result)
					})
					// .catch(err => {
					// 	res.status(500).send(err)
					// })
				break
			case 1:
			case 2:
			case 3:
				res.json('first through third grade not implemented yet')
				break
			case 4:
			case 5:
			case 6:
				res.json('fourth through sixth grade not implemented yet')
				break
			case 7:
				res.json('seventh grade not implemented yet')
				break
			case 8:
				res.json('eighth grade not implemented yet')
				break
			default:
				res.sendStatus(404)
		}
	},
	/** POST / - Run the algorithm */
	create({ body }, res) {
		kindergartenSort()
		.then(res.sendStatus(200))
		.catch(res.sendStatus(500))
	},

	/** PUT /:id - Update a given entity */
	update({ facet, body }, res) {
		for (let key in body) {
			if (key!=='id') {
				facet[key] = body[key]
			}
		}
		res.sendStatus(204)
	},

	/** DELETE /:id - Delete a given entity */
	delete({ facet }, res) {
		facets.splice(facets.indexOf(facet), 1)
		res.sendStatus(204)
	}
})
