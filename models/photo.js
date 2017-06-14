module.exports = function(sequelize, DataTypes) {
	return(sequelize.define('photo', {
		caption: {
			type:      DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Caption is required'
				}
			}
		},
		hashtags: {
			type:      DataTypes.STRING,
			allowNull: true
		},
	}, {
		defaultScope: {
			order: [['createdAt', 'DESC']]
		},
	  getterMethods: {
			url: function() {
				return(`/users/${this.id}`);
			},
			imageUrl: function() {
				return(`https://s3.amazonaws.com/timber-nycda/photos/${this.id}`);
			},
			imageThumbnailUrl: function() {
				return(`${this.imageUrl}-thumbnail`);
			}
	  },
    classMethods: {
      associate: function(models) {
        models.photo.belongsTo(models.user);
        models.photo.hasMany(models.comment);
      },
			findWithPhotoID: function(photoID) {
				return(this.findOne({
					where: {
						id: photoID
					},
					include: [
						sequelize.models.user,
						sequelize.models.comment
					],
					order: [
						[sequelize.models.comment, 'createdAt', 'DESC']
					]
				}));
			}
    }
	}));
};
