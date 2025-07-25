import { useCallback, useRef, useEffect, useMemo } from 'react';
import { PerformanceMonitor } from '@/utils/performanceOptimizations';

/**
 * Hook for component-level performance optimization
 */
export function usePerformanceOptimization(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    monitor.startMeasure(`${componentName}-render-${renderCount.current}`);
    
    return () => {
      monitor.endMeasure(`${componentName}-render-${renderCount.current}`);
    };
  });

  useEffect(() => {
    monitor.startMeasure(`${componentName}-mount`);
    
    return () => {
      monitor.endMeasure(`${componentName}-mount`);
      const mountDuration = Date.now() - mountTime.current;
      console.log(`${componentName} was mounted for ${mountDuration}ms`);
    };
  }, [componentName, monitor]);

  const measureOperation = useCallback((operationName: string, operation: () => void) => {
    monitor.startMeasure(`${componentName}-${operationName}`);
    operation();
    monitor.endMeasure(`${componentName}-${operationName}`);
  }, [componentName, monitor]);

  const getComponentMetrics = useCallback(() => {
    const allMetrics = monitor.getMetrics();
    const componentMetrics = Object.entries(allMetrics)
      .filter(([key]) => key.startsWith(componentName))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, number>);
    
    return {
      ...componentMetrics,
      renderCount: renderCount.current,
      averageRenderTime: componentMetrics[`${componentName}-render`] || 0
    };
  }, [componentName, monitor]);

  return {
    measureOperation,
    getComponentMetrics,
    renderCount: renderCount.current
  };
}

/**
 * Hook for memoizing expensive calculations
 */
export function useExpensiveMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  debugName?: string
): T {
  const monitor = PerformanceMonitor.getInstance();
  
  return useMemo(() => {
    if (debugName) {
      monitor.startMeasure(`memo-${debugName}`);
    }
    
    const result = factory();
    
    if (debugName) {
      monitor.endMeasure(`memo-${debugName}`);
    }
    
    return result;
  }, deps);
}

/**
 * Hook for optimized event handlers
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });
  
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, deps) as T;
}