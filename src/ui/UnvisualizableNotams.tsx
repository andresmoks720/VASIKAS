import React from 'react';
import { Box, Chip, Collapse, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { NormalizedNotam } from '@/services/notam/notamTypes';
import { EnhancedNotam } from '@/services/airspace/airspaceTypes';

interface UnvisualizableNotamsProps {
  notams: (NormalizedNotam | EnhancedNotam)[];
}

export const UnvisualizableNotams: React.FC<UnvisualizableNotamsProps> = ({ notams }) => {
  const [expanded, setExpanded] = React.useState(false);

  // Filter out unvisualizable NOTAMs (those with geometryParseReason or no geometry)
  const unvisualizable = notams.filter(notam =>
    notam.geometryParseReason || (!notam.geometry && !notam.geometryParseReason)
  );

  if (unvisualizable.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          cursor: 'pointer',
          pb: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="subtitle2">
          Unvisualizable NOTAMs ({unvisualizable.length})
        </Typography>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Stack>

      <Collapse in={expanded}>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {unvisualizable.map((notam) => (
                <TableRow key={notam.id}>
                  <TableCell sx={{ width: '20%', verticalAlign: 'top' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight="medium">
                        {notam.id}
                      </Typography>
                      {notam.geometryParseReason ? (
                        <Chip
                          label={notam.geometryParseReason}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      ) : 'geometrySource' in notam ? (
                        // Enhanced NOTAM with geometry source
                        <Chip
                          label={(notam.geometrySourceDetails?.source || notam.geometrySource).toUpperCase()}
                          size="small"
                          color={
                            notam.geometrySource === 'html' ? 'success' :
                              notam.geometrySource === 'geojson' ? 'info' :
                                notam.geometrySource === 'notamText' ? 'secondary' : 'warning'
                          }
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label="NO_GEOMETRY"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ width: '80%' }}>
                    <Typography variant="body2" color="text.secondary">
                      {notam.summary}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mt: 0.5,
                        fontFamily: 'monospace',
                        fontSize: '0.7rem'
                      }}
                    >
                      {notam.text}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
};