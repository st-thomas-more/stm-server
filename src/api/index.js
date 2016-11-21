import { version } from '../../package.json'
import { Router } from 'express'
import placements from './placements'
import sections from './sections'
import grades from './grades'
import students from './students'
import similar-student from './similar-student'

export default ({ config, db }) => {
	let api = Router()

	api.use('/placements', placements({ config, db }))
	api.use('/placements/similar-student', similar-student({ config, db }))
	api.use('/sections', sections({ config, db }))
	api.use('/grades', grades({ config, db }))
	api.use('/students', students({ config, db }))
	
	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version })
	})
	return api
}
