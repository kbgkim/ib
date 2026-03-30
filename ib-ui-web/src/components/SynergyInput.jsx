import React, { useState } from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';

const SynergyInput = ({ onSynergyChange }) => {
  const [items, setItems] = useState([
    { id: 1, category: 'COST', name: 'Headcount Reduction', value: 500, year: 1 },
    { id: 2, category: 'REVENUE', name: 'Cross-selling', value: 300, year: 2 }
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
      <div className="header">
        <h3><DollarSign size={20} /> Synergy Items</h3>
        <button onClick={addItem} className="add-btn"><Plus size={16} /> Add</button>
      </div>
      <div className="items-list">
        {items.map(item => (
          <div key={item.id} className="synergy-item-row">
            <select value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)}>
              <option value="COST">Cost</option>
              <option value="REVENUE">Revenue</option>
              <option value="FINANCIAL">Financial</option>
            </select>
            <input 
              type="text" 
              placeholder="Name" 
              value={item.name} 
              onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
            />
            <input 
              type="number" 
              placeholder="Value" 
              value={item.value} 
              onChange={(e) => updateItem(item.id, 'value', parseFloat(e.target.value))} 
            />
            <button onClick={() => removeItem(item.id)} className="delete-btn"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SynergyInput;
