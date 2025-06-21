import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SchemaModal = ({ open, onClose, onSave, existingSchemas, initialData }) => {
  const [tableName, setTableName] = useState('');
  const [fields, setFields] = useState([{ name: '', type: '', foreignKey: '' }]);

  useEffect(() => {
    if (initialData) {
      setTableName(initialData.name);
      setFields(initialData.fields);
    } else {
      setTableName('');
      setFields([{ name: '', type: '', foreignKey: '' }]);
    }
  }, [initialData, open]);

  const addField = () => {
    setFields([...fields, { name: '', type: '', foreignKey: '' }]);
  };

  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const removeField = (index) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  const handleSubmit = () => {
    if (!tableName.trim()) return;
    onSave({ name: tableName.trim(), fields });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Schema' : 'Create New Schema'}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Table Name"
          fullWidth
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          sx={{ mb: 2 }}
          disabled={!!initialData} // disable editing name on update
        />
        {fields.map((field, index) => (
          <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 1 }}>
            <Grid item xs={3}>
              <TextField
                label="Field Name"
                fullWidth
                value={field.name}
                onChange={(e) => updateField(index, 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                value={field.type}
                onChange={(e) => updateField(index, 'type', e.target.value)}
                fullWidth
                displayEmpty
              >
                <MenuItem value="">Type</MenuItem>
                <MenuItem value="string">String</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="boolean">Boolean</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={4}>
              <Select
                value={field.foreignKey}
                onChange={(e) => updateField(index, 'foreignKey', e.target.value)}
                fullWidth
                displayEmpty
              >
                <MenuItem value="">No Foreign Key</MenuItem>
                {existingSchemas
                  .filter((s) => s.name !== tableName)
                  .map((schema) => (
                    <MenuItem key={schema.name} value={schema.name}>
                      {schema.name}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => removeField(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button onClick={addField} sx={{ mt: 1 }}>
          + Add Field
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SchemaModal;
