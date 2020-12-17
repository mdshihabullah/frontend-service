let user_objects = []
let used_user_id;
let courses_used;
window.addEventListener("DOMContentLoaded", (event) => {
    if (sessionStorage.getItem("token")) {
        var config = {
            method: "get",
            url: `https://login.simplebar.dk/api/me`,
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        };
        axios(config)
            .then(function (response) {
                //console.log(response.data);
                document.getElementById("loader").style.display = "none";
                const name = response.data.user.name;
                const email = response.data.user.email;
                const role = response.data.role[0];
                if (role !== "admin"){
                    window.location.replace("index.html")
                }
                let config_get_user_list = {
                    method: "get",
                    url: `https://admin.simplebar.dk/api/user_list`,
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                }
                axios(config_get_user_list).then(function (response) {
                    //console.log(response.data["list"]);
                    for (let i = 0; i< response.data["list"].length; i++){
                        let user = response.data["list"][i]
                        user_objects.push({
                            id:user["id"],
                            role: user["role"],
                            name: user["name"],
                            email: user["email"]
                        })
                    }
                    //console.log(user_objects)
                    //console.log(user_objects)
                    get_all()

                }).catch(function (error){
                    if (error.response) {
                        console.log("failed to get users")
                    }
                })

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




function insertdataintotable(array_of_user_object, role){
    let table = document.getElementById("table").getElementsByTagName('tbody')[0];

    for (let i = 0; i < array_of_user_object.length; i++){
        if(role === array_of_user_object[i]["role"][0]){
            insert_data(table, array_of_user_object, i)
            continue
        }
        if(role === "All"){
            insert_data(table, array_of_user_object, i)
        }


    }
}

function insert_data(table, array_of_user_object, i){
    let row = table.insertRow(0);
    let name_cell = row.insertCell(0);
    let email_cell = row.insertCell(1);
    let role_cell = row.insertCell(2);
    let action_cell = row.insertCell(3);
    let name = array_of_user_object[i]['name']
    name_cell.innerHTML = "<a class = 'get_details'>" +  name +  "</a>";
    email_cell.innerHTML = array_of_user_object[i]["email"]
    role_cell.innerHTML = array_of_user_object[i]["role"]
    action_cell.innerHTML = "<a class = 'delete'><i   class='fa fa-trash'></i></a>"
}




function get_students(){
    remove_content_from_table()
    insertdataintotable(user_objects, "student" )
}
function get_teacher(){
    remove_content_from_table()
    insertdataintotable(user_objects, "teacher" )
}

function get_admin(){
    remove_content_from_table()
    insertdataintotable(user_objects, "admin" )
}

function get_all(){
    remove_content_from_table()
    insertdataintotable(user_objects, "All" );



}

function remove_content_from_table(){
    $('#table tbody').empty();
}

function insert_course(course){
    let table = document.getElementById("table_course").getElementsByTagName('tbody')[0];
    for (let i= 0; i < course.length; i++){
        let row = table.insertRow(0);
        let name_cell = row.insertCell(0);
        let ID_cell = row.insertCell(1);
        let action_cell = row.insertCell(2);
        let name = course[i]['title']
        name_cell.innerHTML = "<a class = 'get_details'>" +  name +  "</a>";
        ID_cell.innerHTML = course[i]["id"]
        action_cell.innerHTML = "<a class = 'delete_course'><i   class='fa fa-trash'></i></a>"
    }
}


$(document).on("click", ".get_details", function(){
    let email_of_person = $(this).parents("tr")[0]["childNodes"][1].innerHTML
    //let name =  $(this).parents("tr")[0]["childNodes"][0].innerHTML
    let id = findid(email_of_person)
    //console.log("your id is "   ,id)
    let config_user_details = {
        method: "GET",
        url: `https://admin.simplebar.dk/api/user/${id}`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };
    axios(config_user_details).then(function (response) {
        $('#table_course tbody').empty();
        used_user_id = id
        let course = response.data["courses"]
        courses_used = course
        insert_course(course)


    }).catch(function (error){
        if (error.response) {
            console.log("failed to get user details")
        }
    })

});


$(document).on("click", ".delete", function(){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let email_of_person = $(this).parents("tr")[0]["childNodes"][1].innerHTML
            let id = findid(email_of_person)
            console.log(id)
            let config_user_delete = {
                method: "DELETE",
                url: `https://admin.simplebar.dk/api/user/${id}`,
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            };
            axios(config_user_delete).then(function (response) {
                console.log(response.data);
                $(this).parents("tr").remove()
                deleterow(email_of_person)

            }).catch(function (error){
                if (error.response) {
                    console.log("failed to delete user")
                }
            })
        }
    })

});

$(document).on("click", ".delete_course", function() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let course_id = $(this).parents("tr")[0]["childNodes"][1].innerHTML
            let config_user_delete = {
                method: "DELETE",
                url: `https://course.simplebar.dk/api/course/${course_id}`,
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            };
            axios(config_user_delete).then(function (response) {
                courses_used = courses_used.filter(course => Number(course.id) !== Number(course_id))
                $('#table_course tbody').empty();
                insert_course(courses_used)

            }).catch(function (error){
                if (error.response) {
                    console.log("failed to course")
                }
            })


        }
    })
})


function findid(email){
    for (let i=0; i< user_objects.length; i++){
        if (user_objects[i]["email"] === email){
            return user_objects[i]["id"]
        }
    }
    return Error
}

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


function getcourses(){
    window.location.replace("admin-course.html")

}

