function filterProducts(category) {
  const allProducts = document.querySelectorAll('.product-card');
  allProducts.forEach((product) => {
    if (category === 'all' || product.classList.contains(category)) {
      product.style.display = 'flex';
    } else {
      product.style.display = 'none';
    }
  });
}

const filterButtons = document.querySelectorAll('.filter-buttons button');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

document.querySelectorAll('.filter-buttons button').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('onclick').match(/'([^']+)'/)[1];
    filterProducts(category);
  });
});

const popup = document.getElementById('popup-notification');
const confirmBtn = document.getElementById('confirm-btn');

function showPopup() {
  popup.classList.remove('hidden');
}

confirmBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

const checkoutForm = document.getElementById("checkout-form");
const confirmCheckoutButton = document.getElementById("confirm-checkout");
const requiredInputs = checkoutForm.querySelectorAll("input[required], textarea[required]");

const checkFormValidity = () => {
  let isValid = true;

  requiredInputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
    }
  });

  confirmCheckoutButton.disabled = !isValid;
};

requiredInputs.forEach((input) => {
  input.addEventListener("input", checkFormValidity);
});

checkFormValidity();

const checkoutInputs = checkoutForm.querySelectorAll('input');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutButton = document.querySelector('.checkOut');
const cancelCheckoutButton = document.getElementById('cancel-checkout');

function showThankYouNotification() {
  checkoutModal.classList.add('hidden');
  const thankYouPopup = document.createElement('div');
  thankYouPopup.classList.add('popup');
  thankYouPopup.innerHTML = `
    <div class="popup-content">
      <p>Thank you for ordering! Kindly wait for our reply email at google mail to know if your order is ready.</p>
      <button id="close-thank-you">OK</button>
    </div>
  `;
  document.body.appendChild(thankYouPopup);
  const closeThankYouButton = document.getElementById('close-thank-you');
  closeThankYouButton.addEventListener('click', () => {
    thankYouPopup.remove();
  });
}

checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(checkoutForm);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      checkoutModal.classList.add('hidden');
      document.body.appendChild(thankYouPopup);
      const closeThankYouButton = document.getElementById('close-thank-you');
      closeThankYouButton.addEventListener('click', () => {
        thankYouPopup.remove();
      });
      checkoutForm.reset();
    } else {
      console.error('Error: Response not OK', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('dashboardNotificationShown')) {
    const notificationPopup = document.createElement('div');
    notificationPopup.classList.add('popup');
    notificationPopup.innerHTML = `
      <div class="popup-content">
        <p>ORDERS ONLY AVAILABLE FOR PICK UP, CURRENTLY NO DELIVERY</p>
        <button id="close-notification">OK</button>
      </div>
    `;
    document.body.appendChild(notificationPopup);
    const closeNotificationButton = document.getElementById('close-notification');
    closeNotificationButton.addEventListener('click', () => {
      notificationPopup.remove();
      localStorage.setItem('dashboardNotificationShown', 'true');
    });
  }
});

// Array to store cart items
let cart = [];

// Function to render the cart
function renderCart() {
  const cartList = document.querySelector('.listCart');
  const totalPriceElement = document.querySelector('.total-price');

  // Clear the cart list
  cartList.innerHTML = '';

  // Calculate total price
  let totalPrice = 0;

  // Render each item in the cart
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <p>${item.name} - ₱${item.price}</p>
      <button class="remove-btn" data-id="${item.id}">Remove</button>
    `;
    cartList.appendChild(cartItem);
    totalPrice += parseFloat(item.price);
  });

  // Update total price
  totalPriceElement.textContent = `Total Price: ₱${totalPrice.toFixed(2)}`;

  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      removeFromCart(productId);
    });
  });
}

// Function to add a product to the cart
function addToCart(product) {
  cart.push(product);
  renderCart();
}

// Function to remove a product from the cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

// Add event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.getAttribute('data-id');
    const productName = button.getAttribute('data-name');
    const productPrice = button.getAttribute('data-price');

    // Create a product object
    const product = {
      id: productId,
      name: productName,
      price: productPrice,
    };

    // Add the product to the cart
    addToCart(product);

    // Optional: Show a notification
    alert(`${productName} has been added to the cart!`);
  });
});

function populateCartItems() {
  const cartSummary = document.getElementById('cart-summary');
  const cartItemsField = document.getElementById('cart-items');
  cartSummary.innerHTML = '';
  let cartItemsText = '';

  cart.forEach((item) => {
    const itemInput = document.createElement('input');
    itemInput.type = 'text';
    itemInput.value = `${item.name} - ${item.quantity} x ₱${item.price.toFixed(2)}`;
    itemInput.readOnly = true;
    itemInput.classList.add('cart-item-input');
    cartSummary.appendChild(itemInput);
    cartItemsText += `${item.name} - ${item.quantity} x ₱${item.price.toFixed(2)}\n`;
  });

  cartItemsField.value = cartItemsText;
}

checkoutButton.addEventListener('click', () => {
  populateCartItems();
  checkoutModal.classList.remove('hidden');
});

cancelCheckoutButton.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
});

confirmCheckoutButton.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
  const thankYouPopup = document.createElement('div');
  thankYouPopup.classList.add('popup');
  thankYouPopup.innerHTML = `
    <div class="popup-content">
      <p>Your order has been placed, kindly wait for our reply email. Thank you!</p>
      <button id="close-thank-you">OK</button>
    </div>
  `;
  document.body.appendChild(thankYouPopup);
  const closeThankYouButton = document.getElementById('close-thank-you');
  closeThankYouButton.addEventListener('click', () => {
    thankYouPopup.remove();
  });
});

// Add event listeners to all "Details" buttons
document.querySelectorAll('.details-btn').forEach(button => {
  button.addEventListener('click', () => {
    const detailsList = button.parentElement.nextElementSibling; // Get the <ul> element

    if (detailsList.classList.contains('visible')) {
      detailsList.style.height = '0'; // Collapse the list
      detailsList.classList.remove('visible');
      button.textContent = 'Details'; // Update button text
    } else {
      detailsList.style.height = `${detailsList.scrollHeight}px`; // Expand the list
      detailsList.classList.add('visible');
      button.textContent = 'Hide Details'; // Update button text
    }
  });
});



