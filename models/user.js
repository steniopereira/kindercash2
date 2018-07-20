module.exports = function(sequelize, Sequelize) {

	var User = sequelize.define('user', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
		firstname: { type: Sequelize.STRING,notEmpty: true},
		lastname: { type: Sequelize.STRING,notEmpty: true},
		username: {type:Sequelize.TEXT},
		about : {type:Sequelize.TEXT},
		email: { type:Sequelize.STRING, validate: {isEmail:true} },
		phone: { type:Sequelize.STRING, validate: {isPhone:true} },
		password : {type: Sequelize.STRING,allowNull: false }, 
		last_login: {type: Sequelize.DATE},
		status: {type: Sequelize.ENUM('active','inactive'),defaultValue:'active' },
		gender: Sequelize.STRING,
		imgage: Sequelize.STRING,
		user_type: Sequelize.STRING,
		address: Sequelize.STRING,
		city: Sequelize.STRING,
		state: Sequelize.STRING,
		zip_code: Sequelize.STRING,
		group_id: Sequelize.STRING

});

	return User;

}