import ProductPicker from './components/ProductPicker'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">🛒</span>
          <span className="logo-text">Monk Upsell & Cross-sell</span>
        </div>
      </header>
      <main className="app-main">
        <ProductPicker />
      </main>
    </div>
  )
}

export default App

