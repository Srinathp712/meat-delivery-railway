// Load cart data from localStorage or initialize as an empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to add an item to the cart
function addToCart(product, price) {
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => item.name === product);

    if (!existingItem) {
        cart.push({ name: product, price: price, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product} added to cart!`);
    } else {
        alert(`${product} is already in the cart!`);
    }
    displayCart();
}

// Function to display cart items
function displayCart() {
    const cartContainer = document.getElementById("cartContainer");
    const totalPriceElement = document.getElementById("totalPrice");

    if (!cartContainer || !totalPriceElement) return;

    cartContainer.innerHTML = "";
    let totalPrice = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceElement.innerHTML = "<strong>Total Price: ₹0</strong>";
        return;
    }

    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `
            <hr>
            <p><strong>${item.name}</strong> - ₹${item.price}/kg</p>
            <label>Quantity:</label>
            <select onchange="updateQuantity(${index}, this.value)">
                ${[1, 1.5, 2, 3, 4, 5].map(q => `
                    <option value="${q}" ${item.quantity == q ? "selected" : ""}>${q}kg</option>
                `).join('')}
            </select>
            <p><strong>Subtotal: ₹<span id="subtotal-${index}">${(item.price * item.quantity).toFixed(2)}</span></strong></p>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartContainer.appendChild(itemDiv);
        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.innerHTML = `<strong>Total Price: ₹${totalPrice.toFixed(2)}</strong>`;
}

// Function to update quantity
function updateQuantity(index, newQuantity) {
    cart[index].quantity = parseFloat(newQuantity);
    localStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById(`subtotal-${index}`).textContent = (cart[index].price * cart[index].quantity).toFixed(2);
    displayCart();
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// Function to handle order submission
document.addEventListener("DOMContentLoaded", function () {
    displayCart();

    const orderForm = document.getElementById("orderForm");
    if (orderForm) {
        orderForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const address = document.getElementById("address").value.trim();
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (!name || !phone || !address) {
                alert("⚠️ Please fill in all details.");
                return;
            }

            if (cart.length === 0) {
                alert("⚠️ Your cart is empty. Add some items before placing an order.");
                return;
            }

            // Calculate total price
            let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Prepare order data
            const orderData = { name, phone, address, order_details: JSON.stringify({ items: cart, totalPrice }) };

            console.log("📦 Sending Order Data:", JSON.stringify(orderData, null, 2));

            try {
                let response = await fetch("/order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                });

                let data = await response.json();
                console.log("📥 Response from Server:", response.status, data);

                if (response.ok && data.success) {
                    localStorage.removeItem("cart");
                    showOrderSuccessMessage();
                } else {
                    alert(`⚠️ Order failed: ${data.message || "Unknown error"}`);
                }
            } catch (error) {
                console.error("⚠️ Error:", error);
                alert("⚠️ Something went wrong. Check your internet connection.");
            }
        });
    }
});

// Function to show order success message
function showOrderSuccessMessage() {
    document.body.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <h1 style="font-size: 48px; color: green;">🎉 Hooray! Order Placed!</h1>
            <p style="font-size: 24px;">Sit back and relax, we will deliver your fresh meat to your home.</p>
        </div>
    `;
}
