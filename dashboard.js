function filterProducts(category) {
  const allProducts = document.querySelectorAll('.product-card');
  allProducts.forEach((product) => {
    if (category === 'all' || product.classList.contains(category)) {
      product.style.display = 'flex'; // Use 'flex' to maintain layout
    } else {
      product.style.display = 'none'; // Hide non-matching products
    }
  });
}

// Select all filter buttons
const filterButtons = document.querySelectorAll('.filter-buttons button');

// Add event listeners to each button
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove the active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));

    // Add the active class to the clicked button
    button.classList.add('active');
  });
});

// Ensure the buttons are properly connected to the function
document.querySelectorAll('.filter-buttons button').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('onclick').match(/'([^']+)'/)[1];
    filterProducts(category);
  });
});

// Select all "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

// Select the pop-up and confirm button
const popup = document.getElementById('popup-notification');
const confirmBtn = document.getElementById('confirm-btn');

// Add event listeners to each "Add to Cart" button
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const product = {
      name: button.dataset.name,
      price: parseFloat(button.dataset.price),
      image: button.dataset.image,
    };
    addToCart(product);
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

// Select the checkout form and modal elements
const checkoutForm = document.getElementById('checkout-form');
const confirmCheckoutButton = document.getElementById('confirm-checkout');
const checkoutInputs = checkoutForm.querySelectorAll('input');
const checkoutModal = document.getElementById('checkout-modal');

// Select the checkout button and modal elements
const checkoutButton = document.querySelector('.checkOut');
const cancelCheckoutButton = document.getElementById('cancel-checkout');

// Variable to store the timer ID
let confirmButtonTimer;

// Function to disable the confirm button and start the timer
function startConfirmButtonTimer() {
  // Clear any existing timer to prevent multiple timers
  if (confirmButtonTimer) {
    clearInterval(confirmButtonTimer);
  }

  confirmCheckoutButton.disabled = true; // Disable the button
  confirmCheckoutButton.textContent = 'Please wait 5 seconds...'; // Update button text

  let timer = 5; // Set the timer to 5 seconds
  confirmButtonTimer = setInterval(() => {
    timer -= 1;
    confirmCheckoutButton.textContent = `Please wait ${timer} seconds...`;

    if (timer === 0) {
      clearInterval(confirmButtonTimer); // Stop the timer
      confirmButtonTimer = null; // Reset the timer ID
      confirmCheckoutButton.disabled = false; // Enable the button
      confirmCheckoutButton.textContent = 'Confirm'; // Reset button text
    }
  }, 1000); // Update every second
}

// Add event listeners to reset the timer whenever the form is edited
checkoutInputs.forEach(input => {
  input.addEventListener('input', () => {
    startConfirmButtonTimer(); // Restart the timer on input change
  });
});

// Show the checkout modal when the "Check Out" button is clicked
checkoutButton.addEventListener('click', () => {
  populateCartItems(); // Populate the cart items in the modal
  checkoutModal.classList.remove('hidden'); // Show the modal
  startConfirmButtonTimer(); // Start the timer when the modal is opened
});

// Hide the checkout modal when the "Cancel" button is clicked
cancelCheckoutButton.addEventListener('click', () => {
  checkoutModal.classList.add('hidden'); // Hide the modal
  if (confirmButtonTimer) {
    clearInterval(confirmButtonTimer); // Clear the timer if the modal is closed
    confirmButtonTimer = null; // Reset the timer ID
  }
});

// Function to show a thank-you notification after checkout
function showThankYouNotification() {
  // Close the checkout modal
  checkoutModal.classList.add('hidden');

  // Create the thank-you notification
  const thankYouPopup = document.createElement('div');
  thankYouPopup.classList.add('popup');
  thankYouPopup.innerHTML = `
    <div class="popup-content">
      <p>Thank you for ordering! Kindly wait for our reply email at google mail to know if your order is ready.</p>
      <button id="close-thank-you">OK</button>
    </div>
  `;

  // Append the notification to the body
  document.body.appendChild(thankYouPopup);

  // Add event listener to close the notification
  const closeThankYouButton = document.getElementById('close-thank-you');
  closeThankYouButton.addEventListener('click', () => {
    thankYouPopup.remove(); // Remove the notification from the DOM
  });
}

