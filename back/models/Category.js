const Category = {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: 'VARCHAR(100)',
    allowNull: false
  },
  slug: {
    type: 'VARCHAR(100)',
    unique: true,
    allowNull: false
  },
  description: {
    type: 'TEXT',
    allowNull: true
  },
  is_active: {
    type: 'BOOLEAN',
    defaultValue: true,
    allowNull: false
  },
  created_at: {
    type: 'TIMESTAMP',
    defaultValue: 'now()',
    allowNull: false
  }
};

module.exports = Category;