// Prevent the form from reloading the page when submitted
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); // chặn reset trang

  // lấy thông tin sản phẩm từ from
  let productCode = document.querySelector("#product-code").value;
  let productName = document.querySelector("#product-name").value;
  let oldPrice = document.querySelector("#old-price").value;
  let newPrice = document.querySelector("#new-price").value;
  let discountPrice = document.querySelector("#discount-price").value;

  // hàm kiểm tra có để trống thông tin hay không
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

  // tạo đối tượng sản phẩm
  let item = {
    id: new Date().toISOString(),
    productCode: productCode.trim(),
    productName: productName.trim(),
    oldPrice: oldPrice.trim(),
    newPrice: newPrice.trim(),
    discountPrice: discountPrice.trim(),
    options: [], // Mảng rỗng cho options
    optionssize: [], // Mảng rỗng cho optionssize
  };

  addItemToUI(item); // thêm sản phẩm lên ui
  addItemToLS(item); // Store the product in localStorage

  // xóa dữ liệu từ from sau khi bấm thêm sản phẩm
  document.getElementById("product-code").value = "";
  document.getElementById("product-name").value = "";
  document.getElementById("old-price").value = "";
  document.getElementById("new-price").value = "";
  document.getElementById("discount-price").value = "";
});

// hàm hiển thị item lên ui
const addItemToUI = (item) => {
  //làm try catch để bắt lỗi trong 1 số trường hợp khi thông tin được hiểu thị lên ui sẽ xuất hiện lỗi
  try {
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
    const newCard = document.createElement("div");
    newCard.className = "product-item";
    newCard.innerHTML = `
          <div class="product_item_option">
              <div class="product-details-code">${productCode}</div>
              <div class="product-details-name">${productName}</div>
              <div class="product-details-oldprice">${oldPrice}</div>
              <div class="product-details-newprice">${newPrice}</div>
              <div class="product-details-discountprice">${discountPrice}</div>
              <button class="btn-option">Thêm Option</button>
              <button data-id="${id}" class="btn-remove">Xóa Sản Phẩm</button>
          </div>
      `;

    // Tạo container cho options
    const optionContainer = document.createElement("div");
    optionContainer.className = "option-container";

    // Thêm options hiện có
    if (Array.isArray(options)) {
      options.forEach((option) => {
        const optionGroup = document.createElement("div");
        optionGroup.className = "option-group";

        // Tạo option item
        const optionItem = document.createElement("div");
        optionItem.className = "option-item";
        optionItem.innerHTML = `
                  Màu: <input type="text" class="form_color" value="${
                    option.color || ""
                  }" readonly>
                  SL: <input type="number" class="form_amount" value="${
                    option.quantity || ""
                  }" readonly>
                  <button class="btn-edit-option">Sửa</button>
                  <button class="btn-add-size">Thêm size</button>
                  <button class="btn-remove-option">Xóa</button>
              `;

        // Tạo size container và thêm sizes
        const sizeContainer = document.createElement("div");
        sizeContainer.className = "size-container";

        if (Array.isArray(option.sizes)) {
          option.sizes.forEach((size) => {
            const sizeItem = document.createElement("div");
            sizeItem.className = "option-item-size";
            sizeItem.innerHTML = `
                          Size: <input type="text" class="form_size" value="${
                            size.size || ""
                          }" readonly>
                          SL: <input type="number" class="form_amount_size" value="${
                            size.quantitysize || ""
                          }" readonly>
                          <button class="btn-edit-size">Sửa size</button>
                          <button class="btn-remove-size">Xóa size</button>
                      `;
            sizeContainer.appendChild(sizeItem);
          });
        }

        optionGroup.appendChild(optionItem);
        optionGroup.appendChild(sizeContainer);
        optionContainer.appendChild(optionGroup);
      });
    }
    newCard.appendChild(optionContainer);

    // Tạo container cho sizes
    const sizeContainer = document.createElement("div");
    sizeContainer.className = "size-container";

    // Thêm sizes hiện có
    if (Array.isArray(optionssize)) {
      optionssize.forEach((optionsize) => {
        const sizeItem = document.createElement("div");
        sizeItem.className = "option-item-size";
        sizeItem.innerHTML = `
                  Size: <input type="text" class="form_size" value="${
                    optionsize.size || ""
                  }">
                  SL: <input type="number" class="form_amount_size" value="${
                    optionsize.quantitysize || ""
                  }">
                  <button class="btn-edit-size">Sửa size</button>
                  <button class="btn-remove-size">Xóa size</button>
              `;
        sizeContainer.appendChild(sizeItem);
      });
    }
    newCard.appendChild(sizeContainer);

    document.querySelector("#product-list").appendChild(newCard);
  } catch (error) {
    console.error("Lỗi khi thêm item vào UI:", error);
  }
};

