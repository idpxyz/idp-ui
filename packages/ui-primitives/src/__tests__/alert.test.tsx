import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '../alert';

describe('Alert', () => {
  it('renders with title and children', () => {
    render(<Alert title="Warning" variant="warning">Be careful</Alert>);
    expect(screen.getByText('Warning')).toBeDefined();
    expect(screen.getByText('Be careful')).toBeDefined();
  });

  it('has role="alert"', () => {
    render(<Alert variant="error">Error</Alert>);
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('calls onDismiss when dismiss button clicked', () => {
    const onDismiss = vi.fn();
    render(<Alert variant="info" onDismiss={onDismiss}>Dismissable</Alert>);
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('does not show dismiss button when onDismiss is not provided', () => {
    render(<Alert variant="success">No dismiss</Alert>);
    expect(screen.queryByLabelText('Dismiss')).toBeNull();
  });
});
