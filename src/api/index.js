import { version } from '../../package.json'
import { Router } from 'express'
import facets from './facets'
import placements from './placements'
import sections from './sections'
import grades from './grades'
import students from './students'

export default ({ config, db }) => {
	let api = Router()

	api.use('/facets', facets({ config, db }))
	api.use('/placements', placements({ config, db }))
	api.use('/sections', sections({ config, db }))
	api.use('/grades', grades({ config, db }))
	api.use('/students', students({ config, db }))
	
	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version })
	})
	return api
}
