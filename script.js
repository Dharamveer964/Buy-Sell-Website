function init() {
  // Mobile Menu Toggle
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");

  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Handle Form Submission
  const sellForm = document.getElementById("sellForm");
  const productList = document.getElementById("productList");

  // Load products from local storage on page load
  window.addEventListener("load", displayProducts);

  // Check for valid Url's
  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  sellForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const productImageUrl = document.getElementById("productImageUrl").value;
    const productName = document.getElementById("productName").value;
    const productDescription =
      document.getElementById("productDescription").value;
    const productPrice = document.getElementById("productPrice").value;

    if (productImageUrl.trim()) {
      if (!isValidURL(productImageUrl)) {
        alert("Invalid Image Url!");
        return;
      }
    }

    if (productName && productDescription && productPrice) {
      const product = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice).toFixed(2),
        imageUrl: productImageUrl
          ? productImageUrl
          : "./images/image_avatar.jpg",
      };

      // Save to local storage
      let products = JSON.parse(localStorage.getItem("products")) || [];
      console.log(product);
      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));

      alert("Product added successfully!");
      sellForm.reset();
      displayProducts();
    }
  });

  // Display Products using Cards
  function displayProducts() {
    productList.innerHTML = "";

    const products = JSON.parse(localStorage.getItem("products")) || [];

    if (products.length === 0) {
      productList.innerHTML = "<p>No products available yet.</p>";
    } else {
      products.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
      <div class="box">
        <div class="image">
          <img src=${product.imageUrl || "./images/image_avatar.jpg"} alt=${
          product.name
        } />
        </div>
        <div class="content">
          <h3>${product.name}</h3>
          <p>Description: ${product.description}</p>
          <span>Price: $${product.price}</span>
        </div>
      </div>
      <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
      `;
        productList.appendChild(card);
      });
    }
  }

  // Delete Product from Local Storage
  function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
  }
}

init();
