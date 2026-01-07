# Monk Commerce - Product Picker

A React-based Product Picker component for Monk Commerce, featuring drag-and-drop reordering, product search with infinite scroll, variant support, and discount controls.

## 🚀 Live Demo

[https://monk-commerce-fe.netlify.app](https://monk-commerce-fe.netlify.app)

## ✨ Features

- **Drag & Drop Reordering** - Reorder products and variants using drag handles
- **Product Search Modal** - Search products with debounced input and infinite scroll
- **Variant Support** - Select individual variants or all variants of a product
- **Discount Controls** - Add percentage or flat discounts to products and variants
- **Responsive Design** - Works seamlessly across different screen sizes

## 🛠️ Tech Stack

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **@dnd-kit** - Drag and Drop functionality
- **Netlify Edge Functions** - API Proxy for production

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anshkumar1611/Monk-Commerce-.git
   cd monk-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 📁 Project Structure

```
src/
├── components/
│   ├── ProductPicker/       # Main product picker container
│   ├── ProductPickerModal/  # Modal for searching & selecting products
│   └── ProductRow/          # Individual product row with variants
├── hooks/
│   ├── useDebounce.ts       # Debounce hook for search input
│   ├── useDiscount.ts       # Discount state management
│   ├── useDraggable.ts      # Drag and drop functionality
│   └── useProductSearch.ts  # Product search with pagination
├── services/
│   └── api.ts               # API service for fetching products
├── types/
│   └── index.ts             # TypeScript type definitions
└── App.tsx                  # Root component
```

## 🔧 Configuration

### Development
The Vite dev server proxies API requests to the Monk Commerce API:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'https://stageapi.monkcommerce.app',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

### Production (Netlify)
API requests are handled by Netlify Edge Functions located in `netlify/edge-functions/`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Ansh Kumar**
- GitHub: [@Anshkumar1611](https://github.com/Anshkumar1611)
- Email: ansh2018gupta@gmail.com
