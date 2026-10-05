import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const demoBooks = [

    {
        id: "clean-code",
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Technology",
        price: 599,
        oldPrice: 799,
        rating: 4.9,
        image: "assets/books/clean-code.jpg",
        description:
            "A practical guide to writing clean, readable and maintainable software."
    },

    {
        id: "atomic-habits",
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self Development",
        price: 449,
        oldPrice: 699,
        rating: 4.8,
        image: "assets/books/atomic-habits.jpg",
        description:
            "A proven framework for building good habits and breaking bad ones."
    },

    {
        id: "web-design",
        title: "Modern Web Design",
        author: "Alex Morgan",
        category: "Technology",
        price: 699,
        oldPrice: 899,
        rating: 4.7,
        image: "assets/books/web-design.jpg",
        description:
            "Learn modern responsive web design and user experience principles."
    },

    {
        id: "great-gatsby",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        price: 399,
        oldPrice: 549,
        rating: 4.6,
        image: "assets/books/great-gatsby.jpg",
        description:
            "One of the most celebrated novels of American literature."
    },

    {
        id: "rich-dad",
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: "Business",
        price: 499,
        oldPrice: 699,
        rating: 4.8,
        image: "assets/books/rich-dad.jpg",
        description:
            "A classic personal finance book about money, investing and financial independence."
    },

    {
        id: "deep-work",
        title: "Deep Work",
        author: "Cal Newport",
        category: "Self Development",
        price: 549,
        oldPrice: 749,
        rating: 4.7,
        image: "assets/books/deep-work.jpg",
        description:
            "Rules for focused success in a distracted world."
    }

];


// ===============================
// Get Books From Firestore
// ===============================

export async function getBooks() {

    try {

        const booksRef =
            collection(db, "books");

        const snapshot =
            await getDocs(booksRef);

        if (snapshot.empty) {

            return demoBooks;
        }

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    } catch (error) {

        console.error(error);

        return demoBooks;
    }

}


// ===============================
// Get Single Book
// ===============================

export async function getBookById(id) {

    const books =
        await getBooks();

    return books.find(book => book.id === id);
}


// ===============================
// Render Book Card
// ===============================

export function bookCard(book) {

    return `

        <article class="book-card">

            <div class="book-image">

                <img
                    src="${book.image}"
                    alt="${book.title}"
                    onerror="this.src='https://placehold.co/400x550/f0eadf/171613?text=Book'"
                >

                <button
                    class="wishlist-btn"
                    data-id="${book.id}">
                    <i class="fa-regular fa-heart"></i>
                </button>

            </div>

            <div class="book-info">

                <span class="book-category">
                    ${book.category}
                </span>

                <h3>${book.title}</h3>

                <p class="author">
                    ${book.author}
                </p>

                <div class="rating">

                    <span>★★★★★</span>

                    <small>
                        ${book.rating}
                    </small>

                </div>

                <div class="book-bottom">

                    <div>

                        <strong>
                            ₹${book.price}
                        </strong>

                        <del>
                            ₹${book.oldPrice}
                        </del>

                    </div>

                    <button
                        class="add-cart"
                        data-id="${book.id}">

                        <i class="fa-solid fa-plus"></i>

                    </button>

                </div>

                <a
                    href="book-details.html?id=${book.id}"
                    class="details-link">

                    View Details
                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </div>

        </article>

    `;
}