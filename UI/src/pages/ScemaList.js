import React from 'react';
import {
  Card, CardContent, Typography, IconButton, Grid, Divider, Chip, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const SchemaList = ({ schemas, onCreate, onEdit }) => {
  return (
    <div>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Schemas</Typography>
        </Grid>
        <Grid item>
          <IconButton color="primary" onClick={onCreate}>
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>

      {schemas.length === 0 ? (
        <Box mt={4} textAlign="center">
          <Typography variant="body1" color="text.secondary">
            No schemas found. Click the + button to create your first schema.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2} mt={2}>
          {schemas.map((schema) => (
            <Grid item xs={12} md={6} lg={4} key={schema.name}>
              <Card
                sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }}
                onClick={() => onEdit(schema)}
              >
                <CardContent>
                  <Typography variant="h6">{schema.name}</Typography>
                  <Divider sx={{ my: 1 }} />
                  {schema.fields.map((field, index) => (
                    <Chip
                      key={index}
                      label={`${field.name} (${field.type}${field.foreignKey ? ' → ' + field.foreignKey : ''})`}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default SchemaList;
