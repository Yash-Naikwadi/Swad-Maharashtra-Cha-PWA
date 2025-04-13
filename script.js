// Basic cart functionality
document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartCount = document.querySelector(".cart-count");

  let cartItems = 0;

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      cartItems++;
      cartCount.textContent = cartItems;

      // Get the product name
      const productName = this.parentElement.querySelector("h3").textContent;

      // Animation feedback
      this.textContent = "Added!";
      this.style.backgroundColor = "#4caf50";

      // Show notification
      showNotification(`Added ${productName} to cart!`);

      // Reset button after animation
      setTimeout(() => {
        this.textContent = "Add to Cart";
        this.style.backgroundColor = "#ff6f00";
      }, 1500);
    });
  });

  // Simple notification function
  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

    // Apply styles
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "#4caf50";
    notification.style.color = "white";
    notification.style.padding = "12px 20px";
    notification.style.borderRadius = "4px";
    notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    notification.style.zIndex = "1000";
    notification.style.transition = "opacity 0.3s ease";

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Skip if it's not an anchor link
      if (this.getAttribute("href").charAt(0) !== "#") return;

      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: "smooth",
        });
      }
    });
  });
});
