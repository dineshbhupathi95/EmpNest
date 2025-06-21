import React, { useState } from 'react';
import SchemaList from '../pages/ScemaList';
import SchemaModal from './SchemaModel';

const SchemaBuilder = () => {
    const [schemas, setSchemas] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingSchema, setEditingSchema] = useState(null);
  
    const handleSave = (schemaData) => {
      setSchemas(prev =>
        editingSchema
          ? prev.map(s => (s.name === editingSchema.name ? schemaData : s))
          : [...prev, schemaData]
      );
      setEditingSchema(null);
    };
  
    const handleCreate = () => {
      setEditingSchema(null);
      setOpenModal(true);
    };
  
    const handleEdit = (schema) => {
      setEditingSchema(schema);
      setOpenModal(true);
    };
  
    return (
      <div>
        <SchemaList schemas={schemas} onCreate={handleCreate} onEdit={handleEdit} />
        <SchemaModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={handleSave}
          existingSchemas={schemas}
          initialData={editingSchema}
        />
      </div>
    );
  };
  
export default SchemaBuilder;
