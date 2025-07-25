import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce, useThrottle, PerformanceMonitor } from '../performanceOptimizations';

describe('Performance Optimizations', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useDebounce', () => {
    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 100));

      // Call the debounced function multiple times
      act(() => {
        result.current('test1');
        result.current('test2');
        result.current('test3');
      });

      // Should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();

      // Fast forward time
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Should have been called only once with the last argument
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test3');
    });
  });

  describe('useThrottle', () => {
    it('should throttle function calls', () => {
      const mockFn = vi.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 100));

      // Call the throttled function multiple times
      act(() => {
        result.current('test1');
        result.current('test2');
        result.current('test3');
      });

      // Should have been called only once (first call)
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test1');

      // Fast forward time
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Call again after delay
      act(() => {
        result.current('test4');
      });

      // Should have been called again
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('test4');
    });
  });

  describe('PerformanceMonitor', () => {
    it('should be a singleton', () => {
      const monitor1 = PerformanceMonitor.getInstance();
      const monitor2 = PerformanceMonitor.getInstance();
      
      expect(monitor1).toBe(monitor2);
    });

    it('should track performance metrics', () => {
      const monitor = PerformanceMonitor.getInstance();
      
      monitor.startMeasure('test-operation');
      monitor.endMeasure('test-operation');
      
      const metrics = monitor.getMetrics();
      expect(metrics['test-operation']).toBeDefined();
      expect(typeof metrics['test-operation']).toBe('number');
    });

    it('should clear metrics', () => {
      const monitor = PerformanceMonitor.getInstance();
      
      monitor.startMeasure('test-operation');
      monitor.endMeasure('test-operation');
      
      let metrics = monitor.getMetrics();
      expect(Object.keys(metrics).length).toBeGreaterThan(0);
      
      monitor.clearMetrics();
      metrics = monitor.getMetrics();
      expect(Object.keys(metrics).length).toBe(0);
    });
  });
});