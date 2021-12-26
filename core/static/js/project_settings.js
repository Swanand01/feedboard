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

// let deleteProjectForm = document.querySelector(".delete_project_form");
// deleteProjectForm.addEventListener("submit", (event) => {
//     event.preventDefault();

//     const swalWithBootstrapButtons = Swal.mixin({
//         customClass: {
//             confirmButton: 'btn btn-danger'
//         },
//         buttonsStyling: false
//     })

//     swalWithBootstrapButtons.fire({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         icon: 'warning',
//         confirmButtonText: 'Yes, delete it!',
//         showCloseButton: true,
//     }).then((result) => {
//         if (result.isConfirmed) {
//             console.log(deleteProjectForm.children);
//             deleteProjectForm.submit();
//         }
//     })
// })