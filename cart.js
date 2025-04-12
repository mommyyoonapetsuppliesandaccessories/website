let iconCart = document.querySelector('.icon-cart');
let closeBtn = document.querySelector('.cartTab .close');
let body = document.querySelector('body');

iconCart.addEventListener('click', () => {
    body.classList.toggle('activeTabCart');
});
closeBtn.addEventListener('click', () => {
    body.classList.toggle('activeTabCart');
});

let cart = [];

// Function to add a product to the cart
function addToCart(productId, productName, productPrice, productImage) {
  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1
    });
  }

  // Save cart to localStorage
  localStorage.setItem('shoppingCart', JSON.stringify(cart));

  updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
  const cartContainer = document.querySelector('.listCart');
  const cartCount = document.querySelector('.icon-cart span');
  const totalPriceElement = document.querySelector('.total-price'); // Select the total price element
  cartContainer.innerHTML = ''; // Clear the cart display

  let totalPrice = 0; // Initialize total price

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <div class="cart-item-details">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">Price: ₱${item.price.toFixed(2)}</span>
        <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
      </div>
      <div class="button-group">
        <button class="decrease-btn" data-id="${item.id}">-</button>
        <button class="increase-btn" data-id="${item.id}">+</button>
      </div>
    `;
    cartContainer.appendChild(cartItem);

    // Add to total price
    totalPrice += item.price * item.quantity;
  });

  // Update the cart count
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

  // Display the total price
  totalPriceElement.textContent = `Total Price: ₱${totalPrice.toFixed(2)}`;

  // Attach event listeners to the increase and decrease buttons
  document.querySelectorAll('.increase-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      increaseQuantity(productId);
    });
  });

  document.querySelectorAll('.decrease-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      decreaseQuantity(productId);
    });
  });

  // Save the updated cart to localStorage
  localStorage.setItem('shoppingCart', JSON.stringify(cart));

  // Update the checkout button state
  updateCheckoutButtonState();
}

// Load cart from localStorage on page load
window.addEventListener('load', () => {
  const savedCart = localStorage.getItem('shoppingCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
  }
});

// Attach event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  // Remove any existing event listeners to prevent duplicates
  button.replaceWith(button.cloneNode(true));

  // Re-select the button after cloning
  const newButton = document.querySelector(`[data-id="${button.dataset.id}"]`);

  // Add the event listener
  newButton.addEventListener('click', () => {
    const productId = newButton.dataset.id;
    const productName = newButton.dataset.name;
    const productPrice = parseFloat(newButton.dataset.price);
    const productImage = newButton.dataset.image; // Get the product image URL
    addToCart(productId, productName, productPrice, productImage);
  });
});

function decreaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity -= 1;
    if (product.quantity === 0) {
      // Remove the product from the cart if quantity reaches 0
      cart = cart.filter(item => item.id !== productId);
    }
    updateCartDisplay();
  }
}

function increaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity += 1;
    updateCartDisplay();
  }
}

// Select all "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

// Select the pop-up and confirm button
const popup = document.getElementById('popup-notification');
const confirmBtn = document.getElementById('confirm-btn');

// Add event listeners to each "Add to Cart" button
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    console.log('Button clicked'); // Debugging statement
    showPopup();
  });
});

// Function to show the pop-up
function showPopup() {
  console.log('showPopup called'); // Debugging statement
  popup.classList.remove('hidden');
}

// Event listener to hide the pop-up when the confirm button is clicked
confirmBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

// Select the checkout button and modal elements
const checkoutButton = document.querySelector('.checkOut');
const checkoutModal = document.getElementById('checkout-modal');
const cartSummary = document.getElementById('cart-summary');
const cancelCheckoutButton = document.getElementById('cancel-checkout');

// Function to populate the cart summary in the checkout modal
function populateCartSummary() {
  const cartSummary = document.getElementById('cart-summary'); // Select the cart summary container
  const orderListTextarea = document.getElementById('order-list'); // Select the textarea for the order list
  cartSummary.innerHTML = ''; // Clear previous content
  let total = 0;
  let orderText = ''; // Text to store product details for the textarea

  cart.forEach(item => {
    // Create a container for each product
    const productContainer = document.createElement('div');
    productContainer.classList.add('cart-summary-item');
    productContainer.style.marginBottom = '10px';

    // Create a readonly input field for the product details
    const productInput = document.createElement('input');
    productInput.type = 'text';
    productInput.readOnly = true;
    productInput.value = `${item.name} (x${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}`;
    productInput.style.width = '100%'; // Optional: Make the input field take full width
    productInput.style.marginBottom = '5px'; // Add spacing between inputs
    productContainer.appendChild(productInput);

    // Append the product container to the cart summary
    cartSummary.appendChild(productContainer);

    // Add product details to the order text
    orderText += `${item.name} (x${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}\n`;

    total += item.price * item.quantity;
  });

  // Add the total price below the product list
  const totalElement = document.createElement('p');
  totalElement.style.fontWeight = 'bold';
  totalElement.textContent = `Total: ₱${total.toFixed(2)}`;
  cartSummary.appendChild(totalElement);

  // Add total price to the order text
  orderText += `\nTotal: ₱${total.toFixed(2)}`;

  // Populate the textarea with the product list
  orderListTextarea.value = orderText;
}

// Show the checkout modal when the checkout button is clicked
checkoutButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items to the cart before checking out.');
    return;
  }
  populateCartSummary(); // Populate the cart summary
  checkoutModal.classList.remove('hidden'); // Show the checkout modal
});

// Hide the checkout modal when the cancel button is clicked
cancelCheckoutButton.addEventListener('click', () => {
  checkoutModal.classList.add('hidden'); // Hide the checkout modal
});

// Function to update the state of the checkout button
function updateCheckoutButtonState() {
  if (cart.length === 0) {
    checkoutButton.disabled = true; // Disable the button if the cart is empty
    checkoutButton.style.backgroundColor = '#ccc'; // Optional: Change button style
    checkoutButton.style.cursor = 'not-allowed';
  } else {
    checkoutButton.disabled = false; // Enable the button if the cart has items
    checkoutButton.style.backgroundColor = '#4caf50'; // Restore button style
    checkoutButton.style.cursor = 'pointer';
  }
}

// Call this function initially to set the correct state
updateCheckoutButtonState();