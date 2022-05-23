var url = require('url');

module.exports = function(req,res,app){
	var createUrl = url.parse(req.url).pathname == "/register";
	var updateUrl = !createUrl;

	req.assert('name', "Provide name").notEmpty();


	if(createUrl){
		req.assert('email', 'invalid email').isEmail();
		req.assert('password', 'not acceptable password').isLength({ min: 8 });
	}
	var validateErros = req.validationErrors() || [];

	if(req.body.password != req.body.passwordconfirmed){
		validateErros.push({msg: 'could not confirm password'});
	}

	if(validateErros.length > 0){
		validateErros.forEach(function(e){
			req.flash('error', e.msg);
		});
		return false;
	} else {
		return true;
	}


}
