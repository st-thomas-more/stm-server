import resource from 'resource-router-middleware'
import formidable from 'formidable'
import * as fs from 'fs'
import parse_csv from '../services/upload/parseCSV'
import path from 'path'


export default ({config, db}) => resource({

  /** POST - Create a new upload */
  create(req, res) {

    let form = new formidable.IncomingForm()

    form.multiples = true
    form.uploadDir = path.join(__dirname, '../services/upload/uploads')

    form.on('file', function rename_file(field, file) {
      fs.renameSync(file.path, path.join(form.uploadDir, file.name))

      parse_csv(path.join(form.uploadDir, file.name), db)
    })

    form.on('error', function (err) {
      console.error(err)
      res.sendStatus(404)
    })

    form.on('end', function () {
      res.end('success')
    })

    form.parse(req)
  }
})
