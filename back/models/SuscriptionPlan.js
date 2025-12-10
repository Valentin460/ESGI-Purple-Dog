const SubscriptionPlan = {
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
//   user_type: {
//     type: 'ENUM',
//     values: ['individual', 'professional', 'admin'],
//     allowNull: false
//   },
  price: {
    type: 'DECIMAL(10,2)',
    allowNull: false
  },
  billing_period: {
    type: 'VARCHAR(20)',
    allowNull: true,
    note: 'monthly, yearly'
  },
  features: {
    type: 'JSON',
    allowNull: true,
    note: 'Fonctionnalités incluses'
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
  },
  updated_at: {
    type: 'TIMESTAMP',
    defaultValue: 'now()',
    allowNull: false
  }
};

module.exports = SubscriptionPlan;