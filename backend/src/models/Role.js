// models/role.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Role to Permission many-to-many relationship
      Role.belongsToMany(models.Permission, {
        through: 'role_permissions',
        as: 'permissions',
        foreignKey: 'role_id',
        otherKey: 'permission_id'
      });

      // Role to User many-to-many relationship
      Role.belongsToMany(models.User, {
        through: 'user_roles',
        as: 'users',
        foreignKey: 'role_id',
        otherKey: 'user_id'
      });
    }
  }

  Role.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
    underscored: true
  });

  return Role;
};

