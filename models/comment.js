module.exports = function(sequelize, DataTypes) {
  return(sequelize.define('comment', {
    body: {
      type:      DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Body is required'
        }
      }
    },
    author: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Author is required'
        }
      }
    },
  }, {
    defaultScope: {
      order: [['createdAt', 'DESC']]
    },
    classMethods: {
      associate: function(models) {
        models.comment.belongsTo(models.photo);
      }
    }
  }));
};