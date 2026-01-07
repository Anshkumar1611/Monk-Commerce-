import { useState } from 'react';
import { useDiscount, useDraggable } from '../../hooks';
import type { Product, Variant, Discount } from '../../types';
import './ProductRow.css';

interface DragHandleProps {
  listeners: ReturnType<typeof useDraggable>['listeners'];
  attributes: ReturnType<typeof useDraggable>['attributes'];
}

function DragHandle({ listeners, attributes }: DragHandleProps) {
  return (
    <div className="drag-handle" {...listeners} {...attributes}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

interface VariantRowProps {
  variant: Variant;
  productId: string | number;
}

function VariantRow({ variant, productId }: VariantRowProps) {
  const {
    showDiscount,
    discountValue,
    discountType,
    handleValueChange,
    handleTypeChange,
    addDiscount,
    removeDiscount,
  } = useDiscount();

  const { setNodeRef, listeners, attributes, style } = useDraggable(
    `${productId}-variant-${variant.id}`
  );

  return (
    <div ref={setNodeRef} style={style} className="variant-item">
      <DragHandle listeners={listeners} attributes={attributes} />
      <div className="variant-name-box">
        <span>{variant.title}</span>
      </div>
      
      {!showDiscount ? (
        <button className="variant-add-discount-btn" onClick={addDiscount}>
          Add Discount
        </button>
      ) : (
        <>
          <div className="variant-discount-controls">
            <input
              type="number"
              className="discount-input"
              placeholder="0"
              value={discountValue}
              onChange={(e) => handleValueChange(e.target.value)}
            />
            <select 
              className="discount-type"
              value={discountType}
              onChange={(e) => handleTypeChange(e.target.value as 'percent' | 'flat')}
            >
              <option value="percent">% Off</option>
              <option value="flat">flat Off</option>
            </select>
          </div>
          <button className="remove-discount" onClick={removeDiscount}>
            ×
          </button>
        </>
      )}
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  index: number;
  onEdit: (productId: string | number) => void;
  onDiscountChange: (productId: string | number, discount: Discount) => void;
}

export default function ProductRow({ 
  product, 
  index, 
  onEdit, 
  onDiscountChange 
}: ProductRowProps) {
  const {
    showDiscount,
    discountValue,
    discountType,
    handleValueChange,
    handleTypeChange,
    addDiscount,
    removeDiscount,
  } = useDiscount(product.discount, (discount) => onDiscountChange(product.id, discount));

  const [showVariants, setShowVariants] = useState(false);

  const { setNodeRef, listeners, attributes, style } = useDraggable(product.id);

  const hasVariants = product.variants && product.variants.length > 0;
  const isSelected = product.title && product.title !== 'Select Product';

  return (
    <div ref={setNodeRef} style={style} className="product-row-container">
      <div className="product-main-row">
        <DragHandle listeners={listeners} attributes={attributes} />
        <span className="row-number">{index + 1}.</span>
        
        <div className={`product-input ${isSelected ? 'has-value' : ''}`} onClick={() => onEdit(product.id)}>
          <span className="product-name">
            {isSelected ? product.title : 'Select Product'}
          </span>
          <button className="edit-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {isSelected && !showDiscount && (
          <button className="add-discount-btn" onClick={addDiscount}>
            Add Discount
          </button>
        )}

        {isSelected && showDiscount && (
          <>
            <div className="discount-controls">
              <input
                type="number"
                className="discount-input"
                placeholder="0"
                value={discountValue}
                onChange={(e) => handleValueChange(e.target.value)}
              />
              <select 
                className="discount-type"
                value={discountType}
                onChange={(e) => handleTypeChange(e.target.value as 'percent' | 'flat')}
              >
                <option value="percent">% Off</option>
                <option value="flat">flat Off</option>
              </select>
            </div>
            <button className="remove-discount" onClick={removeDiscount}>
              ×
            </button>
          </>
        )}

        {!isSelected && (
          <button className="add-discount-btn" disabled>
            Add Discount
          </button>
        )}
      </div>

      {isSelected && hasVariants && (
        <div className="variants-toggle-row">
          <button className="variants-toggle-btn" onClick={() => setShowVariants(!showVariants)}>
            {showVariants ? 'Hide variants' : 'Show variants'}
            <span className="arrow">
              {showVariants ? '∧' : '∨'}
            </span>
          </button>
        </div>
      )}

      {showVariants && hasVariants && (
        <div className="variants-container">
          {product.variants.map((variant) => (
            <VariantRow
              key={variant.id}
              variant={variant}
              productId={product.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

