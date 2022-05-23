module.exports = function(app) {
	var validation = require('../config/validations/users');
	var user = app.models.users;

	var UserController = {
		index: function(req,res){
			user.find(function(err, data){
				if(err){
					req.flash('error', 'Error  '+err);
					res.redirect('/user');
				} else {
					res.render('user/index', {lista:data, logged_id: req.session.user._id});
				}
			});
		},
		register: function(req,res){
			res.render('user/register');
		},
		post: function(req,res){
			if(validation(req,res)){
				var model      = new user();
				model.name     = req.body.name;
				model.username = req.body.username;
				model.email    = req.body.email;
				model.date 	   = Date.now();
				model.password = model.generateHash(req.body.password);
				user.findOne({'email': model.email},function(err,dados){
					if(dados){
						req.flash('error', 'Error');
						res.render('user/register', {dados:model});
					} else {
						model.save(function(err){
							if(err){
								req.flash('error', 'Error  '+err);
								res.render('user/register',{
									user: req.body
								});
							} else {
								req.flash('info', 'Investor registered');
								res.redirect('/login');
							}
						});
					}
				});
				
			} else {
				res.render('user/register', {dados: req.body});
			}
			

		},
		profile: function(req,res){
			user.findById(req.params.id, function(err,dados){
				if(err){
					req.flash('error', 'Error '+err);
					res.redirect('/user');
				} else{
					res.render('user/profile', {dados:dados});

				}
			});
		},
		delete: function(req, res){
			user.remove({
				_id: req.params.id
			}, function(err){
				if(err){
					req.flash('error', 'Error  '+err);
					res.redirect('/user');
				} else {
					req.flash('info', 'success');
					res.redirect('/user');
				}
			});
		},
		edit: function(req,res){
			user.findById(req.params.id, function(err, data){
				if(err){
					req.flash('error', 'Error '+err);
					res.redirect('/user');
				} else {
					req.flash('info', 'success!');
					res.render('user/edit', {dados:data} );
				}
			});
		},
		update: function(req,res){
			user.findById(req.params.id, function(err, data){
				var model = data;
				model.name = req.body.name;
				model.username = req.body.username;
				model.save(function(err){
				if(err){
					req.flash('error', 'Error '+err);
					res.render('user/edit', {dados:model});
				} else {
					req.flash('info', 'success');
					res.redirect('/user' );
				}
				});

			});
		}
	};

	return UserController;
};