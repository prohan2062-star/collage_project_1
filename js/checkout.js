import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import {
    getCart,
    getCartTotal,
    saveCart
} from "./cart.js";


const checkoutForm =
    document.getElementById("checkoutForm");

let currentUser = null;


onAuthStateChanged(auth, user => {

    currentUser = user;

    if (!user && checkoutForm) {

        window.location.href =
            "login.html?redirect=checkout.html";

    }

});


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async e => {

            e.preventDefault();

            if (!currentUser) {

                window.location.href =
                    "login.html?redirect=checkout.html";

                return;
            }

            const cart = getCart();

            if (!cart.length) {

                alert("Your cart is empty.");

                window.location.href =
                    "cart.html";

                return;
            }

            const name =
                document.getElementById("fullName").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const address =
                document.getElementById("address").value.trim();

            const city =
                document.getElementById("city").value.trim();

            const pincode =
                document.getElementById("pincode").value.trim();

            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                ).value;

            const total =
                getCartTotal();

            const order = {

                userId: currentUser.uid,

                customer: {

                    name,
                    email: currentUser.email,
                    phone

                },

                shippingAddress: {

                    address,
                    city,
                    pincode

                },

                items: cart,

                total: total,

                paymentMethod: payment,

                status: "Pending",

                createdAt: serverTimestamp()

            };


            try {

                const orderRef =
                    await addDoc(
                        collection(db, "orders"),
                        order
                    );

                saveCart([]);

                alert(
                    `Order placed successfully!\nOrder ID: ${orderRef.id}`
                );

                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(error);

                alert(
                    "Unable to place order. Please try again."
                );

            }

        }
    );

}