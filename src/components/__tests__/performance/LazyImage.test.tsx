import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import { LazyImage } from '../../performance/LazyImage';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});

beforeEach(() => {
  global.IntersectionObserver = mockIntersectionObserver;
});

describe('LazyImage', () => {
  it('renders with placeholder initially', () => {
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
        data-testid="lazy-image"
      />
    );

    const image = screen.getByTestId('lazy-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Test image');
  });

  it('sets up intersection observer', () => {
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
      />
    );

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('handles load event', async () => {
    const onLoad = vi.fn();
    
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
        onLoad={onLoad}
        data-testid="lazy-image"
      />
    );

    const image = screen.getByTestId('lazy-image');
    
    // Simulate image load
    image.dispatchEvent(new Event('load'));
    
    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    });
  });

  it('handles error event', async () => {
    const onError = vi.fn();
    
    render(
      <LazyImage
        src="https://example.com/invalid-image.jpg"
        alt="Test image"
        onError={onError}
        data-testid="lazy-image"
      />
    );

    const image = screen.getByTestId('lazy-image');
    
    // Simulate image error
    image.dispatchEvent(new Event('error'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('applies custom className', () => {
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
        className="custom-class"
        data-testid="lazy-image"
      />
    );

    const image = screen.getByTestId('lazy-image');
    expect(image).toHaveClass('custom-class');
  });
});