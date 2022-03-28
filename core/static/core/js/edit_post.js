const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
let removeImageBtns = document.querySelectorAll(".remove-image");
let updateBtn = document.querySelector("#update-btn");
let form = document.querySelector("#post-update-form");
let removedImages = [];

Array.from(removeImageBtns).forEach(btn => {
    btn.addEventListener("click", () => {
        let imageId = btn.parentElement.querySelector(".image-id").innerHTML;
        removedImages.push(imageId);
        btn.parentElement.remove()
    })
})

updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let formData = new FormData(form);
    formData.append("removedImages", removedImages)
    console.log(Array.from(formData));

    fetch("", {
        method: "POST",
        body: formData,
        headers: { "X-CSRFToken": csrftoken },
    }).then(res => {
        if (res.ok) {
            console.log(res);
            window.open(res.url, '_self');
        }
    })
})