// lấy danh sánh từ ls
const getList = () => {
  try {
    const list = localStorage.getItem("list");
    return list ? JSON.parse(list) : [];
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ localStorage:", error);
    return [];
  }
};

// hàm add item vào ls
const addItemToLS = (item) => {
  try {
    let list = getList();
    list.push(item);
    localStorage.setItem("list", JSON.stringify(list));
    return true;
  } catch (error) {
    console.error("Lỗi khi thêm vào localStorage:", error);
    return false;
  }
};

// khởi tạo để lưu trữ
const init = () => {
  try {
    const list = getList();
    console.log("Dữ liệu khởi tạo:", list);
    if (list && list.length > 0) {
      document.querySelector("#product-list").innerHTML = "";
      list.forEach((item) => addItemToUI(item));
    }
  } catch (error) {
    console.error("Lỗi khởi tạo:", error);
  }
};

// Khởi tạo ứng dụng
document.addEventListener("DOMContentLoaded", () => {
  init();
});

// hàm xóa sản phẩm trong ls
const removeItemFromLS = (id) => {
  let list = getList();
  list = list.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(list));
};

//  hàm thêm option vào ls
const addOptionToLS = (productId, color, quantity) => {
  try {
    let list = getList();
    let product = list.find((item) => item.id === productId);

    if (!product) {
      console.error(`Không tìm thấy sản phẩm với ID ${productId}`);
      return;
    }

    // Đảm bảo mảng options tồn tại
    if (!Array.isArray(product.options)) {
      product.options = [];
    }

    // Kiểm tra xem option đã tồn tại chưa
    const existingOption = product.options.find((opt) => opt.color === color);
    if (existingOption) {
      existingOption.quantity = parseInt(quantity);
    } else {
      // Thêm option mới
      product.options.push({
        color: color,
        quantity: parseInt(quantity),
      });
    }

    // Lưu vào localStorage
    localStorage.setItem("list", JSON.stringify(list));
    console.log("Đã cập nhật localStorage:", product.options);
    return true;
  } catch (error) {
    console.error("Lỗi khi thêm option:", error);
    return false;
  }
};

//----------------------
//hàm thêm option size vào ls

const addOptionSizeToLS = (productId, color, size, quantitySize) => {
  try {
    let list = getList();
    let product = list.find((item) => item.id === productId);

    if (!product) {
      console.error(`Không tìm thấy sản phẩm với ID ${productId}`);
      return;
    }

    // Tìm option theo màu
    let option = product.options.find((opt) => opt.color === color);
    if (!option) {
      console.error(`Không tìm thấy option với màu ${color}`);
      return;
    }

    // Đảm bảo mảng sizes tồn tại trong option
    if (!Array.isArray(option.sizes)) {
      option.sizes = [];
    }

    // Kiểm tra và thêm/cập nhật size
    const existingSize = option.sizes.find((s) => s.size === size);
    if (existingSize) {
      existingSize.quantitysize = parseInt(quantitySize);
    } else {
      option.sizes.push({
        size: size,
        quantitysize: parseInt(quantitySize),
      });
    }

    // Lưu vào localStorage
    localStorage.setItem("list", JSON.stringify(list));
    console.log(
      "Đã cập nhật localStorage - sizes cho màu",
      color,
      ":",
      option.sizes
    );
    return true;
  } catch (error) {
    console.error("Lỗi khi thêm size:", error);
    return false;
  }
};

