import resource from 'resource-router-middleware'
import similarStudent from '../services/similar-student/similar-student'

export default ({ config, db }) => resource({

  /** POST / - get section and student for use in similar student function */
  create(req, res) {
    const { student, section } = req.body
    similarStudent(student, section)
      .then(similarStudents => {
        res.status(200).json(similarStudents)
      })
      .catch(err => {
        console.error(err)
        res.sendStatus(404)
      })
  }
})