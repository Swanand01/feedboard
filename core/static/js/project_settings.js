let categoryDiv = document.querySelector(".category_list_div");
let addCategoryBtn = document.querySelector("#add_category");
addCategoryBtn.addEventListener("click", () => {
    let input = document.createElement("input");
    input.type = "text";
    input.className = "form-control mt-2 new_category";
    input.name = "new_category";
    input.placeholder = "Enter category name";
    input.required = true;
    categoryDiv.appendChild(input);
});