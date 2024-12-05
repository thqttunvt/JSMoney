// Prevent the form from reloading the page when submitted
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Collect product data from the form
  let productCode = document.querySelector("#product-code").value;
  let productName = document.querySelector("#product-name").value;
  let oldPrice = document.querySelector("#old-price").value;
  let newPrice = document.querySelector("#new-price").value;
  let discountPrice = document.querySelector("#discount-price").value;

  // Validate form inputs
  if (
    !productCode ||
    !productName ||
    !oldPrice ||
    !newPrice ||
    !discountPrice
  ) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  // Create product object
  let item = {
    id: new Date().toISOString(),
    productCode: productCode.trim(),
    productName: productName.trim(),
    oldPrice: oldPrice.trim(),
    newPrice: newPrice.trim(),
    discountPrice: discountPrice.trim(),
    options: [], // Empty array for options
    optionssize: [],
  };

  addItemToUI(item); // Display the product on the UI
  addItemToLS(item); // Store the product in localStorage

  // Clear the form inputs after submission
  document.getElementById("product-code").value = "";
  document.getElementById("product-name").value = "";
  document.getElementById("old-price").value = "";
  document.getElementById("new-price").value = "";
  document.getElementById("discount-price").value = "";
});

// hàm hiển thị item lên ui
const addItemToUI = (item) => {
  const {
    id,
    productCode,
    productName,
    oldPrice,
    newPrice,
    discountPrice,
    options = [],
    optionssize = [],
  } = item;
  let newCard = document.createElement("div");
  newCard.className = "product-item";
  newCard.innerHTML = `
        <div class="product-details-code">${productCode}</div>
        <div class="product-details-name">${productName}</div>
        <div class="product-details-oldprice">${oldPrice}</div>
        <div class="product-details-newprice">${newPrice}</div>
        <div class="product-details-discountprice">${discountPrice}</div>
        <button class="btn-option">Thêm Option</button>
        <button data-id="${id}" class="btn-remove">Xóa Sản Phẩm</button>
    `;
  // hiển thị các tùy chọn cho option này
  let optionContainer = document.createElement("div");
  optionContainer.className = "option-container";
  options.forEach((option) => {
    let optionItem = document.createElement("div");
    optionItem.className = "option-item";
    optionItem.innerHTML = `
            Màu: <input type="text" class="form_color" value="${option.color}">
            SL: <input type="number" class="form_amount" value="${option.quantity}" >
            <button class="btn-edit-option">Sửa</button>
            <button class="btn-add-size">+ size</button>
            <button class="btn-remove-option">Xóa</button>
        `;
    optionContainer.appendChild(optionItem);
  });
  newCard.appendChild(optionContainer);
  // hiển thị các tùy chọn cho option size này
  let sizeContainer = document.createElement("div");
  sizeContainer.className = "size-container";

  optionssize.forEach((optionsize) => {
    let optionItemSize = document.createElement("div");
    optionItemSize.className = "option-item-size";
    optionItemSize.innerHTML = `
            Size: <input type="text" class="form_size" value="${optionsize.size}">
            SL: <input type="number" class="form_amount_size" value="${optionsize.quantitysize}">
            <button class="btn-edit-size">Sửa size</button>
            <button class="btn-remove-size">Xóa size</button>
        `;
    sizeContainer.appendChild(optionItemSize);
  });
  newCard.appendChild(sizeContainer);
  document.querySelector("#product-list").appendChild(newCard);
};

// lấy danh sánh từ ls
const getList = () => {
  return JSON.parse(localStorage.getItem("list")) || [];
};

// hàm add item vào ls
const addItemToLS = (item) => {
  let list = getList();
  list.push(item);
  localStorage.setItem("list", JSON.stringify(list));
};

// khởi tạo để lưu trữ
const init = () => {
  let list = getList();
  list.forEach((item) => {
    addItemToUI(item);
  });
};
init();

// hàm xóa sản phẩm trong ls
const removeItemFromLS = (id) => {
  let list = getList();
  list = list.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(list));
};

//  hàm thêm option vào ls
const addOptionToLS = (productId, color, quantity) => {
  let list = getList();
  let product = list.find((item) => item.id === productId);

  // Ensure product exists
  if (!product) {
    console.error(`Product with ID ${productId} not found.`);
    return;
  }

  // Ensure the options array exists
  if (!product.options) {
    product.options = [];
  }

  // Add the new option
  product.options.push({ color, quantity });

  // Update localStorage
  localStorage.setItem("list", JSON.stringify(list));
};

//----------------------
//hàm thêm option size vào ls
const addOptionSizeToLS = (productId, size, quantitySize) => {
  let list = getList();
  let product = list.find((item) => item.id === productId);

  // Ensure product exists
  if (!product) {
    console.error(`Product with ID ${productId} not found.`);
    return;
  }

  // Ensure the optionssize array exists
  if (!product.optionssize) {
    product.optionssize = [];
  }

  // Add the new size option
  product.optionssize.push({ size, quantitySize });

  // Update localStorage
  localStorage.setItem("list", JSON.stringify(list));
};

