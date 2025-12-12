const Notification = {
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
      model: 'User',
      key: 'id'
    }
  },
  type: {
    type: 'ENUM',
    values: ['new_offer', 'new_bid', 'outbid', 'auction_won', 'auction_lost', 'item_sold', 'payment_received', 'shipment_update', 'new_message', 'account_update'],
    allowNull: false
  },
  title: {
    type: 'VARCHAR(255)',
    allowNull: false
  },
  content: {
    type: 'TEXT',
    allowNull: false
  },
  related_item_id: {
    type: 'INTEGER',
    allowNull: true,
    foreignKey: true,
    references: {
      model: 'Item',
      key: 'id'
    }
  },
  related_auction_id: {
    type: 'INTEGER',
    allowNull: true,
    foreignKey: true,
    references: {
      model: 'Auctions',
      key: 'id'
    }
  },
  related_transaction_id: {
    type: 'INTEGER',
    allowNull: true,
    foreignKey: true,
    references: {
      model: 'Transaction',
      key: 'id'
    }
  },
  is_read: {
    type: 'BOOLEAN',
    defaultValue: false,
    allowNull: false
  },
  is_email_sent: {
    type: 'BOOLEAN',
    defaultValue: false,
    allowNull: false
  },
  created_at: {
    type: 'TIMESTAMP',
    defaultValue: 'now()',
    allowNull: false
  }
};

module.exports = Notification;