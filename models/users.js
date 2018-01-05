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
    online: DataTypes.BOOLEAN
  });

  return Users;
};
