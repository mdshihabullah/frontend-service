window.addEventListener("DOMContentLoaded", (event) => {
    if (sessionStorage.getItem("token")) {
        var config = {
            method: "get",
            url: `https://login.simplebar.dk/api/me`,
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        };
        axios(config)
            .then(function (response) {
                console.log(response.data);
                document.getElementById("loader").style.display = "none";
                const name = response.data.user.name;
                const email = response.data.user.email;
                const role = response.data.role[0];
                if (role !== "admin"){
                    window.location.replace("index.html")
                }
                get_all()
                //let name_block = document.getElementById("username");
                //name_block.innerHTML = `Hi,&nbsp;<a href="#" title="${email}" style="text-decoration: none; color: deepskyblue;"> ${name}!</a>`;
                //TODO GET NAME OF COURSES FROM API

            })
            .catch(function (error) {
                if (error.response) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Your session has expired",
                        footer: "Please try to login again.",
                    });
                }
            });
    } else {
        sessionStorage.removeItem("token");
        window.location.replace("index.html");
    }
});

const logout = (event) => {
    event.preventDefault();
    document.getElementById("loader").style.display = "inline-block";
    sessionStorage.removeItem("token");
    document.getElementById("loader").style.display = "none";
    Swal.fire({
        icon: "info",
        title: "See you again!",
        text: "Logged out successfully",
        footer: "Please log in to continue",
    }).then(() => {
        window.location.replace("index.html");
    });
};

function logs (){
    window.location.replace("admin-logs.html")
}


user_objects = [ {
    name: "Alex",
    email: "Alex@hotmail.com",
    role:"Teacher",
    id: "id"
}, {
    name: "Jim",
    email: "Jim@hotmail.com",
    role:"Student"
}, {
    name: "John",
    email: "John@hotmail.com",
    role:"Student"
}, {
    name: "Bob",
    email: "Bo@hotmail.com",
    role:"Admin"
}]


function insertdataintotable(array_of_user_object, role){
    let table = document.getElementById("table").getElementsByTagName('tbody')[0];

    for (let i = 0; i < array_of_user_object.length; i++){
        if(role === array_of_user_object[i]["role"]){
            let row = table.insertRow(0);
            let name_cell = row.insertCell(0);
            let email_cell = row.insertCell(1);
            let role_cell = row.insertCell(2);
            let action_cell = row.insertCell(3);
            name_cell.innerHTML = array_of_user_object[i]["name"];
            email_cell.innerHTML = array_of_user_object[i]["email"]
            role_cell.innerHTML = array_of_user_object[i]["role"]
            action_cell.innerHTML = "<i id='delete' class='fa fa-trash'></i>"
            continue
        }
        if(role === "All"){
            let row = table.insertRow(0);
            let name_cell = row.insertCell(0);
            let email_cell = row.insertCell(1);
            let role_cell = row.insertCell(2);
            let action_cell = row.insertCell(3);
            name_cell.innerHTML = array_of_user_object[i]["name"];
            email_cell.innerHTML = array_of_user_object[i]["email"]

            role_cell.innerHTML = array_of_user_object[i]["role"]
            action_cell.innerHTML = "<a class = 'delete'></classa><i  id='delete'  class='fa fa-trash'></i></a>"
        }


    }
}



function get_students(){
    remove_content_from_table()
    insertdataintotable(user_objects, "Student" )
}
function get_teacher(){
    remove_content_from_table()
    insertdataintotable(user_objects, "Teacher" )
}

function get_admin(){
    remove_content_from_table()
    insertdataintotable(user_objects, "Admin" )
}

function get_all(){
    remove_content_from_table()
    insertdataintotable(user_objects, "All" );



}

function remove_content_from_table(){
    $('#table tbody').empty();
}


$(document).on("click", ".delete", function(){
    let email_of_person = $(this).parents("tr")[0]["childNodes"][1].innerHTML
    $(this).parents("tr").remove()
    deleterow(email_of_person)
});

function deleterow(email){
    let new_array = []
    for (let i = 0; i < user_objects.length; i++){
        let email_of_person = user_objects[i]["email"]
        if(email === email_of_person){
            continue
        }
        new_array.push(user_objects[i])
    }
    user_objects = new_array
}

