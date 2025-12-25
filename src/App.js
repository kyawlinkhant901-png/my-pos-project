import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { ShoppingCart, RefreshCw, Trash2, CreditCard } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
    // Real-time Sync: Database ပြောင်းလဲမှုကို စောင့်ကြည့်ရန်
    const channel = supabase
      .channel('pos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => fetchProducts()
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*');
    setProducts(data || []);
  }

  const addToCart = (p) => setCart([...cart, { ...p, cartId: Math.random() }]);
  const total = cart.reduce((acc, curr) => acc + curr.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('ပစ္စည်းရွေးပါ');
    const { data, error } = await supabase
      .from('orders')
      .insert([{ total_amount: total }])
      .select();
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('ရောင်းချမှု အောင်မြင်ပါသည်!');
      setCart([]);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'sans-serif',
        backgroundColor: '#f9fafb',
      }}
    >
      {/* Menu Area */}
      <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>POS Menu</h2>
          <button
            onClick={fetchProducts}
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          >
            <RefreshCw size={24} color="#666" />
          </button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '15px',
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
              <b style={{ display: 'block', marginBottom: '5px' }}>{p.name}</b>
              <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
                {p.price.toLocaleString()} MMK
              </span>
              <div
                style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}
              >
                Stock: {p.stock_quantity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <div
        style={{
          width: '380px',
          padding: '25px',
          background: '#fff',
          borderLeft: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '20px',
            marginBottom: '20px',
          }}
        >
          <ShoppingCart /> လက်ရှိပြေစာ
        </h3>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.map((item) => (
            <div
              key={item.cartId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                padding: '10px',
                background: '#f8fafc',
                borderRadius: '8px',
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {item.price.toLocaleString()} MMK
                </div>
              </div>
              <Trash2
                size={18}
                color="#ef4444"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  setCart(cart.filter((i) => i.cartId !== item.cartId))
                }
              />
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: '2px solid #f1f5f9',
            paddingTop: '20px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '22px',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            <span>စုစုပေါင်း:</span>
            <span style={{ color: '#2563eb' }}>
              {total.toLocaleString()} MMK
            </span>
          </div>
          <button
            onClick={handleCheckout}
            style={{
              width: '100%',
              padding: '18px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <CreditCard /> Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
