let categoriesDiv = document.querySelector(".categories");
let addCategoryBtn = document.querySelector("#add_category_btn");
addCategoryBtn.addEventListener("click", () => {
    let input = document.createElement("input");
    input.type = "text";
    input.className = "form-control mt-2";
    input.name = "category";
    categoriesDiv.appendChild(input);
})