import React from 'react';
import { Link } from 'react-router-dom';

export default function Items({ selectedItemIndex, items, setItemDetail }) {
  const setItemSelected = (item, index) => {
    setItemDetail(index);
  };

  return (
    <div className="col-sm">
      <div className="items">
        {/* create a Link for every item.
            Link changes the current component based on the to prop, and
            also calls the onClick callback */}
        {items.map((item, index) => (
          <Link
            to={`/items/${item.id}`}
            key={item.id}
            className={index === selectedItemIndex ? 'item selected' : 'item'}
            onClick={() => setItemSelected(item, index)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
