var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    homeAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    activeLocation: DataTypes.STRING
  });

  Users.validatePassword = function(password, passwd, done, user) {
    bcrypt.compare(password, passwd, function(err, isMatch) {
      if (err) {
        done(err, false, { message: 'Server error' });
      }
      else if (isMatch) {
        done(null, user, { message: 'Everything Worked' });
      }
      else if (!isMatch) {
        done(null, user, { message: "Pretty sure the passwords didn't match" });
      }
      else {
        done(null, false);
      }
    })
  };

  Users.beforeCreate(function(user, options) {
    return cryptPassword(user.password)
      .then(success => {
        user.password = success;
      })
      .catch(err => {
        if (err) console.log(err);
      });
  });

  function cryptPassword(password) {
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(10, function(err, salt) {
        if (err) return reject(err);
        bcrypt.hash(password, salt, null, function(err, hash) {
          if (err) return reject(err);
          return resolve(hash);
        });
      });
    });
  }

  return Users;
};
