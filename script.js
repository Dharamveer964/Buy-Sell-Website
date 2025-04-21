function init() {
  // Mobile Menu Toggle
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  const sellForm = document.getElementById("sellForm");
  const productList = document.getElementById("productList");

  // Create Modal
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Edit Product</h2>
      <label>Image URL:</label>
      <input type="text" id="editImageUrl" />

      <label>Product Name:</label>
      <input type="text" id="editName" />

      <label>Description:</label>
      <textarea id="editDescription" rows='4'></textarea>

      <label>Price (₹):</label>
      <input type="number" id="editPrice" />

      <div class="modal-buttons">
        <button id="saveEditBtn">Save</button>
        <button id="cancelEditBtn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let editIndex = null; // Keep track of which product is being edited

  // Handle Form Submission
  sellForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const productImageUrl = document.getElementById("productImageUrl").value;
    const productName = document.getElementById("productName").value;
    const productDescription =
      document.getElementById("productDescription").value;
    const productPrice = document.getElementById("productPrice").value;

    if (productName && productDescription && productPrice) {
      if (productImageUrl.trim() && !isValidURL(productImageUrl)) {
        alert("Invalid Image URL!");
        return;
      }

      const product = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice).toFixed(2),
        imageUrl: productImageUrl || "./images/image_avatar.jpg",
      };

      let products = JSON.parse(localStorage.getItem("products")) || [];
      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));

      alert("Product added successfully!");
      sellForm.reset();
      displayProducts();
    }
  });

  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  function displayProducts() {
    productList.innerHTML = "";

    const products = JSON.parse(localStorage.getItem("products")) || [];

    if (products.length === 0) {
      const noProductsText = document.createElement("p");
      noProductsText.textContent = "No products available yet.";
      productList.appendChild(noProductsText);
    } else {
      products.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const boxDiv = document.createElement("div");
        boxDiv.classList.add("box");

        const imageDiv = document.createElement("div");
        imageDiv.classList.add("image");
        const image = document.createElement("img");
        image.src = product.imageUrl || "./images/image_avatar.jpg";
        image.alt = product.name;
        imageDiv.appendChild(image);

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("content");
        const nameHeading = document.createElement("h3");
        nameHeading.textContent = product.name;
        const priceSpan = document.createElement("span");
        priceSpan.textContent = `Price: ₹${product.price}`;
        contentDiv.appendChild(nameHeading);
        contentDiv.appendChild(priceSpan);

        boxDiv.appendChild(imageDiv);
        boxDiv.appendChild(contentDiv);

        const descriptionPara = document.createElement("p");
        descriptionPara.textContent = `Description: ${product.description}`;

        // Buttons container
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "10px";

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteProduct(index));

        // Edit button
        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => openEditModal(index));

        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(editButton);

        card.appendChild(boxDiv);
        card.appendChild(descriptionPara);
        card.appendChild(buttonContainer);

        productList.appendChild(card);
      });
    }
  }

  function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
  }

  function openEditModal(index) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products[index];

    document.getElementById("editImageUrl").value = product.imageUrl;
    document.getElementById("editName").value = product.name;
    document.getElementById("editDescription").value = product.description;
    document.getElementById("editPrice").value = product.price;

    editIndex = index;
    modal.style.display = "flex";
  }

  document.getElementById("saveEditBtn").addEventListener("click", () => {
    const updatedImageUrl = document.getElementById("editImageUrl").value;
    const updatedName = document.getElementById("editName").value;
    const updatedDescription = document.getElementById("editDescription").value;
    const updatedPrice = document.getElementById("editPrice").value;

    if (updatedName && updatedDescription && updatedPrice) {
      let products = JSON.parse(localStorage.getItem("products")) || [];

      products[editIndex] = {
        name: updatedName,
        description: updatedDescription,
        price: parseFloat(updatedPrice).toFixed(2),
        imageUrl: updatedImageUrl || "./images/image_avatar.jpg",
      };

      localStorage.setItem("products", JSON.stringify(products));
      modal.style.display = "none";
      displayProducts();
    }
  });

  document.getElementById("cancelEditBtn").addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("load", displayProducts);
}

init();
