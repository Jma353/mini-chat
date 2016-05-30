'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

require('sequelize-isunique-validator')(Sequelize);

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});



// ASSOCIATIONS
// Pulling user from session 
sequelize.models.session.belongsTo(sequelize.models.user, { foreignKey: 'userId', as: 'character' }); 
// Pulling user from participant 
sequelize.models.participant.belongsTo(sequelize.models.user, { foreignKey: 'userId', as: 'user' }); 
// Pulling chat from participant 
sequelize.models.participant.belongsTo(sequelize.models.chat, { foreignKey: 'chatId', as: 'chat' });
// Pulling participants from chat 
sequelize.models.chat.hasMany(sequelize.models.participant)
// Two-way association between users + chats 
sequelize.models.chat.belongsToMany(sequelize.models.user, { through: 'participant' }); 
sequelize.models.user.belongsToMany(sequelize.models.chat, { through: 'participant' }); 



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;




