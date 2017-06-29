var parser = require('rss-parser')

const ParseController = {}

ParseController.find = (req, res) => {
	let params = req.query

	console.log(params)
	
	parser.parseURL(params.url, function(err, parsed) {
		if (err) {
			return res.status(501).json({
				error: err
			})
		}
		if (parsed) {
			return res.status(200).json({
				data: parsed.feed
			})
		}	
	})
  
}

module.exports = ParseController
