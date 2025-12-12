const Auction = {
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
  starting_price: {
    type: 'DECIMAL(10,2)',
    allowNull: false,
    note: 'Par défaut -10% du prix souhaité'
  },
  reserve_price: {
    type: 'DECIMAL(10,2)',
    allowNull: false,
    note: 'Prix minimum pour vendre'
  },
  current_price: {
    type: 'DECIMAL(10,2)',
    allowNull: false
  },
  increment_step: {
    type: 'DECIMAL(10,2)',
    allowNull: false,
    note: 'Palier d\'enchère'
  },
  start_time: {
    type: 'TIMESTAMP',
    allowNull: false
  },
  end_time: {
    type: 'TIMESTAMP',
    allowNull: false
  },
  extended_end_time: {
    type: 'TIMESTAMP',
    allowNull: true,
    note: 'Extension +10min si enchère à H-1'
  },
  winner_id: {
    type: 'INTEGER',
    allowNull: true,
    foreignKey: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  status: {
    type: 'ENUM',
    values: ['pending', 'active', 'extended', 'completed', 'no_winner', 'cancelled'],
    allowNull: false
  },
  created_at: {
    type: 'TIMESTAMP',
    defaultValue: 'now()',
    allowNull: false
  }
};

module.exports = Auction;