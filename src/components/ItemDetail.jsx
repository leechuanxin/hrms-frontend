import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

export default function ItemDetail({
  item, addToCart, onDeepLink,
}) {
  const [quantity, setQuantity] = useState(1);

  // create a hook to use when the logic says to change components
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (!item) {
      // we have access to the current param inside of ItemDetail
      // pass it back to App so that the index can be set
      onDeepLink(id);
    }
  }, []);

  if (!item) {
    return <div>Selected Item</div>;
  }

  const handleSelectChange = (event) => {
    setQuantity(event.target.value);
  };

  const detailAddCart = () => {
    // when the user ads to cart take them to the cart
    history.push('/cart');
    addToCart(item, quantity);
  };

  return (
    <div className="col-sm">
      <div className="item-detail">
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <p>
          <select
            className="item-quantity"
            value={quantity}
            onChange={handleSelectChange}
          >
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <option value={index + 1}>{index + 1}</option>
              ))}
          </select>
          <button type="button" onClick={detailAddCart}>
            Add To Cart
          </button>
        </p>
      </div>
    </div>
  );
}
