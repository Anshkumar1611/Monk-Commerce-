import { useState, useEffect } from 'react';
import { useDebounce, useProductSearch } from '../../hooks';
import type { Product, Variant, SelectedProduct } from '../../types';
import './ProductPickerModal.css';

interface ProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (products: SelectedProduct[]) => void;
  editingProduct?: Product | null;
}

export default function ProductPickerModal({
  isOpen,
  onClose,
  onAdd,
  editingProduct = null,
}: ProductPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [initialized, setInitialized] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { products, loading, listRef, handleScroll, reset } = useProductSearch(
    isOpen,
    debouncedSearchTerm
  );

  // Pre-select editing product when modal opens
  useEffect(() => {
    if (isOpen && !initialized) {
      if (editingProduct && editingProduct.title) {
        setSelectedProducts([{
          id: editingProduct.id,
          title: editingProduct.title,
          image: editingProduct.image,
          variants: editingProduct.variants || [],
        }]);
      } else {
        setSelectedProducts([]);
      }
      setInitialized(true);
    }
  }, [isOpen, editingProduct, initialized]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedProducts([]);
      setInitialized(false);
      reset();
    }
  }, [isOpen, reset]);

  const isProductSelected = (product: Product): boolean => {
    return selectedProducts.some(p => p.title === product.title);
  };

  const isVariantSelected = (product: Product, variantId: number): boolean => {
    const selectedProduct = selectedProducts.find(p => p.title === product.title);
    return selectedProduct?.variants?.some(v => v.id === variantId) || false;
  };

  const handleProductToggle = (product: Product) => {
    const existingIndex = selectedProducts.findIndex(p => p.title === product.title);
    
    if (existingIndex >= 0) {
      setSelectedProducts(prev => prev.filter(p => p.title !== product.title));
    } else {
      const productWithVariants: SelectedProduct = {
        ...product,
        variants: product.variants || [],
      };
      setSelectedProducts(prev => [...prev, productWithVariants]);
    }
  };

  const handleVariantToggle = (product: Product, variant: Variant) => {
    const existingProductIndex = selectedProducts.findIndex(p => p.title === product.title);
    
    if (existingProductIndex >= 0) {
      const existingProduct = selectedProducts[existingProductIndex];
      const variantExists = existingProduct.variants?.some(v => v.id === variant.id);
      
      if (variantExists) {
        const updatedVariants = existingProduct.variants.filter(v => v.id !== variant.id);
        if (updatedVariants.length === 0) {
          setSelectedProducts(prev => prev.filter(p => p.title !== product.title));
        } else {
          setSelectedProducts(prev => prev.map(p => 
            p.title === product.title ? { ...p, variants: updatedVariants } : p
          ));
        }
      } else {
        setSelectedProducts(prev => prev.map(p => 
          p.title === product.title 
            ? { ...p, variants: [...(p.variants || []), variant] }
            : p
        ));
      }
    } else {
      setSelectedProducts(prev => [...prev, { ...product, variants: [variant] }]);
    }
  };

  const getSelectedCount = (): number => selectedProducts.length;

  const handleAdd = () => {
    onAdd(selectedProducts);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add products</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="modal-divider"></div>

        <div className="modal-list" ref={listRef} onScroll={handleScroll}>
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <div className="product-row" onClick={() => handleProductToggle(product)}>
                <input
                  type="checkbox"
                  checked={isProductSelected(product)}
                  onChange={() => {}}
                />
                <div className="product-image">
                  {product.image?.src ? (
                    <img src={product.image.src} alt={product.title} />
                  ) : (
                    <div className="no-image">📷</div>
                  )}
                </div>
                <div className="product-info">
                  <span className="product-title">{product.title}</span>
                </div>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="variants-list">
                  {product.variants.map((variant) => (
                    <div 
                      key={variant.id} 
                      className="variant-row"
                      onClick={() => handleVariantToggle(product, variant)}
                    >
                      <input
                        type="checkbox"
                        checked={isVariantSelected(product, variant.id)}
                        onChange={() => {}}
                      />
                      <span className="variant-title">{variant.title}</span>
                      <span className="variant-inventory">
                        {variant.inventory_quantity !== undefined && variant.inventory_quantity !== null
                          ? `${variant.inventory_quantity} available`
                          : ''}
                      </span>
                      <span className="variant-price">
                        {variant.price ? `₹${variant.price}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="loading">Loading...</div>}
        </div>

        <div className="modal-footer">
          <span className="selected-count">{getSelectedCount()} product(s) selected</span>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-add" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

