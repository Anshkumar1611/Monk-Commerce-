import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties } from 'react';

interface UseDraggableReturn {
  setNodeRef: ReturnType<typeof useSortable>['setNodeRef'];
  listeners: ReturnType<typeof useSortable>['listeners'];
  attributes: ReturnType<typeof useSortable>['attributes'];
  style: CSSProperties;
  isDragging: boolean;
}

/**
 * Hook for sortable/draggable functionality
 * @param id - Unique identifier for the sortable item
 * @returns Sortable refs, listeners, attributes, and style
 */
export function useDraggable(id: string | number): UseDraggableReturn {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return {
    setNodeRef,
    listeners,
    attributes,
    style,
    isDragging,
  };
}

