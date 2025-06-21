import React, { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Avatar
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import axios from 'axios';
import {
  deepPurple,
  blue,
  green,
  pink,
  orange,
  teal,
  indigo
} from '@mui/material/colors';
import config from '../config';
// Role-based color mapping
const roleColors = {
  CEO: deepPurple[500],
  CTO: blue[500],
  CFO: pink[500],
  Dev: green[500],
  DevOps: teal[500],
  'Team Lead': orange[500],
  Accountant: indigo[500]
};

// Enhanced Node UI
const NodeBox = ({ name, title, onToggle, expanded, photoUrl }) => {
    const color = roleColors[title] || '#90caf9';
  
    return (
      <Paper
        elevation={4}
        style={{
          padding: 12,
          borderRadius: 10,
          minWidth: 160,
          textAlign: 'center',
          backgroundColor: '#f4f6f8',
          borderLeft: `6px solid ${color}`,
          position: 'relative',
        }}
      >
        <Avatar
          sx={{ bgcolor: color, margin: '0 auto', mb: 1 }}
          src={photoUrl || undefined}
        >
          {(!photoUrl && name?.[0]) || ''}
        </Avatar>
        <Typography variant="subtitle2" fontWeight="bold">{name}</Typography>
        <Typography variant="caption" color="textSecondary">{title}</Typography>
        {onToggle && (
          <IconButton
            size="small"
            onClick={onToggle}
            sx={{ position: 'absolute', top: 5, right: 5 }}
          >
            {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        )}
      </Paper>
    );
  };
  
// Recursive render
const renderTree = (node, expandedMap, setExpandedMap) => {
  const expanded = expandedMap[node.id] ?? true;

  const toggle = () =>
    setExpandedMap(prev => ({ ...prev, [node.id]: !expanded }));

  return (
    <TreeNode
      key={node.id}
      label={
        <NodeBox
          name={node.name}
          title={node.designation}
          photoUrl={node.photo_url}
          onToggle={node.subordinates?.length ? toggle : null}
          expanded={expanded}
        />
      }      
    >
      {expanded && node.subordinates?.map(child =>
        renderTree(child, expandedMap, setExpandedMap)
      )}
    </TreeNode>
  );
};

const OrgChart = () => {
  const [data, setData] = useState([]);
  const [expandedMap, setExpandedMap] = useState({});

  const dummyData = [
    {
      id: 1,
      name: "Alice",
      email: "alice@x.com",
      role: "CEO",
      reporting_to: null,
      subordinates: [
        {
          id: 2,
          name: "Bob",
          email: "bob@x.com",
          role: "CTO",
          reporting_to: 1,
          subordinates: [
            {
              id: 4,
              name: "David",
              email: "david@x.com",
              role: "Dev",
              reporting_to: 2,
              subordinates: [
                {
                  id: 7,
                  name: "Dinesh",
                  email: "dinesh@x.com",
                  photo_url:"https://fastly.picsum.photos/id/343/200/200.jpg?hmac=51jfTxjhIC4eQHibl9fcu56Q5VlXZxJLdHsbgsGd_zE",
                  role: "Team Lead",
                  reporting_to: 4,
                  subordinates: []
                }
              ]
            },
            {
              id: 5,
              name: "Eva",
              email: "eva@x.com",
              role: "DevOps",
              reporting_to: 2,
              subordinates: []
            }
          ]
        },
        {
          id: 3,
          name: "Carol",
          email: "carol@x.com",
          role: "CFO",
          reporting_to: 1,
          subordinates: [
            {
              id: 6,
              name: "Frank",
              email: "frank@x.com",
              role: "Accountant",
              reporting_to: 3,
              subordinates: []
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}/org-chart`)
      .then((res) => {
      setData(res.data)
      console.log(res.data)
      }
      )
      .catch((err) => {
        console.error("Org chart fetch error", err);
        setData(dummyData);
      });
  }, []);

  return (
    <Box p={4} display="flex" justifyContent="center" overflow="auto">
      {data.map((root) => (
        <Tree
          key={root.id}
          label={<NodeBox name={root.name} title={root.role} />}
          lineWidth={'2px'}
          lineColor={'#ccc'}
          lineBorderRadius={'10px'}
        >
          {root.subordinates?.map(child =>
            renderTree(child, expandedMap, setExpandedMap)
          )}
        </Tree>
      ))}
    </Box>
  );
};

export default OrgChart;
