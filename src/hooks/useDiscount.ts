import { useState, useCallback } from 'react';
import type { Discount } from '../types';

interface UseDiscountReturn {
  showDiscount: boolean;
  discountValue: string;
  discountType: 'percent' | 'flat';
  handleValueChange: (value: string) => void;
  handleTypeChange: (type: 'percent' | 'flat') => void;
  addDiscount: () => void;
  removeDiscount: () => void;
}

/**
 * Hook for managing discount state
 * @param initialDiscount - Initial discount object { enabled, value, type }
 * @param onChange - Callback when discount changes
 * @returns Discount state and handlers
 */
export function useDiscount(
  initialDiscount: Partial<Discount> = {},
  onChange: ((discount: Discount) => void) | null = null
): UseDiscountReturn {
  const [showDiscount, setShowDiscount] = useState(initialDiscount?.enabled || false);
  const [discountValue, setDiscountValue] = useState(initialDiscount?.value || '');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>(
    initialDiscount?.type || 'percent'
  );

  const handleValueChange = useCallback((value: string) => {
    setDiscountValue(value);
    onChange?.({ value, type: discountType, enabled: true });
  }, [discountType, onChange]);

  const handleTypeChange = useCallback((type: 'percent' | 'flat') => {
    setDiscountType(type);
    onChange?.({ value: discountValue, type, enabled: true });
  }, [discountValue, onChange]);

  const addDiscount = useCallback(() => {
    setShowDiscount(true);
    onChange?.({ value: '', type: 'percent', enabled: true });
  }, [onChange]);

  const removeDiscount = useCallback(() => {
    setShowDiscount(false);
    setDiscountValue('');
    onChange?.({ value: '', type: discountType, enabled: false });
  }, [discountType, onChange]);

  return {
    showDiscount,
    discountValue,
    discountType,
    handleValueChange,
    handleTypeChange,
    addDiscount,
    removeDiscount,
  };
}

