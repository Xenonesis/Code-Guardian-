import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import { VirtualizedList } from '../../performance/VirtualizedList';

const mockItems = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  value: i * 10
}));

const renderItem = (item: typeof mockItems[0], index: number) => (
  <div data-testid={`item-${index}`}>
    {item.name} - {item.value}
  </div>
);

describe('VirtualizedList', () => {
  it('renders visible items only', () => {
    render(
      <VirtualizedList
        items={mockItems}
        itemHeight={50}
        containerHeight={300}
        renderItem={renderItem}
        data-testid="virtualized-list"
      />
    );

    // Should render only visible items (approximately 6-7 items for 300px container with 50px items)
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems.length).toBeLessThan(20); // Much less than total 1000 items
    expect(visibleItems.length).toBeGreaterThan(0);
  });

  it('handles scroll events', () => {
    const { container } = render(
      <VirtualizedList
        items={mockItems}
        itemHeight={50}
        containerHeight={300}
        renderItem={renderItem}
      />
    );

    const scrollContainer = container.firstChild as HTMLElement;
    expect(scrollContainer).toHaveStyle({ height: '300px' });
    
    // Simulate scroll
    scrollContainer.scrollTop = 100;
    scrollContainer.dispatchEvent(new Event('scroll'));
    
    // Component should handle scroll without errors
    expect(scrollContainer.scrollTop).toBe(100);
  });

  it('calculates total height correctly', () => {
    const { container } = render(
      <VirtualizedList
        items={mockItems}
        itemHeight={50}
        containerHeight={300}
        renderItem={renderItem}
      />
    );

    const innerContainer = container.querySelector('div > div');
    expect(innerContainer).toHaveStyle({ height: '50000px' }); // 1000 items * 50px
  });

  it('applies custom className', () => {
    const { container } = render(
      <VirtualizedList
        items={mockItems}
        itemHeight={50}
        containerHeight={300}
        renderItem={renderItem}
        className="custom-list"
      />
    );

    expect(container.firstChild).toHaveClass('custom-list');
  });

  it('handles empty items array', () => {
    render(
      <VirtualizedList
        items={[]}
        itemHeight={50}
        containerHeight={300}
        renderItem={renderItem}
      />
    );

    const items = screen.queryAllByTestId(/^item-/);
    expect(items).toHaveLength(0);
  });

  it('uses overscan correctly', () => {
    render(
      <VirtualizedList
        items={mockItems}
        itemHeight={50}
        containerHeight={300}
        renderItem={renderItem}
        overscan={10}
      />
    );

    // With overscan, should render more items than strictly visible
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems.length).toBeGreaterThan(6); // More than just visible items
  });
});