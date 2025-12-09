const User = {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  email: {
    type: 'VARCHAR(255)',
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: 'VARCHAR(255)',
    allowNull: false
  },
  user_type: {
    type: 'ENUM',
    values: ['admin', 'individual', 'professional'], // À adapter selon tes besoins
    allowNull: false
  },
  is_verified: {
    type: 'BOOLEAN',
    defaultValue: false,
    allowNull: false
  },
  is_active: {
    type: 'BOOLEAN',
    defaultValue: true,
    allowNull: false
  },
  verification_token: {
    type: 'VARCHAR(255)',
    allowNull: true
  },
  created_at: {
    type: 'TIMESTAMP',
    defaultValue: 'now()',
    allowNull: false
  },
  updated_at: {
    type: 'TIMESTAMP',
    defaultValue: 'now()',
    allowNull: false
  }
};

module.exports = User;