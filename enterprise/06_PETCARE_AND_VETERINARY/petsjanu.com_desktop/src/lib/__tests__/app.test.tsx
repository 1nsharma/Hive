import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import App from '../../App';

describe('App Component', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the main application with auth provider', () => {
    const { container } = render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    expect(container).toBeInTheDocument();
  });
});
