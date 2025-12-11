const Subscription = {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'Professional',
      key: 'id'
    }
  },
  plan_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'SubscriptionPlan',
      key: 'id'
    }
  },
  status: {
    type: 'ENUM',
    values: ['trial', 'active', 'past_due', 'canceled', 'expired'],
    allowNull: false
  },
  started_at: {
    type: 'TIMESTAMP',
    allowNull: false
  },
  ends_at: {
    type: 'TIMESTAMP',
    allowNull: true
  },
  trial_ends_at: {
    type: 'TIMESTAMP',
    allowNull: true,
    note: '1 mois gratuit pour pros'
  },
  stripe_subscription_id: {
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

module.exports = Subscription;