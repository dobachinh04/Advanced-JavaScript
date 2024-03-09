const url = "http://localhost:4000/products";

const tbody = document.querySelector("tbody") || document.createElement("div");
const btnAdd =
  document.querySelector(".btn-add") || document.createElement("div");
const content =
  document.querySelector(".content") || document.createElement("div");
const btnLogin =
  document.querySelector(".btn-login") || document.createElement("div");

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const html = data
      .map((pro) => {
        return `
        <tr>
            <th scope="row"> ${pro.id} </th>
            <td> ${pro.name} </td>
            <td> ${pro.price} </td>
            <td> <a href=""><button class="btn-update btn btn-primary" data-id="${pro.id}">Sửa</button></a>
                 <a href=""><button class="btn-del btn btn-danger" data-id="${pro.id}">Xóa</button></a> </td>
        </tr>
    `;
      })
      .join("");

    tbody.innerHTML = html;

    // Xóa
    const btnDel = document.querySelectorAll(".btn-del");
    for (const btn of btnDel) {
      btn.addEventListener("click", function () {
        if (confirm("Bạn có muốn xóa không?")) {
          const id = btn.dataset.id;
          deletePro(id);
        }
      });
    }

    // Sửa
    const btnUpdate = document.querySelectorAll(".btn-update");
    for (const btn of btnUpdate) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const id = btn.dataset.id;

        fetch(`${url}/${id}`)
          .then((res) => res.json())
          .then((data) => {
            content.innerHTML = /*html*/ `
                <h1>Cập Nhật Sản Phẩm</h1>
                <form>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Tên</label>
                        <input type="text" class="form-control" id="name" aria-describedby="emailHelp" value="${data.name}">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Giá</label>
                        <input type="text" class="form-control" id="price" value="${data.price}">
                    </div>
            
                    <button type="submit" class="btn-submit btn btn-primary">Cập Nhật</button>
                </form>
            `;

            const btnSubmit = document.querySelector(".btn-submit");
            const name = document.querySelector("#name");
            const price = document.querySelector("#price");

            btnSubmit.addEventListener("click", function (e) {
              e.preventDefault();

              if (name.value == "") {
                alert("Tên không được để trống");
                return false;
              } else if (price.value == "") {
                alert("Giá không được để trống");
                return false;
              } else if (
                isNaN(Number(price.value)) ||
                Number(price.value) <= 0
              ) {
                alert("Giá không được nhỏ hơn 0");
                return false;
              }

              const new_pro = {
                id: id,
                name: name.value,
                price: price.value,
              };

              updatePro(id, new_pro);
            });
          })
          .catch((err) => console.log(err));
      });
    }
  })
  .catch((err) => console.log(err));

// Logic Xóa
const deletePro = function (id) {
  fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      alert("Xóa Thành Công");
    })
    .catch((err) => console.log(err));
};

// Logic Sửa
const updatePro = function (id, data) {
  fetch(`${url}/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: btn.stringify(data),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Sửa Thành Công");
    })
    .catch((err) => console.log(err));
};

// Thêm
btnAdd.addEventListener("click", function () {
  content.innerHTML = `
    <h1>Thêm Mới Sản Phẩm</h1>
    <form>
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Tên</label>
            <input type="text" class="form-control" id="name" aria-describedby="emailHelp">
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Giá</label>
            <input type="text" class="form-control" id="price">
        </div>

        <button type="submit" class="btn-submit btn btn-primary">Thêm Mới</button>
    </form>
`;

  const btnSubmit = document.querySelector(".btn-submit");
  const name = document.querySelector("#name");
  const price = document.querySelector("#price");

  btnSubmit.addEventListener("click", function (e) {
    e.preventDefault();

    if (name.value == "") {
      alert("Tên không được để trống");
      return false;
    } else if (price.value == "") {
      alert("Giá không được để trống");
      return false;
    } else if (isNaN(Number(price.value)) || Number(price.value) <= 0) {
      alert("Giá không được nhỏ hơn 0");
      return false;
    }

    const new_pro = {
      name: name.value,
      price: price.value,
    };

    addPro(new_pro);
  });
});

// Logic Thêm
const addPro = function (data) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Thêm Thành Công!");
    })
    .catch((err) => console.log(err));
};

// Đăng Nhập
const username = document.querySelector("#username");
const password = document.querySelector("#password");

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  if (username.value == "") {
    alert("Tên không được để trống");
    return false;
  }
  if (password.value == "") {
    alert("Mật Khẩu không được để trống");
    return false;
  }

  fetch("http://localhost:4000/users")
    .then((res) => res.json())
    .then((data) => {
      if (checkLogin(data, username.value, password.value)) {
        alert("Đăng Nhập Thành Công");
        window.location.href = "index.html";
      } else {
        alert("Đăng Nhập Thất Bại");
      }
    })
    .catch((err) => console.log(err));
});

const checkLogin = function (data, username, password) {
  return data.some((data) => {
    return data.username == username && data.password == password;
  });
};
