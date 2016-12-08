/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status = 200) {
	return (err, thing) => {
		if (err) return res.status(500).send(err)

		if (thing && typeof thing.toObject === 'function') {
			thing = thing.toObject()
		}
		res.status(status).json(thing)
	}
}

export function shuffle(a) {
	for (let i = a.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[a[i - 1], a[j]] = [a[j], a[i - 1]]
	}
}


export function validateScore(key, val){
    if (typeof val === 'undefined' || val === null) {
      return 'success'
    } else if (isNaN(val)) {
      return 'error'
    } else if (typeof val === 'string') {
      if(!val)
        return 'success'
      else {
        val = parseInt(val,10)
        if(isNaN(val))
          return 'error'
      }
    } else if(!val){
      return 'error'
    }
    switch(key){
      case 'mathBench':
        if(val < 0 || val > 100)
          return 'error'
        else
          return 'success'
      case 'cogAT':
        if(val < 0 || val > 160)
          return 'error'
        else
          return 'success'
      case 'dra':
        if(val < 0 || val > 70)
          return 'error'
        else
          return 'success'
      case 'elaTotal':
        if(val < 0 || val > 100)
          return 'error'
        else
          return 'success'
      case 'mathTotal':
        if(val < 0 || val > 100)
          return 'error'
        else
          return 'success'
      case 'behaviorObservation':
        if(val < 0 || val > 54)
          return 'error'
        else
          return 'success'
      case 'dial4':
        if(val < 0 || val > 105)
          return 'error'
        else
          return 'success'
      default:
        return null
    }
  }
