import { version } from '../../package.json'
import { Router } from 'express'
import placements from './placements'
import sections from './sections'
import grades from './grades'
import students from './students'
import upload from './upload'
import incrementYear from './increment-year'
import staff from './staff'
import csvTemplate from './csv-template'
import similarStudent from './similar-student'


export default ({ config, db }) => {
  let api = Router()

  api.use('/placements', placements({ config, db }))
  api.use('/students/similar-student', similarStudent({ config, db }))
  api.use('/sections', sections({ config, db }))
  api.use('/grades', grades({ config, db }))
  api.use('/students', students({ config, db }))
  api.use('/upload', upload({ config, db }))
  api.use('/increment-year', incrementYear({ config, db }))
  api.use('/staff', staff({ config, db }))
  api.use('/csv-template', csvTemplate({ config, db }))
  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({ version })
  })
  return api
}
