import React, { useState } from 'react';
import { SeismicEvent } from '../types';

const EventsTable: React.FC<{ events: SeismicEvent[] }> = ({ events }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="table-container">
      <h3>Recent Earthquakes</h3>
      <div className="table-info">
        Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, events.length)} of {events.length} events
      </div>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Magnitude</th>
            <th>Depth (km)</th>
            <th>Region</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((event, idx) => (
            <tr key={idx}>
              <td>{new Date(event.time).toLocaleString()}</td>
              <td style={{ 
                color: event.mag > 5 ? '#ff4d4f' : 
                      event.mag > 3 ? '#faad14' : '#52c41a',
                fontWeight: 'bold'
              }}>
                {event.mag.toFixed(1)}
              </td>
              <td>{event.depth}</td>
              <td>{event.region}</td>
              <td>{event.auth}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className="page-nav"
        >
          &laquo; Previous
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`page-number ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        
        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages}
          className="page-nav"
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default EventsTable;