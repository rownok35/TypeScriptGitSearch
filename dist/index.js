"use strict";
// Element selections
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
// Caching GitHub user data
let cachedUserData = [];
// Reusable fetcher function
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }
    return await response.json();
}
// Function to display the card UI
const showResultUI = (users) => {
    // Accumulate HTML string
    const cardsHTML = users.map((user) => {
        const { avatar_url, login, url } = user;
        const formattedLogin = login.charAt(0).toUpperCase() + login.slice(1);
        return `
      <div class='card'> 
        <img src="${avatar_url}" alt="${login}" />
        <hr />
        <p style="text-align: right; color: white; font-size: 16px;">${formattedLogin}</p>
        <div class="card-footer">
          <img src="${avatar_url}" alt="${login}" /> 
          <a href="${url}" target="_blank">GitHub</a>
        </div>
      </div>`;
    }).join(""); // Join all HTML strings into one
    // Insert all at once
    main_container.insertAdjacentHTML("beforeend", cardsHTML);
};
// Function to fetch user data
async function fetchUserData(url) {
    try {
        cachedUserData = await myCustomFetcher(url);
        showResultUI(cachedUserData);
    }
    catch (error) {
        main_container.insertAdjacentHTML("beforeend", `<p class="error-msg">Failed to load users. Please try again later.</p>`);
        console.error(error);
    }
}
// Default function call to fetch all users
fetchUserData("https://api.github.com/users");
// Search functionality on form submit
formSubmit.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.trim().toLowerCase();
    main_container.innerHTML = ""; // Clear previous results
    if (!searchTerm) {
        // If search term is empty, display all users
        showResultUI(cachedUserData);
        return;
    }
    // Filter users by search term
    const matchingUsers = cachedUserData.filter(user => user.login.toLowerCase().includes(searchTerm));
    if (matchingUsers.length === 0) {
        main_container.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching users found.</p>`);
    }
    else {
        showResultUI(matchingUsers);
    }
});
