import { useState, useEffect } from "react";
import "./App.css";
import { HiShoppingCart } from "react-icons/hi"

interface Recipe {
  id: number;
  name: string;
  description: string;
  cookingInstructions: string;
  price: number;
  quantity: number;
}

interface CartItem {
  recipeId: number;
  count: number;
}

interface CustomerDetails {
  name: string;
  email: string;
  address: string;
  mobileNumber: string;
}

function App(): JSX.Element {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    email: "",
    address: "",
    mobileNumber: "",
  });
  const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:3000/api/recipes");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        console.error("Error fetching recipes:", response.status);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleAddToCart = async (recipeId: number): Promise<void> => {
    const existingItem = cart.find((item) => item.recipeId === recipeId);
    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.recipeId === recipeId ? { ...item, count: item.count + 1 } : item
      );
      setCart(updatedCart);
      alert("your items added to the cart successfully");

      try {
        await fetch(`http://localhost:3000/api/recipes/${recipeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: existingItem.count + 1 }),
        });
      } catch (error) {
        console.error("Error updating recipe quantity:", error);
      }
    } else {
      setCart([...cart, { recipeId, count: 1 }]);

      try {
        await fetch(`http://localhost:3000/api/recipes/${recipeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: 1 }),
        });
      } catch (error) {
        console.error("Error updating recipe quantity:", error);
      }
    }
  };

  const handleIncreaseQuantity = async (recipeId: number): Promise<void> => {
    const existingItem = cart.find((item) => item.recipeId === recipeId);
    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.recipeId === recipeId ? { ...item, count: item.count + 1 } : item
      );
      setCart(updatedCart);

      try {
        await fetch(`http://localhost:3000/api/recipes/${recipeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: existingItem.count + 1 }),
        });
      } catch (error) {
        console.error("Error updating recipe quantity:", error);
      }
    }
  };

  const handleDecreaseQuantity = async (recipeId: number): Promise<void> => {
    const existingItem = cart.find((item) => item.recipeId === recipeId);
    if (existingItem && existingItem.count > 1) {
      const updatedCart = cart.map((item) =>
        item.recipeId === recipeId ? { ...item, count: item.count - 1 } : item
      );
      setCart(updatedCart);

      try {
        await fetch(`http://localhost:3000/api/recipes/${recipeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: existingItem.count - 1 }),
        });
        // Handle success or error response from the backend
      } catch (error) {
        console.error("Error updating recipe quantity:", error);
      }
    }
  };

  const handleOpenCart = (): void => {
    setIsCartOpen(true);
  };

  const handleCloseCart = (): void => {
    setIsCartOpen(false);
    setCustomerDetails({
      name: "",
      email: "",
      address: "",
      mobileNumber: "",
    });
  };
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  
  const handleOrder = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerDetails),
      });

      if (response.ok) {
        console.log("Customer details stored successfully");
        alert("Thank you for the order");
      } else {
        console.error("Error storing customer details:", response.status);
      }
    } catch (error) {
      console.error("Error storing customer details:", error);
    }
  };

  const handleOpenOrderPopup = (): void => {
    setIsOrderPopupOpen(true);
  };

  const handleCloseOrderPopup = (): void => {
    setIsOrderPopupOpen(false);
  };
  

  return (
    <div className="bg-img">
      <div className="header">
        <h1>ReactMeals</h1>
        
        <div className="cart" onClick={handleOpenCart}>
          <HiShoppingCart className="icon" />
          Your cart ({cart.length})
        </div>
      </div>

      <div className="food">
        <h1>Delicious Food, Delivery To You</h1>
        <p className="food-content">
          Choose your favorite meal from our broad selection of available meals
          and enjoy a delicious lunch or dinner at home. All our meals are
          cooked with high-quality ingredients, just-in-time and of course by
          experienced chefs!
        </p>
      </div>
      
      <div className="recipe-container">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div className="recipe-card" key={recipe.id}>
              <div className="recipe-info">
                <div className="recipe-name">{recipe.name}</div>
                <div className="recipe-description">{recipe.description}</div>
                <div className="cooking-instruction">cooking instruction:{recipe.cookingInstructions}</div>
                <div className="recipe-price">${recipe.price}</div>
              </div>  
              <div className="recipe-actions">
                <div className="quantity">
                  Quantity:{" "}
                  {cart.find((item) => item.recipeId === recipe.id)?.count || 0}
                </div>
                <button
                  className="recipe-button"
                  onClick={() => handleAddToCart(recipe.id)}
                >
                  + Add
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-recipes">No recipes found.</div>
        )}
      </div>

      {isCartOpen && (
        <div className="popup">
          <div className="popup-content">
            <div className="cart-items">
              {cart.length > 0 ? (
                cart.map((item) => {
                  const recipe = recipes.find(
                    (recipe) => recipe.id === item.recipeId
                  );
                  return (
                    <div className="cart-item" key={item.recipeId}>
                      <div className="item-info">
                        <div className="item-name">{recipe?.name}</div>
                        <div className="item-price">
                          ${recipe?.price}
                          <span className="item-quantity">x{item.count}</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => handleDecreaseQuantity(item.recipeId)}>-</button>
                        <button onClick={() => handleIncreaseQuantity(item.recipeId)}>+</button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-cart">Your cart is empty.</div>
              )}
              <h3 className="total-price">
                Total Price: $
                {cart.reduce((total, item) => {
                  const recipe = recipes.find((recipe) => recipe.id === item.recipeId);
                  return total + (recipe?.price || 0) * item.count;
                }, 0)}
              </h3>
              <div className="popup-buttons">
                <button className="close-popup" onClick={handleCloseCart}>
                  Cancel
                </button>
                <button className="order" onClick={handleOpenOrderPopup}>
                  Order
                </button>
              </div>
            </div>
          </div>
          
          {isOrderPopupOpen && (
            <div className="popup2">
              <div className="popup-content2">
                <div className="customer-details">
                  <h3>Customer Details</h3>
                  <label>Customer Name:</label>
                  <input
                    type="text" name="name" value={customerDetails.name} onChange={handleInputChange}
                  />
                  <label>E-mail:</label>
                  <input
                    type="email" name="email"value={customerDetails.email} onChange={handleInputChange} 
                  />
                  <label>Address:</label>
                  <input
                    type="text" name="address" value={customerDetails.address}onChange={handleInputChange} 
                  />
                  <label>Mobile Number:</label>
                  <input
                    type="text" name="mobileNumber" value={customerDetails.mobileNumber}  onChange={handleInputChange} 
                  />
                </div>
                <div className="popup-buttons">
                  <button className="close-popup" onClick={handleCloseOrderPopup}>
                    Cancel
                  </button>
                  <button className="place-order" onClick={handleOrder} >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;