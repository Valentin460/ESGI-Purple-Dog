const Professional = {
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
  company_name: {
    type: 'VARCHAR(255)',
    allowNull: false
  },
  siret_number: {
    type: 'VARCHAR(14)',
    unique: true,
    allowNull: false
  },
  official_document: {
    type: 'VARCHAR(255)',
    allowNull: true,
    note: 'K-Bis, avis INSEE'
  },
  postal_address: {
    type: 'TEXT',
    allowNull: false
  },
  website: {
    type: 'VARCHAR(255)',
    allowNull: true
  },
  social_networks: {
    type: 'JSON',
    allowNull: true,
    note: 'RS non obligatoires'
  },
  specialties: {
    type: 'TEXT',
    allowNull: false,
    note: 'Spécialités du professionnel'
  },
  sought_items: {
    type: 'TEXT',
    allowNull: false,
    note: 'Objets recherchés'
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
  cgv_accepted: {
    type: 'BOOLEAN',
    allowNull: false
  },
  mandate_signed: {
    type: 'BOOLEAN',
    allowNull: false
  },
  mandate_signed_at: {
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

module.exports = Professional;