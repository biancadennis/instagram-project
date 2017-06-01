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
		// body: {
		// 	type:      DataTypes.TEXT,
		// 	allowNull: false,
		// 	validate: {
		// 		notEmpty: {
		// 			msg: 'Body is required'
		// 		}
		// 	}
		// },
		imageFilename: {
			type:         DataTypes.STRING,
			allowNull:    false,
			defaultValue: '',
			validate: {
				notEmpty: {
					msg: 'Image is required'
				}
			}
		}
	}, {
		defaultScope: {
			order: [['createdAt', 'DESC']]
		},
	  getterMethods: {
			url: function() {
				return(`/user/${this.photoID}`);
			},
			imageUrl: function() {
				return(`/images/photos/${this.imageFilename}`);
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
						photoID: photoID
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