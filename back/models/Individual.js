const Individual = {
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
  first_name: {
    type: 'VARCHAR(100)',
    allowNull: false
  },
  last_name: {
    type: 'VARCHAR(100)',
    allowNull: false
  },
  display_name: {
    type: 'VARCHAR(100)',
    allowNull: true,
    note: 'Prénom uniquement visible'
  },
  profile_picture: {
    type: 'VARCHAR(255)',
    allowNull: true
  },
  postal_address: {
    type: 'TEXT',
    allowNull: false
  },
  age_verified: {
    type: 'BOOLEAN',
    defaultValue: false,
    allowNull: false
  },
  over_18_certified: {
    type: 'BOOLEAN',
    defaultValue: false,
    allowNull: false
  },
  identity_document: {
    type: 'VARCHAR(255)',
    allowNull: true,
    note: 'Stockage du document pour vérification'
  },
  newsletter_subscribed: {
    type: 'BOOLEAN',
    defaultValue: false,
    allowNull: false
  },
  rgpd_accepted: {
    type: 'BOOLEAN',
    allowNull: false
  },
  rgpd_accepted_at: {
    type: 'TIMESTAMP',
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

module.exports = Individual;