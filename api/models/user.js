const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, {
    instanceMethods: {
      toJSON: function () {
        var values = Object.assign({}, this.get())

        delete values.password
        return values
      }
    },
    classMethods: {
      // associate: function(models) {
      //   User.hasMany(models.Task)
    }
  }, {

  })

  User.beforeCreate((data, options, next) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err)
      }

      bcrypt.hash(data.dataValues.password, salt, (err, hash) => {
        if (err) {
          return next(err)
        }

        data.dataValues.password = hash

        return next()
      })
    })
  })

  return User
}
