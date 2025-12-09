const Review = {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  reviewer_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'User',
      key: 'id'
    },
    note: 'Utilisateur qui laisse l\'avis'
  },
  user_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'User',
      key: 'id'
    },
    note: 'Utilisateur évalué'
  },
  rating: {
    type: 'INTEGER',
    allowNull: false,
    note: 'Note de 1 à 5 étoiles'
  },
  nps_score: {
    type: 'INTEGER',
    allowNull: true,
    note: 'Note NPS de 1 à 10'
  },
  comment: {
    type: 'TEXT',
    allowNull: true
  },
  created_at: {
    type: 'TIMESTAMP',
    defaultValue: 'now()',
    allowNull: false
  }
};

module.exports = Review;