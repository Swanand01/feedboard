console.log("BOARD SETTINGS");
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

let statusDiv = document.querySelector(".status_list_div");

let statusSaveBtn = document.querySelector("#status_button");
statusSaveBtn.addEventListener("click", () => {
    let statuses = document.getElementsByClassName("status");
    let newStatuses = document.getElementsByClassName("new_status");
    let context = {
        "type": "status_change",
        "statuses": {},
        "new_statuses": []
    }
    Array.from(statuses).forEach(element => {
        if (element.value != "") {

            context["statuses"][element.name] = {
                "title": element.value,
                "colour": document.querySelector(`#colour_${element.name}`).value
            };
        }
        else {
            window.alert("Status cannot be empty");
        }
    });
    Array.from(newStatuses).forEach(element => {
        if (element.value != "") {
            console.log(element.value);
            context["new_statuses"].push(element.value)
        }
        else {
            window.alert("Status cannot be empty")
        }
    });
    fetch(window.location.pathname, {
        method: 'POST',
        body: JSON.stringify(context),
        headers: { "X-CSRFToken": csrftoken },
    }).then(function () {
        alert("Changes saved.");
        window.location.reload();
    });
})

let addStatusBtn = document.querySelector("#add_status");
addStatusBtn.addEventListener("click", () => {
    let input = document.createElement("input");
    input.type = "text";
    input.className = "form-control mt-2 new_status";
    input.name = "new_status";
    input.placeholder = "Enter status";
    input.required = true;
    statusDiv.appendChild(input);
});

async function deleteStatus(statusId) {
    let warning = "All posts with this status will have their status changed to the default one. Are you sure you want to delete this status?"
    if (confirm(warning) == true) {
        let data = {
            "status_id": statusId,
        }
        let res = await fetch("/delete-status/", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { "X-CSRFToken": csrftoken },
        })
        res = await res.json();
        window.location.reload();
    }
}

let deleteStatusBtns = document.querySelectorAll(".status-settings");
Array.from(deleteStatusBtns).forEach(element => {
    element.addEventListener("click", () => {
        deleteStatus(element.id.replace("delete_", ""));
    })

})