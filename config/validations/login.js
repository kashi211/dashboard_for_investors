module.exports = function(req,res){
	req.assert('email', 'Email Invalid').isEmail();
	var validateErros = req.validationErrors() || [];
	if(validateErros.length > 0){
		validateErros.forEach(function(e){
			req.flash('error in Email', e.msg);
		});
		return false;
	} else {
		return true;
	}
};
