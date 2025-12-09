const Bid = {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  auction_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'Auctions',
      key: 'id'
    }
  },
  bidder_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'Professional',
      key: 'id'
    }
  },
  amount: {
    type: 'DECIMAL(10,2)',
    allowNull: false
  },
  is_autobid: {
    type: 'BOOLEAN',
    defaultValue: false,
    allowNull: false,
    note: 'Enchère automatique'
  },
  max_autobid_amount: {
    type: 'DECIMAL(10,2)',
    allowNull: true,
    note: 'Montant max pour enchère auto'
  },
  is_winning: {
    type: 'BOOLEAN',
    defaultValue: false,
    allowNull: false
  },
  bid_time: {
    type: 'TIMESTAMP',
    defaultValue: 'now()',
    allowNull: false
  }
};

module.exports = Bid;