const Message = {
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  conversation_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'Conversations',
      key: 'id'
    }
  },
  sender_id: {
    type: 'INTEGER',
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  content: {
    type: 'TEXT',
    allowNull: false
  },
  is_flagged: {
    type: 'BOOLEAN',
    defaultValue: false,
    allowNull: false,
    note: 'Flagué par IA si démarchage'
  },
  flag_reason: {
    type: 'VARCHAR(255)',
    allowNull: true
  },
  is_read: {
    type: 'BOOLEAN',
    defaultValue: false,
    allowNull: false
  },
  sent_at: {
    type: 'TIMESTAMP',
    defaultValue: 'now()',
    allowNull: false
  }
};

module.exports = Message;