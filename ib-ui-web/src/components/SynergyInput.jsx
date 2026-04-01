import React, { useState } from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';

const SynergyInput = ({ onSynergyChange, t }) => {
  const [items, setItems] = useState([
    { id: 1, category: 'COST', name: t('cost_synergy_lbl'), value: 500, year: 1 },
    { id: 2, category: 'REVENUE', name: t('rev_synergy_lbl'), value: 300, year: 2 }
  ]);

  const addItem = () => {
    const newItem = { id: Date.now(), category: 'COST', name: '', value: 0, year: 1 };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    onSynergyChange(newItems);
  };

  const updateItem = (id, field, val) => {
    const newItems = items.map(item => item.id === id ? { ...item, [field]: val } : item);
    setItems(newItems);
    onSynergyChange(newItems);
  };

  return (
    <div className="synergy-input-container glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '18px' }}><DollarSign size={20} color="var(--neon-green)" /> {t('synergy_items')}</h3>
        <button onClick={addItem} className="add-btn" style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.2)', color: '#fff', border: '1px solid #3b82f6', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '900' }}>
          <Plus size={16} /> {t('add')}
        </button>
      </div>
      <div className="items-list">
        {items.map(item => (
          <div key={item.id} className="synergy-item-row" style={{ display: 'flex', gap: '8px', marginBottom: '12px', width: '100%', boxSizing: 'border-box' }}>
            <select value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} style={{ flex: '1 1 25%', minWidth: 0, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', width: '100%', fontSize: '12px' }}>
              <option value="COST" style={{ background: '#1a1d21' }}>{t('cost')}</option>
              <option value="REVENUE" style={{ background: '#1a1d21' }}>{t('revenue')}</option>
              <option value="FINANCIAL" style={{ background: '#1a1d21' }}>{t('financial')}</option>
            </select>
            <input 
              type="text" 
              placeholder={t('synergy_name')} 
              value={item.name} 
              onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
              style={{ flex: '1 1 45%', minWidth: 0, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', width: '100%', boxSizing: 'border-box', fontSize: '12px' }}
            />
            <input 
              type="number" 
              placeholder={t('amount_m')} 
              value={item.value} 
              onChange={(e) => updateItem(item.id, 'value', parseFloat(e.target.value))} 
              style={{ flex: '1 1 20%', minWidth: 0, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', width: '100%', boxSizing: 'border-box', fontSize: '12px' }}
            />
            <button onClick={() => removeItem(item.id)} className="delete-btn" style={{ flex: '0 0 auto', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SynergyInput;
