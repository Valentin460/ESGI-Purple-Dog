const Transaction = {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  item_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'Item',
      key: 'id'
    }
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
  buyer_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'Professional',
      key: 'id'
    }
  },
  item_price: {
    type: 'DECIMAL(10,2)',
    allowNull: false
  },
  platform_fee_seller: {
    type: 'DECIMAL(10,2)',
    allowNull: false,
    note: '2% commission vendeur'
  },
  platform_fee_buyer: {
    type: 'DECIMAL(10,2)',
    allowNull: false,
    note: '3% commission acheteur'
  },
  shipping_cost: {
    type: 'DECIMAL(10,2)',
    allowNull: false
  },
  total_buyer_pays: {
    type: 'DECIMAL(10,2)',
    allowNull: false
  },
  total_seller_receives: {
    type: 'DECIMAL(10,2)',
    allowNull: false
  },
  status: {
    type: 'ENUM',
    values: ['pending_payment', 'payment_received', 'funds_held', 'shipped', 'delivered', 'funds_released', 'completed', 'refunded', 'cancelled'],
    allowNull: false
  },
  stripe_payment_intent_id: {
    type: 'VARCHAR(255)',
    allowNull: true
  },
  funds_held_at: {
    type: 'TIMESTAMP',
    allowNull: true,
    note: 'Fonds bloqués jusqu\'à signature'
  },
  funds_released_at: {
    type: 'TIMESTAMP',
    allowNull: true,
    note: 'Libération 3-5 jours après signature'
  },
  created_at: {
    type: 'TIMESTAMP',
    defaultValue: 'now()',
    allowNull: false
  }
};

module.exports = Transaction;