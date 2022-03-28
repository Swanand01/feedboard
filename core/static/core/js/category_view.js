const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
let postsDiv = document.querySelector(".posts");
let postCards = postsDiv.getElementsByClassName("post");
let searchBar = document.querySelector("#search_bar");
let categoryId = document.querySelector("#category_id").textContent;
let searchResults = document.querySelector(".search-results");
let fileInput = document.querySelector("#image-files");
let removeFileBtn = document.querySelector("#remove-files");
let fileCountDiv = document.querySelector("#file-count");

Array.from(postCards).forEach(post => addUpvoteEventListener(post));

searchBar.addEventListener("keyup", async event => {
    if (event.target.value != "") {
        searchResults.innerHTML = "";
        postsDiv.style.display = "none";
        searchResults.style.display = "block";
        let data = {
            "category_id": categoryId,
            "search_query": event.target.value
        }
        let res = await fetch("/search-post/", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { "X-CSRFToken": csrftoken },
        })
        res = await res.json();

        let posts = res["posts"];
        for (let post in posts) {
            searchResults.innerHTML += `
                    <div class="card post">
                        <p class="post_id" hidden>${post}</p>
                        <div class="upvotes">
                                ${posts[post]["has_upvoted"]
                    ? `<i class="material-icons footer-icons upvote_button already-voted">keyboard_arrow_up</i>`
                    :
                    `<i class="material-icons footer-icons upvote_button">keyboard_arrow_up</i>`}
                                <p class="upvote_count">${posts[post]["upvotes"]}</p>
                        </div>

                        <div class="post-body">
                            <div class="card-body pb-1 pt-1">
                                <h6 class="card-title">
                                    <a href="${posts[post]["post_url"]}">${truncate(posts[post]["title"], 10)}</a>
                                </h6>

                                <div class="rounded"
                                    style="background-color: ${posts[post]["status_colour"]}; display: inline-block;">
                                    <p class="card-subtitle p-1">${posts[post]["status"]}</p>
                                </div>

                                <p class="card-text mt-1 mb-1">${truncate(posts[post]["description"], 12)}</p>
                                <div class="post-footer">

                                    <a href="${posts[post]["post_url"]}" class="footer-item">
                                        <div class="comment-div">
                                            <i class="material-icons">comment</i>
                                            ${posts[post]["comments"]} Comments
                                        </div>
                                    </a>

                                    ${posts[post]["user_is_creator"]
                    ?
                    `<div class="options">
                                        <a href="${posts[post]["edit_post_url"]}" class="footer-item">Edit</a>

                                        <a href="${posts[post]["delete_post_url"]}" class="footer-item"
                                            onclick="return confirm('Do you want to delete this post?')">Delete</a>
                                    </div>`
                    : res["is_admin"]
                        ?
                        `<a href="${posts[post]["delete_post_url"]}" class="footer-item"
                                        onclick="return confirm('Do you want to delete this post?')">Delete</a>`: ""
                }
                                </div>
                            </div>
                        </div>
                    </div>
                    `
        };

        let postCards = searchResults.getElementsByClassName("post");
        Array.from(postCards).forEach(post => addUpvoteEventListener(post));

    }
    else {
        postsDiv.style.display = "block";
        searchResults.style.display = "none";
    }
})

fileInput.addEventListener("change", () => {
    console.log(fileInput.files.length);
    removeFileBtn.style.display = "inline-block";
    fileCountDiv.innerHTML = fileInput.files.length + " files selected";
})

removeFileBtn.addEventListener("click", () => {
    fileInput.value = "";
    console.log(fileInput.files.length);
    removeFileBtn.style.display = "";
    fileCountDiv.innerHTML = "";
})

function addUpvoteEventListener(postCard) {
    let postId = postCard.querySelector(".post_id").textContent;
    let upvoteButton = postCard.querySelector(".upvote_button");
    let upvoteCount = postCard.querySelector(".upvote_count");
    upvoteButton.addEventListener('click', event => {
        fetch("/vote/", {
            method: 'POST',
            body: JSON.stringify({
                "post_id": postId,
                'to_url': window.location.pathname
            }),
            headers: { "X-CSRFToken": csrftoken },
        }).then(res => res.json())
            .then(function (res) {
                if (res['type'] == 'Redirect') {
                    window.location.replace(window.location.origin + res['to_url']);
                }

                if (res['type'] == 'OK') {
                    if (upvoteButton.classList.contains('already-voted')) {
                        upvoteButton.classList.remove('already-voted');
                        upvoteCount.innerHTML = Number(upvoteCount.textContent) - 1;
                    }
                    else {
                        upvoteButton.classList.add('already-voted');
                        upvoteCount.innerHTML = Number(upvoteCount.textContent) + 1;
                    }
                }
            })
    })
}

function truncate(str, no_words) {
    return str.split(" ").splice(0, no_words).join(" ");
}