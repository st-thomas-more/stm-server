import resource from 'resource-router-middleware'
import kindergarten_placement from '../services/KindergartenSort.js'

export default ({ config, db }) => resource({

	id: 'grade',
	/** GET /:id - Return a given entity */
	read(req, res) {
		
		//unused option for now
		var option = req.query.option
		if(option === undefined){
			option = 'doesnt exist!'
		}

		switch(parseInt(req.params.grade)){
			case 0:
				res.json(kindergarten_placement())
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
				//bad grade given
				res.sendStatus(400)
		}
	},
	//TODO: save the classes to the database for future use
	/** PUT /:id - Update a given entity */
	/*update({ facet, body }, res) {
		for (let key in body) {
			if (key!=='id') {
				facet[key] = body[key]
			}
		}
		res.sendStatus(204)
	},*/
})
