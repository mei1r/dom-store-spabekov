class Store {
    #items = [];

    add(item) {
        this.#items.push(item);
    }

    remove(name) {
        this.#items = this.#items.filter(item => item.name !== name);
    }

    updateQty(name, delta) {
        const item = this.#items.find(i => i.name === name);
        if (item) {
            item.qty += delta;
            if (item.qty < 1) item.qty = 1;
        }
    }

    get total() {
        return this.#items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    get items() {
        return [...this.#items];
    }
}

const store = new Store();


const addForm = document.getElementById('add-form');
const listContainer = document.getElementById('store-list');
const totalEl = document.getElementById('total-price');

const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const qtyInput = document.getElementById('qty');

const errName = document.getElementById('error-name');
const errPrice = document.getElementById('error-price');
const errQty = document.getElementById('error-qty');


function render() {
    listContainer.innerHTML = '';

    store.items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item-card';

        itemEl.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-details">Цена: ${item.price} ₸ | В наличии: ${item.qty} шт.</div>
            </div>
            <div class="item-actions">
                <button class="btn qty-btn action-decrease" data-name="${item.name}">-</button>
                <span class="item-qty-display">${item.qty}</span>
                <button class="btn qty-btn action-increase" data-name="${item.name}">+</button>
                <button class="btn btn-danger action-remove" data-name="${item.name}">Удалить</button>
            </div>
        `;
        listContainer.appendChild(itemEl);
    });

    totalEl.textContent = store.total;
}

function clearErrors() {
    errName.textContent = '';
    errPrice.textContent = '';
    errQty.textContent = '';
}


addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const nameVal = nameInput.value.trim();
    const priceVal = parseFloat(priceInput.value);
    const qtyVal = parseInt(qtyInput.value);

    let hasError = false;

    if (!nameVal) {
        errName.textContent = 'Имя товара не может быть пустым';
        hasError = true;
    }

    if (isNaN(priceVal) || priceVal <= 0) {
        errPrice.textContent = 'Цена должна быть числом больше 0';
        hasError = true;
    }

    if (isNaN(qtyVal)) {
        errQty.textContent = 'Количество должно быть числом';
        hasError = true;
    }

    if (hasError) return;


    const existing = store.items.find(i => i.name === nameVal);
    if (existing) {
        store.updateQty(nameVal, qtyVal);
    } else {
        store.add({ name: nameVal, price: priceVal, qty: qtyVal });
    }

    render();
    addForm.reset();
});


listContainer.addEventListener('click', (e) => {
    const btn = e.target;

    if (!btn.classList.contains('btn')) return;

    const itemName = btn.getAttribute('data-name');

    if (btn.classList.contains('action-remove')) {
        store.remove(itemName);
    } else if (btn.classList.contains('action-increase')) {
        store.updateQty(itemName, 1);
    } else if (btn.classList.contains('action-decrease')) {
        store.updateQty(itemName, -1);
    }

    render();
});


render();