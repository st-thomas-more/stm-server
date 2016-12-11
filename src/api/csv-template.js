import resource from 'resource-router-middleware'
import { resolve } from 'path'
export default ({ config, db }) => resource({

  /** GET / - Return the template */
  list(req, res) {
    const options = {
      dotfiles: 'allow',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
    res.sendFile(resolve('src/services/upload/grade-template.csv'), options, function (err) {
      if (err) {
        console.log(err)
        res.status(err.status).send()
      }
    })
  }
})