//hàm chỉnh sửa optionsSize trong   ls
const editOptionSizeInLS = (productId, oldSize, newSize, newQuantitySize) => {
  let list = getList();
  let product = list.find((item) => item.id === productId);
  let optionsize = product.optionssize.find(
    (option) => option.size === oldSize
  );

  if (!product || !product.optionssize) {
    console.error("Product or optionssize not found");
    return;
  }

  // cập nhật optionsSize sau khi sửa
  if (optionsize) {
    optionsize.size = newSize;
    optionsize.quantitysize = newQuantitySize;
    localStorage.setItem("list", JSON.stringify(list));
  }
};

//hàm xóa optionsSize trong ls
const removeOptionSizeFromLS = (productId, size) => {
  let list = getList();
  let product = list.find((item) => item.id === productId);
  product.optionssize = product.optionssize.filter(
    (option) => option.size !== size
  );
  localStorage.setItem("list", JSON.stringify(list));
};
//-------------
//  hàm xóa option trong ls
const removeOptionFromLS = (productId, color) => {
  let list = getList();
  let product = list.find((item) => item.id === productId);
  product.options = product.options.filter((option) => option.color !== color);
  localStorage.setItem("list", JSON.stringify(list));
};

// hàm chỉnh sửa option trong ls
const editOptionInLS = (productId, oldColor, newColor, newQuantity) => {
  let list = getList();
  let product = list.find((item) => item.id === productId);
  let option = product.options.find((option) => option.color === oldColor);

  if (!product || !product.optionssize) {
    console.error("Product or optionssize not found");
    return;
  }

  // Update option if it exists
  if (option) {
    option.color = newColor;
    option.quantity = newQuantity;
    localStorage.setItem("list", JSON.stringify(list));
  }
};
//---------------

