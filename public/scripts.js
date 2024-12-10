document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    fetchProducts();
    if (document.getElementById('users')) {
        fetchUsers();
    }

    document.getElementById('searchInput').addEventListener('input', filterContent);

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });
});

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const productContainer = document.getElementById('products');
    productContainer.innerHTML = '';
    products.forEach(product => {
        const productCol = document.createElement('div');
        productCol.classList.add('col', 'mb-4', 'product-card');
        productCol.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Giá: $${product.price}</p>
                    <button class="btn btn-info product-info" data-name="${product.name}" data-price="${product.price}">Thông tin</button>
                    ${document.getElementById('users') ? `
                        <button class="btn btn-warning product-edit" data-id="${product.id}">Sửa</button>
                        <button class="btn btn-danger product-delete" data-id="${product.id}">Xóa</button>
                    ` : ''}
                </div>
            </div>
        `;
        productContainer.appendChild(productCol);
    });

    document.querySelectorAll('.product-info').forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            const price = e.target.dataset.price;
            showProductInfo(name, price);
        });
    });

    if (document.getElementById('users')) {
        document.querySelectorAll('.product-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                editProduct(id);
            });
        });

        document.querySelectorAll('.product-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                deleteProduct(id);
            });
        });
    }
}

async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function displayUsers(users) {
    const userContainer = document.getElementById('users');
    userContainer.innerHTML = '';
    users.forEach(user => {
        const userCol = document.createElement('div');
        userCol.classList.add('col', 'mb-4', 'user-card');
        userCol.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${user.username}</h5>
                    <p class="card-text">Quyền: ${user.role}</p>
                    <button class="btn btn-info user-info" data-username="${user.username}" data-role="${user.role}">Thông tin</button>
                    <button class="btn btn-warning user-edit" data-id="${user.id}">Sửa</button>
                    <button class="btn btn-danger user-delete" data-id="${user.id}">Xóa</button>
                </div>
            </div>
        `;
        userContainer.appendChild(userCol);
    });

    document.querySelectorAll('.user-info').forEach(button => {
        button.addEventListener('click', (e) => {
            const username = e.target.dataset.username;
            const role = e.target.dataset.role;
            showUserInfo(username, role);
        });
    });

    document.querySelectorAll('.user-edit').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            editUser(id);
        });
    });

    document.querySelectorAll('.user-delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            deleteUser(id);
        });
    });
}

function filterContent(event) {
    const searchTerm = event.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    const userCards = document.querySelectorAll('.user-card');

    productCards.forEach(card => {
        const productName = card.querySelector('.card-title').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    if (document.getElementById('users')) {
        userCards.forEach(card => {
            const username = card.querySelector('.card-title').textContent.toLowerCase();
            if (username.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

function showProductInfo(name, price) {
    alert(`Product Name: ${name}\nPrice: $${price}`);
}

function showUserInfo(username, role) {
    alert(`Username: ${username}\nRole: ${role}`);
}

async function deleteProduct(id) {
    if (confirm('Có chắc muốn xóa sản phẩm?')) {
        try {
            const response = await fetch(`http://localhost:3000/products/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchProducts();
                alert('Xóa thành công');
            } else {
                alert('Lỗi');
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
        }
    }
}

async function deleteUser(id) {
    if (confirm('Có chắc muốn xóa user này?')) {
        try {
            const response = await fetch(`http://localhost:3000/users/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchUsers();
                alert('Xoá thành công');
            } else {
                alert('Lỗi khi xoá user');
            }
        } catch (error) {
            console.error('Lỗi khi xóa user:', error);
        }
    }
}

function editProduct(id) {
    const newName = prompt('Nhập tên sản phẩm mới:');
    const newImage = prompt('Nhập URL hình ảnh:');
    const newPrice = prompt('Nhập giá:');

    if (newName && newImage && newPrice) {
        const updatedProduct = {
            name: newName,
            image: newImage,
            price: newPrice
        };

        updateProduct(id, updatedProduct);
    }
}

async function updateProduct(id, product) {
    try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            fetchProducts();
            alert('Sửa thông tin thành công');
        } else {
            alert('Lỗi khi sửa thông tin sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi khi sửa:', error);
    }
}

function editUser(id) {
    const newUsername = prompt('Nhập username:');
    const newPassword = prompt('Nhập password:');
    const newRole = prompt('Nhập quyền (user/admin):');

    if (newUsername && newPassword && newRole) {
        const updatedUser = {
            username: newUsername,
            password: newPassword,
            role: newRole
        };

        updateUser(id, updatedUser);
    }
}

async function updateUser(id, user) {
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            fetchUsers();
            alert('Cập nhật user thành công');
        } else {
            alert('Lỗi khi cập nhật user');
        }
    } catch (error) {
        console.error('Lỗi cập nhật user:', error);
    }
}
