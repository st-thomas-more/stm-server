import resource from 'resource-router-middleware'


'use strict';

var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
//var csv_parser = require('./csvParser');
var parse_csv = require('../services/csvUpload/testing_csvjson');


export default ({ config, db }) => resource({
	
	/** POST - Create a new upload */
	create(req, res) {

		var form = new formidable.IncomingForm();
    
    	form.multiples = true;
    	form.uploadDir = path.join(__dirname, '../services/csvUpload/uploads');
        //console.log(form.uploadDir);
      	form.on('file', function rename_file(field, file) {
        	fs.rename(file.path, path.join(form.uploadDir, file.name), parse_csv(null,file.path));
    	});

    	form.on('error', function(err) {
        	console.log('An error has occured: \n' + err);
    	});

    	form.on('end', function() {
        	res.end('success');
    	});
    	form.parse(req);
		}
})

/*
function pass_csv(form, cb) {
    reutrn new Promise (function (fulfill, reject){
            fs.rename(file.path, path.join(form.uploadDir, file.name), parse_csv(null, file.path){;
            var data = cb('../services/csvUpload/uploads'+file.name);
            //var csv_parser = require('./csvParser');
            //var data = csv_parser('./uploads/'+file.name);
            console.log(data);
        });
    }
}*/