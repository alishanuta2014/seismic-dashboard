import React from 'react';
import { SeismicEvent } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
  useTheme,
  TableSortLabel,
  Skeleton,
  styled
} from '@mui/material';
import { 
  KeyboardArrowDown,
  KeyboardArrowUp 
} from '@mui/icons-material';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const MuiEventsTable: React.FC<{ 
  events: SeismicEvent[]; 
  loading?: boolean 
}> = ({ events, loading = false }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState<keyof SeismicEvent>('time');
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');
  const theme = useTheme();

  const handleRequestSort = (property: keyof SeismicEvent) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [events, orderBy, order]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getMagnitudeColor = (mag: number) => {
    if (mag > 5) return theme.palette.error.dark;
    if (mag > 3) return theme.palette.warning.dark;
    return theme.palette.success.dark;
  };

  const visibleRows = React.useMemo(
    () => sortedEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedEvents, page, rowsPerPage]
  );

  return (
    <Paper elevation={0} sx={{ 
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-label="seismic events table">
          <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
            <TableRow>
              <TableCell sx={{ width: '20%', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'time'}
                  direction={orderBy === 'time' ? order : 'desc'}
                  onClick={() => handleRequestSort('time')}
                >
                  Time (UTC)
                  {orderBy === 'time' ? (
                    <Box component="span" sx={{ display: 'none' }}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ width: '15%', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'mag'}
                  direction={orderBy === 'mag' ? order : 'desc'}
                  onClick={() => handleRequestSort('mag')}
                >
                  Magnitude
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ width: '15%', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'depth'}
                  direction={orderBy === 'depth' ? order : 'asc'}
                  onClick={() => handleRequestSort('depth')}
                >
                  Depth (km)
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '35%', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'region'}
                  direction={orderBy === 'region' ? order : 'asc'}
                  onClick={() => handleRequestSort('region')}
                >
                  Region
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '15%', fontWeight: 600 }}>
                Source
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <StyledTableRow key={index}>
                  <TableCell><Skeleton animation="wave" /></TableCell>
                  <TableCell align="right"><Skeleton animation="wave" /></TableCell>
                  <TableCell align="right"><Skeleton animation="wave" /></TableCell>
                  <TableCell><Skeleton animation="wave" /></TableCell>
                  <TableCell><Skeleton animation="wave" /></TableCell>
                </StyledTableRow>
              ))
            ) : (
              visibleRows.map((event, index) => (
                <StyledTableRow 
                  key={event.id} 
                  hover
                >
                  <TableCell>
                    {new Date(event.time).toLocaleString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: getMagnitudeColor(event.mag),
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}>
                    {event.mag.toFixed(1)}
                  </TableCell>
                  <TableCell align="right">
                    {event.depth}
                  </TableCell>
                  <TableCell sx={{ 
                    maxWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {event.region}
                  </TableCell>
                  <TableCell>
                    {event.auth}
                  </TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={events.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.875rem'
          }
        }}
      />
    </Paper>
  );
};

export default MuiEventsTable;