// Handle option add, edit, and remove actions
document.querySelector("#product-list").addEventListener("click", (event) => {
  // thêm mới option
  if (event.target.classList.contains("btn-option")) {
    const parentElement = event.target.parentElement;
    const productId = parentElement.querySelector(".btn-remove").dataset.id;

    // tạo option mới trong trường hiển thị lên ui
    let optionItem = document.createElement("div");
    optionItem.className = "option-item";
    optionItem.innerHTML = `
            Màu: <input type="text" class="form_color" placeholder="Nhập màu">
            SL: <input type="number" class="form_amount" placeholder="Nhập số lượng">
            <button class="btn-edit-option">Sửa</button>
            <button class="btn-add-size">+ size</button>
            <button class="btn-remove-option">Xóa</button>
        `;
    parentElement.appendChild(optionItem);

    // lưu tùy chọn khi giá trị thay đổi
    optionItem
      .querySelector("input[type='text']")
      .addEventListener("change", () => {
        const color = optionItem.querySelector("input[type='text']").value;
        const quantity = optionItem.querySelector("input[type='number']").value;
        if (color && quantity) {
          addOptionToLS(productId, color, quantity);
        }
      });

    optionItem
      .querySelector("input[type='number']")
      .addEventListener("change", () => {
        const color = optionItem.querySelector("input[type='text']").value;
        const quantity = optionItem.querySelector("input[type='number']").value;
        if (color && quantity) {
          addOptionToLS(productId, color, quantity);
        }
      });
  }

  //thêm mới option size

  if (event.target.classList.contains("btn-add-size")) {
    const parentElement = event.target.parentElement;
    const productId =
      parentElement.querySelector(".btn-remove-option").dataset.id;

    // tạo option mới trong trường hiển thị lên ui
    let optionItemSize = document.createElement("div");
    optionItemSize.className = "option-item";
    optionItemSize.innerHTML = `
            Size: <input type="text" class="form_size" placeholder="Nhập size">
            SL: <input type="number" class="form_amount_size" placeholder="Nhập số lượng">
            <button class="btn-edit-size">Sửa size</button>
            <button class="btn-remove-size">Xóa size</button>
        `;
    parentElement.appendChild(optionItemSize);

    // lưu tùy chọn khi giá trị thay đổi
    optionItemSize
      .querySelector("input[type='text']")
      .addEventListener("change", () => {
        const size = optionItemSize.querySelector("input[type='text']").value;
        const quantitysize = optionItemSize.querySelector(
          "input[type='number']"
        ).value;
        if (size && quantitysize) {
          addOptionSizeToLS(productId, size, quantitysize);
        }
      });

    optionItemSize
      .querySelector("input[type='number']")
      .addEventListener("change", () => {
        const size = optionItemSize.querySelector("input[type='text']").value;
        const quantitysize = optionItemSize.querySelector(
          "input[type='number']"
        ).value;
        if (size && quantitysize) {
          addOptionSizeToLS(productId, size, quantitysize);
        }
      });
  }

  // hàm sửa option
  if (event.target.classList.contains("btn-edit-option")) {
    const optionItem = event.target.parentElement;
    const productId = event.target
      .closest(".product-item")
      .querySelector(".btn-remove").dataset.id;
    const oldColor = optionItem.querySelector("input[type='text']").value;
    const oldQuantity = optionItem.querySelector("input[type='number']").value;

    // tạo để chỉnh sửa tùy chọn
    optionItem.innerHTML = `
            Màu: <input type="text" class="form_color" value="${oldColor}">
            SL: <input type="number" class="form_amount" value="${oldQuantity}">
            <button class="btn-save-option">Save</button>
        `;

    // xử lý việc lưu chỉnh sửa
    optionItem
      .querySelector(".btn-save-option")
      .addEventListener("click", () => {
        const newColor = optionItem.querySelector("input[type='text']").value;
        const newQuantity = optionItem.querySelector(
          "input[type='number']"
        ).value;

        if (newColor && newQuantity) {
          editOptionInLS(productId, oldColor, newColor, newQuantity);
          optionItem.innerHTML = `
                    Màu: <input type="text" class="form_color" value="${newColor}" readonly>
                    SL: <input type="number" class="form_amount" value="${newQuantity}" readonly>
                    <button class="btn-edit-option">Sửa</button>
                    <button class="btn-add-size">+ size</button>
                    <button class="btn-remove-option">Xóa</button>
                `;
        }
      });
  }
  // hàm  xóa option
  if (event.target.classList.contains("btn-remove-option")) {
    const productId = parentElement
      .closest(".product-item")
      .querySelector(".btn-remove").dataset.id;
    const color =
      event.target.previousElementSibling.previousElementSibling.value;

    let isConfirmed = confirm("Bạn có chắc muốn xóa option không?");
    if (isConfirmed) {
      event.target.parentElement.remove(); // Remove the option from the UI
      removeOptionFromLS(productId, color); // Remove the option from localStorage
    }
  }
  // hàm xóa sản phẩm
  if (event.target.classList.contains("btn-remove")) {
    let idRemove = event.target.dataset.id;
    let isConfirmed = confirm("Bạn có chắc muốn xóa sản phẩm không?");
    if (isConfirmed) {
      event.target.parentElement.remove(); // Remove the product from the UI
      removeItemFromLS(idRemove); // Remove the product from localStorage
    }
  }

  //hàm sửa option size
  if (event.target.classList.contains("btn-edit-size")) {
    const optionItemSize = event.target.parentElement;
    const productId = event.target
      .closest(".product-item")
      .querySelector(".btn-remove").dataset.id;
    const oldSize = optionItemSize.querySelector("input[type='text']").value;
    const oldQuantitySize = optionItemSize.querySelector(
      "input[type='number']"
    ).value;

    // tạo để chỉnh sửa tùy chọn
    optionItemSize.innerHTML = `
            Size: <input type="text" class="form_size" value="${oldSize}">
            SL: <input type="number" class="form_amount_size" value="${oldQuantitySize}">
            <button class="btn-save-size">Save</button>
        `;

    // xử lý việc lưu chỉnh sửa
    optionItemSize
      .querySelector(".btn-save-size")
      .addEventListener("click", () => {
        const newSize =
          optionItemSize.querySelector("input[type='text']").value;
        const newQuantitySize = optionItemSize.querySelector(
          "input[type='number']"
        ).value;

        if (newSize && newQuantitySize) {
          editOptionSizeInLS(productId, oldSize, newSize, newQuantitySize);
          optionItemSize.innerHTML = `
                    Size: <input type="text" class="form_size" value="${newSize}">
                    SL: <input type="number" class="form_amount_size" value="${newQuantitySize}">
                    <button class="btn-edit-size">Sửa size</button>
                    <button class="btn-remove-size">Xóa size</button>
                `;
        }
      });
  }
  //hàm xóa option size
  if (event.target.classList.contains("btn-remove-size")) {
    const productId = event.target
      .closest(".product-item")
      .querySelector(".btn-remove").dataset.id;
    const size =
      event.target.previousElementSibling.previousElementSibling.value;

    let isConfirmed = confirm("Bạn có chắc muốn xóa option size không?");
    if (isConfirmed) {
      event.target.parentElement.remove(); // Remove the option from the UI
      removeOptionSizeFromLS(productId, size); // Remove the option from localStorage
    }
  }
});

// tìm kiếm bằng tên sản phẩm
document
  .querySelector("input[name='find-product']")
  .addEventListener("keyup", (event) => {
    let inputValue = event.target.value.toLowerCase();
    let list = getList();
    let filteredList = list.filter((item) =>
      item.productName.toLowerCase().includes(inputValue)
    );

    // Clear the current UI list and display the filtered list
    document.querySelector("#product-list").innerHTML = "";
    filteredList.forEach((item) => {
      addItemToUI(item);
    });
  });
