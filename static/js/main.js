function writeCookie(name, value, days) {
  // Write a cookie to store info function

  var date, expires;
  if (days) {
    date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = name + "=" + value + ";expires=" + expires + "; path=/";
}

function readCookie(name) {
  // Read cookie info function

  var i,
    c,
    ca,
    nameEQ = name + "=";
  ca = document.cookie.split(";");
  for (i = 0; i < ca.length; i++) {
    c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return "";
}

function checkCookie(name) {
  // Check if cookie exists

  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return true;
    }
  }
  return false;
}

function addToCart(product, price) {
  // Add elements to the Cart

  const now = new Date();

  const currentCart = localStorage.getItem("shoppingCart");
  const article = {
    product: product,
    price: price,
    quantity: 1,
    expiry: now.getTime() + 60000,
  };
  let cart = JSON.parse(currentCart);

  if (currentCart === null) {
    // If Cart is null, create a list to store the dictionary with the product info
    cart = [];
    cart.push(article);
  } else {
    // Iterate through cart to increase quantity or add a new product
    let added = false;
    for (let index = 0; index < cart.length; index++) {
      if (cart[index].product == article.product) {
        cart[index].quantity += 1;
        cart[index].price =
          parseFloat(article.price) + parseFloat(cart[index].price);
        added = true;
        break;
      }
    }
    if (added == false) {
      cart.push(article);
    }
  }
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

function displayCart(shoppingCart) {
  // Displaying Shopping Cart

  // Create a table body element
  var rows = document.createElement("tbody");
  shoppingCart.forEach((item) => {
    var row = document.createElement("tr");
    // Create the columns of each row
    var colProd = document.createElement("td");
    colProd.textContent = item.product;

    var colQuantity = document.createElement("td");
    colQuantity.textContent = item.quantity;

    var colPrice = document.createElement("td");
    colPrice.textContent = item.price;

    row.appendChild(colProd);
    row.appendChild(colQuantity);
    row.appendChild(colPrice);

    rows.appendChild(row);
  });
  return rows;
}

function computeCheckout() {
  // Compute Shopping Cart checkout function
  var subtotalElement = document.getElementById("subtotal");
  var shippingElement = document.getElementById("shipping");
  var totalElement = document.getElementById("total");

  // Parsing the shopping cart to obtain the information
  var shoppingCart = JSON.parse(localStorage.shoppingCart);
  var total = 0;
  for (let i = 0; i < shoppingCart.length; i++) {
    total += parseFloat(shoppingCart[i].price);
  }

  subtotalElement.textContent = total;
  shippingElement.textContent = 10;
  totalElement.textContent = total + 10;
}

function refreshCart() {
  // Function to refresh the shopping Cart and delete it in case expire time has been reached
  let cart = JSON.parse(localStorage.shoppingCart);
  const now = new Date();

  if (now.getTime() > cart[0].expiry) {
    localStorage.removeItem("shoppingCart");
    return null;
  }
}

function createDropdownMenus(items) {
  // Create Blocks of articles categories function

  var dropdownMenus = document.createElement("div");
  dropdownMenus.classList.add(
    "dropdown-menu",
    "position-absolute",
    "bg-secondary",
    "border-0",
    "rounded-0",
    "w-100",
    "m-0"
  );
  for (let i = 0; i < items.length; i++) {
    var dropdownItem = document.createElement("a");
    dropdownItem.classList.add("dropdown-item");
    dropdownItem.setAttribute("href", "#");
    dropdownItem.textContent = items[i];
    dropdownMenus.appendChild(dropdownItem);
  }
  return dropdownMenus;
}

function handleDropdownClick() {
  // Appending the article categories to the drop down menu

  var items = this.dataset.myVar;
  var dropdownMenus = createDropdownMenus(JSON.parse(items));
  this.parentNode.appendChild(dropdownMenus);
}

function retrieveImageAPI() {
  // Funtion to retrieve images from an API. The items are loaded from the HTML
  // and a call to API is made for each article

  const API_KEY = "6VCJQhc1queGZvJNmpBUuXIVRrohMFo6ES56mMUPIxVviTkapDTbRIn2";
  // Load images from API and set them
  const images = document.getElementsByClassName("img-fluid w-100");

  for (let i = 0; i < images.length; i++) {
    const QUERY = images[i].dataset.product;
    let COLOR = images[i].dataset.color.toLowerCase();

    // Some colors are 'two worded' i.e: 'Light Blue', thus only the second term is considered
    if (COLOR.split(" ").length > 1) {
      COLOR = COLOR.split(" ")[1];
    }

    fetch(
      `https://api.pexels.com/v1/search?query=${QUERY}&per_page=2&color=${COLOR}`,
      {
        headers: {
          Authorization: API_KEY,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Two pictures are taken from each call, one is randomly chosen, so that images are not repeated
        images[i].setAttribute(
          "src",
          data.photos[Math.round(Math.random())].src.tiny
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

function filters() {
  // Function that filters items by color
  const blackCheckbox = document.getElementById("color-black").checked;
  const whiteCheckbox = document.getElementById("color-white").checked;
  const redCheckbox = document.getElementById("color-red").checked;
  const greyCheckbox = document.getElementById("color-grey").checked;

  // If any checkbox is True, execute filter, if it is false, Reset filters
  if (blackCheckbox || whiteCheckbox || redCheckbox || greyCheckbox) {
    const items = document.getElementsByClassName(
      "col-lg-4 col-md-6 col-sm-12 pb-1"
    );

    for (let i = 0; i < items.length; i++) {
      const color = items[i].dataset.color;

      if (blackCheckbox & (color != "Black")) {
        // If element is not color of filter, remove it
        items[i].remove();
        i -= 1;
      } else if (whiteCheckbox & (color != "White")) {
        items[i].remove();
        i -= 1;
      } else if (redCheckbox & (color != "Red")) {
        items[i].remove();
        i -= 1;
      } else if (greyCheckbox & (color != "Grey")) {
        items[i].remove();
        i -= 1;
      }
    }
  } else {
    location.reload();
  }
}

function checkPasswords(event) {
  // Function that checks the passwords of the register form
  // The form is stopped from being submitted until passwords are checked

  event.preventDefault();
  let password1 = document.getElementById("passwordRegister").value;
  let password2 = document.getElementById("passwordRegister2").value;

  if (password1 != password2) {
    let modalFooter = document.getElementById("modalFooter");
    let alert = document.createElement("div");
    alert.classList.add("alert-danger");
    alert.textContent = "Passwords must match";
    modalFooter.appendChild(alert);
  } else {
    let regsiterForm = document.getElementById("registerForm");
    regsiterForm.action = "/register";
    regsiterForm.method = "POST";
    regsiterForm.submit();
  }
}

function logout() {
  // Function to log out users
  // Logout will only apply if there is a session open
  if (document.getElementById("emailLink").textContent != "Login") {
    document.getElementById("logoutText").textContent = "Logout";
  }
  return;
}

// Actions when Load Document
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname === "/") {
    // Actions for index.html
    // Cookie with session
    writeCookie("email", document.body.getAttribute("data-my-var"), 0.3);
    document.getElementById("emailLink").textContent += readCookie("email");

    // Call logout function
    logout();

    // Set article images with an API
    retrieveImageAPI();

    // Submit search form and create search cookie
    const myForm = document.getElementById("searchForm");
    const myInput = document.getElementById("itemToSearch");

    myInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // prevent default form submission behavior
        writeCookie("search", myInput.value, 0.3);

        myForm.submit(); // submit the form
      }
    });
  } else if (window.location.pathname === "/search") {
    retrieveImageAPI();
    document.getElementById("emailLink").textContent += readCookie("email");
    document.getElementById("searchFor").textContent += readCookie("search");
  } else if (window.location.pathname === "/cart") {
    // Compute Checkout
    computeCheckout();
    // Appending to the table
    const table = document.querySelectorAll(
      ".table.table-bordered.text-center.mb-0"
    );
    table[0].appendChild(displayCart(JSON.parse(localStorage.shoppingCart)));
  }
  // Refresh Shopping Cart
  refreshCart();
  // Add Counter to Upper Right Cart Icon
  document.querySelector("#cartCount").textContent = JSON.parse(
    localStorage.getItem("shoppingCart")
  ).length;
});

// Add categories to the dropdown 'Categories'
const dropdownToggles = document.querySelectorAll(".nav-link.dropdown-toggle");
dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", handleDropdownClick); // Add the event listener to each element
});

// Create a shopping cart using Local Storage
const cartButtons = document.querySelectorAll(".btn.btn-sm.text-dark.p-0");
cartButtons.forEach((toggle) => {
  toggle.addEventListener("click", function () {
    addToCart(
      this.getAttribute("data-product"),
      this.getAttribute("data-price")
    );
  });
});

// Add filters to search history
const checkboxs = document.querySelectorAll(".custom-control-input");
checkboxs.forEach((toggle) => {
  toggle.addEventListener("click", function () {
    filters();
  });
});

// Check passwords in Register modal
let registerButton = document.getElementById("regsiterButton");
registerButton.addEventListener("click", function (event) {
  checkPasswords(event);
});
