import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom';

jest.mock('../components/SeismicMap', () => () => <div data-testid="seismic-map" />);
jest.mock('../components/MagnitudeChart', () => () => <div data-testid="magnitude-chart" />);
jest.mock('../components/DepthChart', () => () => <div data-testid="depth-chart" />);
jest.mock('../components/MuiEventsTable', () => () => <div data-testid="events-table" />);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders the main title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Seismic Dashboard')).toBeInTheDocument();
  });

  it('handles logout click', () => {
    window.localStorage.setItem('isAuthenticated', 'true');
    render(<Dashboard />);
    
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    
    expect(localStorage.getItem('isAuthenticated')).toBe('false');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows connection status', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Status: (connected|disconnected)/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('renders all visualization components', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('seismic-map')).toBeInTheDocument();
    expect(screen.getByTestId('magnitude-chart')).toBeInTheDocument();
    expect(screen.getByTestId('depth-chart')).toBeInTheDocument();
    expect(screen.getByTestId('events-table')).toBeInTheDocument();
  });
});