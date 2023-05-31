"use strict";

async function addCart(id, quantity) {
  let res = await fetch("/products/cart", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id, quantity }),
  });
  let json = await res.json();
  document.getElementById("cart-quantity").innerText = `(${json.quantity})`;
}

async function updateCart(id, quantity) {
  if (quantity > 0) {
    let res = await fetch("/products/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id, quantity }),
    });

    // cập nhập thành công
    if (res.status == 200) {
      let json = await res.json();
      document.getElementById("cart-quantity").innerText = `(${json.quantity})`;
      document.getElementById("subtotal").innerText = `$${json.subtotal}`;
      document.getElementById("total").innerText = `$${json.total}`;
      document.getElementById(`total${id}`).innerText = `$${json.item.total}`;
    }
  } else {
    // số lượng bằng 0 thì xóa luôn
    removeCart(id);
  }
}

async function removeCart(id) {
  if (confirm("Do you really want to remove this product?")) {
    let res = await fetch("/products/cart", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id }),
    });

    // cập nhập thành công
    if (res.status == 200) {
      let json = await res.json();
      document.getElementById("cart-quantity").innerText = `(${json.quantity})`;
      if (json.quantity > 0) {
        document.getElementById("subtotal").innerText = `$${json.subtotal}`;
        document.getElementById("total").innerText = `$${json.total}`;
        document.getElementById(`product${id}`).remove();
      } else {
        document.querySelector(
          ".cart-page .container"
        ).innerHTML = `<div class="text-center border py-3">
      <h3>Your cart is empty!</h3>
    </div>`;
      }
    }
  }
}

async function clearCart() {
  if (confirm("Do you really want to clear all product?")) {
    let res = await fetch("/products/cart/all", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // cập nhập thành công
    if (res.status == 200) {
      document.getElementById("cart-quantity").innerText = "(0)";

      document.querySelector(
        ".cart-page .container"
      ).innerHTML = `<div class="text-center border py-3">
      <h3>Your cart is empty!</h3>
    </div>`;
    }
  }
}

function placeorders(e) {
  e.preventDefault();

  const addressId = document.querySelector("input[name=addressId]:checked");
  if (!addressId ||  addressId.value == 0) {
    if (!e.target.checkValidity()) {
      return e.target.reportValidity();
    }
  }
  e.target.submit()
}
