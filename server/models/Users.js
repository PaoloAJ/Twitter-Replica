module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Users.associate = (models) => {
    // Associating Users with Likes
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    // Associating Users with Posts
    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });
  };

  return Users;
};
