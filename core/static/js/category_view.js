import { getCookie } from "./helpers.js"

let csrftoken = getCookie("csrftoken");

let postCards = document.getElementsByClassName("post")
Array.from(postCards).forEach(function (postCard) {
    let postId = postCard.querySelector(".post_id").textContent;
    let upvoteButton = postCard.querySelector(".upvote_button");
    let upvoteCount = postCard.querySelector(".upvote_count");
    upvoteButton.addEventListener('click', event => {
        fetch("/app/vote/", {
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
})