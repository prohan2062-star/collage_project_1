const CART_KEY = "booknest_cart";

export function getCart() {

    return JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
    );

}


export function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();

}


export function addToCart(book) {

    const cart = getCart();

    const existing =
        cart.find(item => item.id === book.id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: book.id,
            title: book.title,
            author: book.author,
            price: Number(book.price),
            image: book.image,
            quantity: 1
        });

    }

    saveCart(cart);

    showToast("Book added to cart");

}


export function removeFromCart(id) {

    let cart = getCart();

    cart = cart.filter(
        item => item.id !== id
    );

    saveCart(cart);

}


export function changeQuantity(id, change) {

    const cart = getCart();

    const item =
        cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        removeFromCart(id);
        return;

    }

    saveCart(cart);

}


export function getCartTotal() {

    return getCart().reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

}


export function updateCartCount() {

    const count =
        getCart().reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    document
        .querySelectorAll(".cart-count")
        .forEach(el => {
            el.textContent = count;
        });

}


export function showToast(message) {

    let toast =
        document.getElementById("toast");

    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}


document.addEventListener(
    "DOMContentLoaded",
    updateCartCount
);