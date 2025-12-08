const Item = {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  seller_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  name: {
    type: 'VARCHAR(255)',
    allowNull: false
  },
  description: {
    type: 'TEXT',
    allowNull: false
  },
  dimensions: {
    type: 'VARCHAR(100)',
    allowNull: true,
    note: 'Dimensions en cm'
  },
  weight: {
    type: 'DECIMAL(10,2)',
    allowNull: true,
    note: 'Poids en kg'
  },
  desired_price: {
    type: 'DECIMAL(10,2)',
    allowNull: false
  },
  ai_suggested_price: {
    type: 'DECIMAL(10,2)',
    allowNull: true,
    note: 'Prix suggéré par IA'
  },
  sale_type: {
    type: 'ENUM',
    values: ['auction', 'quick_sale'],
    allowNull: false
  },
  status: {
    type: 'ENUM',
    values: ['draft', 'pending_validation', 'published', 'in_auction', 'sold', 'cancelled', 'expired'],
    allowNull: false
  },
  view_count: {
    type: 'INTEGER',
    defaultValue: 0,
    allowNull: false
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
  },
  published_at: {
    type: 'TIMESTAMP',
    allowNull: true
  },
  sold_at: {
    type: 'TIMESTAMP',
    allowNull: true
  }
};

module.exports = Item;