//hàm chỉnh sửa optionsSize trong   ls
const editOptionsizeInLS = (productId, oldSize, newSize, newQuantitySize) => {
  try {
    let list = getList();
    let product = list.find((item) => item.id === productId);

    if (!product) {
      console.error("Không tìm thấy sản phẩm");
      return;
    }

    // Tìm option chứa size cần sửa
    const parentOption = product.options.find(
      (option) => option.sizes && option.sizes.some((s) => s.size === oldSize)
    );

    if (parentOption && Array.isArray(parentOption.sizes)) {
      // Tìm và cập nhật size
      const sizeToUpdate = parentOption.sizes.find((s) => s.size === oldSize);
      if (sizeToUpdate) {
        sizeToUpdate.size = newSize;
        sizeToUpdate.quantitysize = parseInt(newQuantitySize);
        localStorage.setItem("list", JSON.stringify(list));
      }
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật size:", error);
  }
};

//hàm xóa optionsSize trong ls
const removeOptionSizeFromLS = (productId, size) => {
  try {
    let list = getList();
    const product = list.find((item) => item.id === productId);

    if (!product) {
      console.error("Không tìm thấy sản phẩm");
      return;
    }

    if (!Array.isArray(product.optionssize)) {
      product.optionssize = [];
    }

    product.optionssize = product.optionssize.filter(
      (option) => option.size !== size
    );
    localStorage.setItem("list", JSON.stringify(list));

    console.log(
      "Đã xóa size:",
      size,
      "Danh sách size còn lại:",
      product.optionssize
    );
  } catch (error) {
    console.error("Lỗi khi xóa size:", error);
  }
};
//-------------
//  hàm xóa option trong ls
const removeOptionFromLS = (productId, color) => {
  try {
    let list = getList();
    let product = list.find((item) => item.id === productId);

    if (!product) {
      console.error("Không tìm thấy sản phẩm");
      return;
    }

    // Xóa option và tất cả sizes của nó
    product.options = product.options.filter(
      (option) => option.color !== color
    );

    localStorage.setItem("list", JSON.stringify(list));
    console.log(`Đã xóa màu ${color} và tất cả sizes liên quan`);
  } catch (error) {
    console.error("Lỗi khi xóa option:", error);
  }
};

// hàm chỉnh sửa option trong ls
const editOptionInLS = (productId, oldColor, newColor, newQuantity) => {
  try {
    let list = getList();
    let product = list.find((item) => item.id === productId);

    if (!product || !product.options) {
      console.error("Không tìm thấy sản phẩm hoặc options");
      return;
    }

    let option = product.options.find((option) => option.color === oldColor);
    if (option) {
      option.color = newColor;
      option.quantity = parseInt(newQuantity);
      localStorage.setItem("list", JSON.stringify(list));
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật option:", error);
  }
};
//---------------

//Hàm handle để thêm option , edit, và hành động remove
document.querySelector("#product-list").addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-option")) {
    const productItem = event.target.closest(".product-item");
    const productId = productItem.querySelector(".btn-remove").dataset.id;
    const optionContainer = productItem.querySelector(".option-container");

    // Tạo div mới cho mỗi option và sizes của nó
    let optionGroup = document.createElement("div");
    optionGroup.className = "option-group";

    // Tạo phần option
    let optionItem = document.createElement("div");
    optionItem.className = "option-item";
    optionItem.innerHTML = `                                                    
          Màu: <input type="text" class="form_color" placeholder="Nhập màu" required>
          SL: <input type="number" class="form_amount" placeholder="Nhập số lượng" min="1" required>
          <button class="btn-edit-option">Sửa</button>
          <button class="btn-add-size">Thêm size</button>
          <button class="btn-remove-option" data-product-id="${productId}">Xóa</button>
      `;

    // Tạo container riêng cho sizes của option này
    let sizeContainer = document.createElement("div");
    sizeContainer.className = "size-container";

    // Thêm cả option và size container vào group
    optionGroup.appendChild(optionItem);
    optionGroup.appendChild(sizeContainer);
    optionContainer.appendChild(optionGroup);

    // Xử lý lưu option
    const colorInput = optionItem.querySelector(".form_color");
    const quantityInput = optionItem.querySelector(".form_amount");

    const saveOption = () => {
      const color = colorInput.value.trim();
      const quantity = quantityInput.value;

      if (color && quantity) {
        addOptionToLS(productId, color, quantity);
        console.log("Đã lưu option:", { color, quantity });
      }
    };

    colorInput.addEventListener("change", saveOption);
    quantityInput.addEventListener("change", saveOption);
  }

  if (event.target.classList.contains("btn-add-size")) {
    const optionGroup = event.target.closest(".option-group");
    const productItem = event.target.closest(".product-item");
    const productId = productItem.querySelector(".btn-remove").dataset.id;
    const sizeContainer = optionGroup.querySelector(".size-container");
    const optionColor = optionGroup.querySelector(".form_color").value;

    if (!optionColor) {
      alert("Vui lòng nhập màu trước khi thêm size");
      return;
    }

    let sizeItem = document.createElement("div");
    sizeItem.className = "option-item-size";
    sizeItem.innerHTML = `
          Size: <input type="text" class="form_size" placeholder="Nhập size" required>
          SL: <input type="number" class="form_amount_size" placeholder="Nhập số lượng" min="1" required>
          <button class="btn-edit-size">Sửa size</button>
          <button class="btn-remove-size" data-product-id="${productId}">Xóa size</button>
      `;
    sizeContainer.appendChild(sizeItem);

    // Xử lý lưu size
    const sizeInput = sizeItem.querySelector(".form_size");
    const quantitySizeInput = sizeItem.querySelector(".form_amount_size");

    const saveSize = () => {
      const size = sizeInput.value.trim();
      const quantitySize = quantitySizeInput.value;

      if (size && quantitySize) {
        addOptionSizeToLS(productId, optionColor, size, quantitySize);
        console.log("Đã lưu size:", { color: optionColor, size, quantitySize });
      }
    };

    sizeInput.addEventListener("change", saveSize);
    quantitySizeInput.addEventListener("change", saveSize);
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
                  <button class="btn-add-size">Thêm size</button>
                  <button class="btn-remove-option">Xóa</button>
              `;
        }
      });
  }
  // hàm  xóa option
  if (event.target.classList.contains("btn-remove-option")) {
    const productItem = event.target.closest(".product-item");
    const productId = productItem.querySelector(".btn-remove").dataset.id;
    const optionGroup = event.target.closest(".option-group");
    const optionItem = event.target.closest(".option-item");
    const color = optionItem.querySelector(".form_color").value;

    if (confirm("Bạn có chắc muốn xóa option và tất cả sizes của nó không?")) {
      optionGroup.remove(); // Xóa cả option group (bao gồm cả sizes)
      removeOptionFromLS(productId, color);
    }
  }
  // hàm xóa sản phẩm
  if (event.target.classList.contains("btn-remove")) {
    let idRemove = event.target.dataset.id;
    let isConfirmed = confirm("Bạn có chắc muốn xóa sản phẩm không?");
    if (isConfirmed) {
      event.target.parentElement.remove(); // xóa sản phẩm từ ui
      removeItemFromLS(idRemove); // xóa sản phẩm từ ls
    }
  }

  //hàm sửa option size
  if (event.target.classList.contains("btn-edit-size")) {
    const optionItemSize = event.target.parentElement;
    const productId = event.target
      .closest(".product-item")
      .querySelector(".btn-remove").dataset.id;
    const oldSize = optionItemSize.querySelector(".form_size").value;
    const oldQuantitySize =
      optionItemSize.querySelector(".form_amount_size").value;

    optionItemSize.innerHTML = `
          Size: <input type="text" class="form_size" value="${oldSize}">
          SL: <input type="number" class="form_amount_size" value="${oldQuantitySize}">
          <button class="btn-save-size">Save</button>
      `;

    optionItemSize
      .querySelector(".btn-save-size")
      .addEventListener("click", () => {
        const newSize = optionItemSize.querySelector(".form_size").value;
        const newQuantitySize =
          optionItemSize.querySelector(".form_amount_size").value;

        if (newSize && newQuantitySize) {
          editOptionsizeInLS(productId, oldSize, newSize, newQuantitySize);
          optionItemSize.innerHTML = `
                  Size: <input type="text" class="form_size" value="${newSize}" readonly>
                  SL: <input type="number" class="form_amount_size" value="${newQuantitySize}" readonly>
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

// Thêm hàm utility để validate input
const validateNumberInput = (input) => {
  input.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) {
      e.target.value = "";
    }
  });
};

// Áp dụng validation cho tất cả input số
document.querySelectorAll('input[type="number"]').forEach(validateNumberInput);
