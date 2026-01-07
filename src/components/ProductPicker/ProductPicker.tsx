import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ProductRow from '../ProductRow/ProductRow';
import ProductPickerModal from '../ProductPickerModal/ProductPickerModal';
import type { Product, Discount, SelectedProduct } from '../../types';
import './ProductPicker.css';

// Generate unique ID
const generateId = (): string => `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createEmptyProduct = (): Product => ({
  id: generateId(),
  title: '',
  variants: [],
  discount: { enabled: false, value: '', type: 'percent' },
});

export default function ProductPicker() {
  const [products, setProducts] = useState<Product[]>([createEmptyProduct()]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleEdit = (productId: string | number) => {
    setEditingProductId(productId);
    setIsModalOpen(true);
  };

  const getEditingProduct = (): Product | null => {
    if (!editingProductId) return null;
    return products.find(p => p.id === editingProductId) || null;
  };

  const handleAddProducts = useCallback((selectedProducts: SelectedProduct[]) => {
    setProducts(prev => {
      const newProducts = [...prev];
      const editIndex = newProducts.findIndex(p => p.id === editingProductId);

      if (editIndex >= 0) {
        if (selectedProducts.length === 0) {
          newProducts[editIndex] = {
            id: editingProductId as string,
            title: '',
            image: null,
            variants: [],
            discount: { enabled: false, value: '', type: 'percent' },
          };
        } else {
          const firstProduct = selectedProducts[0];
          newProducts[editIndex] = {
            id: editingProductId as string,
            title: firstProduct.title,
            image: firstProduct.image,
            variants: firstProduct.variants || [],
            discount: newProducts[editIndex].discount || { enabled: false, value: '', type: 'percent' },
          };

          selectedProducts.slice(1).forEach((product, idx) => {
            newProducts.splice(editIndex + 1 + idx, 0, {
              id: generateId(),
              title: product.title,
              image: product.image,
              variants: product.variants || [],
              discount: { enabled: false, value: '', type: 'percent' },
            });
          });
        }
      }

      return newProducts;
    });

    setEditingProductId(null);
  }, [editingProductId]);

  const handleAddProductRow = () => {
    setProducts(prev => [...prev, createEmptyProduct()]);
  };

  const handleDiscountChange = (productId: string | number, discount: Discount) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, discount };
      }
      return p;
    }));
  };

  return (
    <div className="product-picker">
      <div className="picker-header">
        <h1>Add Products</h1>
      </div>

      <div className="picker-columns">
        <div className="column-header">
          <span className="col-product">Product</span>
          <span className="col-discount">Discount</span>
        </div>
      </div>

      <div className="picker-content">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={products.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {products.map((product, index) => (
              <ProductRow
                key={product.id}
                product={product}
                index={index}
                onEdit={handleEdit}
                onDiscountChange={handleDiscountChange}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="picker-footer">
        <button className="add-product-btn" onClick={handleAddProductRow}>
          Add Product
        </button>
      </div>

      <ProductPickerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProductId(null);
        }}
        onAdd={handleAddProducts}
        editingProduct={getEditingProduct()}
      />
    </div>
  );
}

