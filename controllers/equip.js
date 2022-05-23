module.exports = function(app){
	var equip = app.models.equip;
	var validacao = require('../config/validations/equip');
	var equipController = {
		index: function(req, res){
			equip.find(function(err,dados){
				if(err){
					req.flash('error', "Error "+ err);
					res.render('equip/index', {lista:null});
				}
				res.render('equip/index', {lista:dados});
			});
		},

		register: function(req,res){
			res.render('equip/register', {model: new equip()});
		},
		salvar: function(req,res){
			if(validacao(req,res)){
				var model = new equip(req.body);
				model.nserie = req.body.nserie;
				model.cnpj = req.body.cnpj;
				model.block = false;
				console.log(model.nserie);
				equip.findOne({'nserie': model.nserie}, function(err,dados){
					if(err){
						req.flash('error', "error "+err);
						res.render('/equip/register', {model:model});
					}else{
						model.save(function(err){
							if(err){
								req.flash('error', "Error "+err);
								res.redirect('/equip/register', {model:model});
							} else {
								req.flash('info', "investor registerd");
							}
						});
						req.flash('info', "success");
						res.redirect('/equip');

					}
				});
			} else {
				res.render('equip/register', {model:req.body});
			}
		},

		show: function(req, res){
			equip.findById(req.params.id, function(err,dados){
					if(err){
						req.flash('error', "error "+err);
						res.redirect('/equip');
					}else{
						res.render('equip/profile', {model:dados});

					}
			});
		},

		excluir: function(req,res){
			equip.remove({_id:req.params.id}, function(err){
					if(err){
						req.flash('error', "Error "+err);
						res.redirect('/equip');
					}else{
						req.flash('info', "investor registration success");
						res.redirect('/equip');

					}
			});
		},
		edit: function(req,res){
				equip.findById(req.params.id, function(err,dados){
					if(err){
						req.flash('error', "Error "+err);
						res.redirect('/equip');
					}else{
						req.flash('info', "success");
						res.render('equip/edit', {model:dados});

					}
				});
			},
		update: function(req,res){
			if(validacao(req,res)){
					equip.findById({_id:req.params.id}, function(err,dados){
					var model = dados;

					model.nserie = req.body.nserie;
					model.cnpj = req.body.cnpj;
					model.save(function(err){
					if(err){
						req.flash('error', "Error "+err);
						res.render('equip/edit', {model:model});
					}else{
						req.flash('info', "success");
						res.redirect('/equip');

					}
				});

				});
			} else {
				res.render('equip/edit', {model:req.body});
			}
		},

	};

	return equipController;
}
