import React, { useState } from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';

const SynergyInput = ({ onSynergyChange }) => {
  const [items, setItems] = useState([
    { id: 1, category: 'COST', name: '인력 구조화 절감', value: 500, year: 1 },
    { id: 2, category: 'REVENUE', name: '교차 판매 증대', value: 300, year: 2 }
  ]);

  const addItem = () => {
    const newItem = { id: Date.now(), category: 'COST', name: '', value: 0, year: 1 };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, val) => {
    const newItems = items.map(item => item.id === id ? { ...item, [field]: val } : item);
    setItems(newItems);
    onSynergyChange(newItems);
  };

  return (
    <div className="synergy-input-container">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}><DollarSign size={20} /> 시너지 항목</h3>
        <button onClick={addItem} className="add-btn" style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }}>
          <Plus size={16} /> 추가
        </button>
      </div>
      <div className="items-list">
        {items.map(item => (
          <div key={item.id} className="synergy-item-row" style={{ display: 'flex', gap: '8px', marginBottom: '12px', width: '100%', boxSizing: 'border-box' }}>
            <select value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} style={{ flex: '1 1 25%', minWidth: 0, padding: '8px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', width: '100%' }}>
              <option value="COST">비용(Cost)</option>
              <option value="REVENUE">매출(Revenue)</option>
              <option value="FINANCIAL">재무(Financial)</option>
            </select>
            <input 
              type="text" 
              placeholder="시너지 명칭" 
              value={item.name} 
              onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
              style={{ flex: '1 1 45%', minWidth: 0, padding: '8px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
            />
            <input 
              type="number" 
              placeholder="금액($M)" 
              value={item.value} 
              onChange={(e) => updateItem(item.id, 'value', parseFloat(e.target.value))} 
              style={{ flex: '1 1 20%', minWidth: 0, padding: '8px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
            />
            <button onClick={() => removeItem(item.id)} className="delete-btn" style={{ flex: '0 0 auto', padding: '8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SynergyInput;