// Handle checkout form submission
checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent default form submission

  const formData = new FormData(checkoutForm);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      // Close the checkout modal
      checkoutModal.classList.add('hidden');

      // Append the notification to the body
      document.body.appendChild(thankYouPopup);

      // Add event listener to close the notification
      const closeThankYouButton = document.getElementById('close-thank-you');
      closeThankYouButton.addEventListener('click', () => {
        thankYouPopup.remove(); // Remove the notification from the DOM
      });

      // Reset the form
      checkoutForm.reset();
    } else {
      console.error('Error: Response not OK', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Check if the notification has already been shown
  if (!localStorage.getItem('dashboardNotificationShown')) {
    // Create the notification
    const notificationPopup = document.createElement('div');
    notificationPopup.classList.add('popup');
    notificationPopup.innerHTML = `
      <div class="popup-content">
        <p>ORDERS ONLY AVAILABLE FOR PICK UP, CURRENTLY NO DELIVERY</p>
        <button id="close-notification">OK</button>
      </div>
    `;

    // Append the notification to the body
    document.body.appendChild(notificationPopup);

    // Add event listener to close the notification
    const closeNotificationButton = document.getElementById('close-notification');
    closeNotificationButton.addEventListener('click', () => {
      notificationPopup.remove(); // Remove the notification from the DOM
      localStorage.setItem('dashboardNotificationShown', 'true'); // Mark the notification as shown
    });
  }
});

// Example cart data (replace this with your actual cart logic)
const cart = new Map();

// Function to add items to the cart
// This function takes a product object as input and adds it to the cart.
// If the product already exists in the cart, it increments its quantity.
// Otherwise, it adds the product to the cart with an initial quantity of 1.
function addToCart(product) {
  if (cart.has(product.name)) {
    const existingProduct = cart.get(product.name);
    if (typeof existingProduct.quantity === 'number') {
      existingProduct.quantity += 1; // Increment quantity if the product already exists
    } else {
      existingProduct.quantity = 1; // Initialize quantity if it doesn't exist
    }
  } else {
    cart.set(product.name, { ...product, quantity: 1 }); // Add new product to the cart
  }
}

// Function to populate the cart items in the checkout modal as non-editable input fields
function populateCartItems() {
  const cartSummary = document.getElementById('cart-summary'); // Cart summary container
  const cartItemsField = document.getElementById('cart-items'); // Hidden input field for email submission

  // Clear the cart summary container
  cartSummary.innerHTML = '';

  // Generate a summary of the cart items
  let cartItemsText = '';

  cart.forEach((item) => {
    // Create a non-editable input field for each cart item
    const itemInput = document.createElement('input');
    itemInput.type = 'text';
    itemInput.value = `${item.name} - ${item.quantity} x ₱${item.price.toFixed(2)}`;
    itemInput.readOnly = true; // Make the input field non-editable
    itemInput.classList.add('cart-item-input'); // Add a class for styling

    // Append the input field to the cart summary container
    cartSummary.appendChild(itemInput);

    // Add the item to the hidden input field for email submission
    cartItemsText += `${item.name} - ${item.quantity} x ₱${item.price.toFixed(2)}\n`;
  });

  // Update the hidden input field with the cart items
  cartItemsField.value = cartItemsText;
}

// Populate the cart items when the checkout modal is opened
checkoutButton.addEventListener('click', () => {
  populateCartItems(); // Populate the cart items in the modal
  checkoutModal.classList.remove('hidden'); // Show the modal
});

// Hide the checkout modal when the "Cancel" button is clicked
cancelCheckoutButton.addEventListener('click', () => {
  checkoutModal.classList.add('hidden'); // Hide the modal
});

// Hide the checkout modal when the "Confirm" button is clicked
confirmCheckoutButton.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');

  // Create the thank-you notification
  const thankYouPopup = document.createElement('div');
  thankYouPopup.classList.add('popup');
  thankYouPopup.innerHTML = `
    <div class="popup-content">
      <p>Your order has been placed, kindly wait for our reply email. Thank you!</p>
      <button id="close-thank-you">OK</button>
    </div>
  `;

  // Append the notification to the body
  document.body.appendChild(thankYouPopup);

  // Add event listener to close the notification
  const closeThankYouButton = document.getElementById('close-thank-you');
  closeThankYouButton.addEventListener('click', () => {
    thankYouPopup.remove(); // Remove the notification from the DOM
  });
});
