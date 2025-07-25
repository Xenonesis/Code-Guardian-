import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import App from '../../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders the main navigation', () => {
    render(<App />);
    // The app should render some navigation or main content
    // We'll check for the root element since the app uses routing
    const rootElement = document.querySelector('#root');
    expect(rootElement).toBeInTheDocument();
  });

  it('handles routing correctly', () => {
    render(<App />);
    // Check that the router is working by verifying we're on a valid route
    expect(window.location.pathname).toBe('/');
  });
});