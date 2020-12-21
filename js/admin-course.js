let courses_objects = []
let course_id_used;
let users_used = []
let where_user_came_from;
let assignment_id_used;
let all_users = [];
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

                let config_get_courses = {
                    method: "get",
                    url: `https://admin.simplebar.dk/api/courses`,
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                }
                axios(config_get_courses).then(function (response) {
                    //console.log(response.data["courses"]);

                    for (let i = 0; i< response.data["courses"].length; i++){
                        let courses = response.data["courses"][i]
                        courses_objects.push({
                            id:courses["id"],
                            description: courses["description"],
                            title: courses["title"],
                            assignments: courses["assignments"]
                        })
                    }

                    //courses_objects.push(courses_objects[0])

                    get_all()
                    let config_get_user_list = {
                        method: "get",
                        url: `https://admin.simplebar.dk/api/user_list`,
                        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                    }
                    axios(config_get_user_list).then(function (response) {
                        for (let i = 0; i< response.data["list"].length; i++){
                            let user = response.data["list"][i]
                            all_users.push({
                                id:user["id"],
                                role: user["role"],
                                name: user["name"],
                                email: user["email"]
                            })
                        }
                        //console.log(user_object
                    }).catch(function (error){
                        if (error.response) {
                            console.log("failed to get users")
                        }
                    })
                    //console.log(courses_objects)

                }).catch(function (error){
                    if (error.response) {
                        console.log("failed to get courses")
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
                    window.location.replace("index.html");
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

function getusers(){
    window.location.replace("admin-dashboard.html")
}

function get_all(){
    remove_content_from_table()
    insertcourseintotable(courses_objects);
}


function remove_content_from_table(){
    $('#table tbody').empty();
}




function insertcourseintotable(array_of_course_object){
    let table = document.getElementById("table").getElementsByTagName('tbody')[0];
    if(array_of_course_object.length === 0) return;
    for (let i = 0; i < array_of_course_object.length; i++){
        let row = table.insertRow(0);
        let name_cell = row.insertCell(0);
        let course_id = row.insertCell(1);
        let action_cell = row.insertCell(2);
        let name = array_of_course_object[i]['title']
        name_cell.innerHTML = "<a class = 'get_assignment'>" +  name  +  "</a>";
        course_id.innerHTML = array_of_course_object[i]["id"]
        action_cell.innerHTML = "<a class = 'delete_course'><i   class='fas fa-trash'></i></a>" + "<a class = 'user_course'><i   class='fas fa-user'></i></a>" + "<a class='add_user_course'><i class='fas fa-user-plus'></i></a> "


    }

}

function insertassignmentintotable(course){
    let table = document.getElementById("table_assignment").getElementsByTagName('tbody')[0];
    let assignments = course["assignments"]
    if(assignments == null) {
        return;
    }
    course_id_used = course["id"]
    for (let i = 0; i < assignments.length; i++){
        let row = table.insertRow(i);
        let name_cell = row.insertCell(0);
        let assignment_id = row.insertCell(1);
        let action_cell = row.insertCell(2);
        name_cell.innerHTML = assignments[i]['title']
        assignment_id.innerHTML = assignments[i]['id']
        action_cell.innerHTML = "<a class = 'delete_assignment'><i   class='fas fa-trash'></i></a>" + "<a class = 'user_assignment'><i   class='fas fa-user'></i></a>" + "<a class='add_user_assignment'><i class='fas fa-user-plus'></i></a> "
    }
}


function insertusersintotable(users){
    let table = document.getElementById("table_users").getElementsByTagName('tbody')[0];

    users_used = users
    for (let i = 0; i < users.length; i++){
        for (let j = 0; j < all_users.length; j++){

            if(users[i].email === all_users[j]["email"]){
                let row = table.insertRow(i);
                let name_cell = row.insertCell(0);
                let email_cell = row.insertCell(1);
                let role_cell = row.insertCell(2);
                let action_cell = row.insertCell(3)
                name_cell.innerHTML = users[i]['name']
                email_cell.innerHTML = users[i]['email']
                let role_of_person = all_users[j]["role"][0]
                role_cell.innerHTML = all_users[j]["role"]
                if (role_of_person === "student"){
                action_cell.innerHTML =  "<a class = 'delete_users'><i   class='fas fa-trash'></i></a>"

                }
            }
        }


    }
}

function insertpontialusersintotable_course(users){
    let table = document.getElementById("table_users").getElementsByTagName('tbody')[0];
    users_used = users
    for (let i = 0; i < users.length; i++){
        let row = table.insertRow(i);
        let name_cell = row.insertCell(0);
        let email_cell = row.insertCell(1);
        let role_cell = row.insertCell(2);
        let action_cell = row.insertCell(3)
        name_cell.innerHTML = users[i]['name']
        email_cell.innerHTML = users[i]['email']
        role_cell.innerHTML = users[i]['role']
        action_cell.innerHTML = "<a class = 'add_course_to_user_not_yet_on_in'><i   class='fas fa-check'></i></a>"
    }
}

function insertpontialusersintotable_assignment(users){
    let table = document.getElementById("table_users").getElementsByTagName('tbody')[0];
    users_used = users
    for (let i = 0; i < users.length; i++){
        let row = table.insertRow(i);
        let name_cell = row.insertCell(0);
        let email_cell = row.insertCell(1);
        let role_cell = row.insertCell(2);
        let action_cell = row.insertCell(3)
        name_cell.innerHTML = users[i]['name']
        email_cell.innerHTML = users[i]['email']
        role_cell.innerHTML = users[i]['role']
        action_cell.innerHTML = "<a class = 'add_assignment_to_user_not_yet_on_in'><i   class='fas fa-check'></i></a>"
    }
}


function remove_assignment_from_table (assignment_id){
    let assigments = find_course(course_id_used)["assignments"]
    let indexofremovedelement = -1
    for (let i = 0; i<assigments.length;i++){
        if(assigments[i]["id"] === Number(assignment_id)){
            indexofremovedelement = i;
        }
    }
    if(indexofremovedelement !== -1){
        assigments.splice(indexofremovedelement, 1)
    }

}

function remove_user_from_table(email){
    let indexofremovedelement = -1
    for (let i = 0; i<users_used.length; i++){
        if(users_used[i]["email"] === email){
            indexofremovedelement = i;
        }
    }
    if(indexofremovedelement !== -1){
        users_used.splice(indexofremovedelement, 1)
    }
}


function remove_course_from_table(id){
    for (let i = 0; i<courses_objects.length; i++){
        if (courses_objects[i]["id"] === Number(id) ){
            courses_objects.splice(i, 1)
        }
    }
}

$(document).on("click", ".get_assignment", function(){
    let course_id = $(this).parents("tr")[0]["childNodes"][1].innerText
    let course = find_course(course_id)
    $('#table_assignment tbody').empty();
    insertassignmentintotable(course)


});

$(document).on("click", ".delete_course", function(){
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

            let id = $(this).parents("tr")[0]["childNodes"][1].innerHTML
            let config_user_delete = {
                method: "DELETE",
                url: `https://course.simplebar.dk/api/course/${id}`,
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            };
            axios(config_user_delete).then(function (response) {
                remove_course_from_table(id)
                $('#table tbody').empty();
                insertcourseintotable(courses_objects)
            }).catch(function (error){
                if (error.response) {
                    console.log("failed to delete user")
                }
            })



        }
    })


});


$(document).on("click", ".delete_assignment", function(){
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
            let assignment_id =  $(this).parents("tr")[0]["childNodes"][1].innerHTML
            let config_assignment_delete = {
                method: "DELETE",
                url: `https://course.simplebar.dk/api/course/${course_id_used}/assignment/${assignment_id}`,
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            };

            axios(config_assignment_delete).then(function (response) {
                let assignment_id = $(this).parents("tr")[0]["childNodes"][1].innerHTML
                remove_assignment_from_table(assignment_id)
                $('#table_assignment tbody').empty();
                insertassignmentintotable(find_course(course_id_used))
            }).catch(function (error){
                if (error.response) {
                    console.log("failed to delete user")
                }
            })



        }
    })


});

$(document).on("click", ".delete_users", function(){
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
            let email = $(this).parents("tr")[0]["childNodes"][1].innerHTML
            let user_id = findid(email)

            if (where_user_came_from === "course"){
                let config_user_delete = {
                    method: "DELETE",
                    url: `https://course.simplebar.dk/api/course/${course_id_used}/student/${user_id}`,
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                };

                axios(config_user_delete).then(function (response) {
                    remove_user_from_table(email)
                    $('#table_users tbody').empty();
                    insertusersintotable(users_used)
                }).catch(function (error){
                    if (error.response) {
                        console.log("failed to delete user")
                    }
                })
            }
            if(where_user_came_from === "assignment"){
                let config_user_delete = {
                    method: "DELETE",
                    url: `https://course.simplebar.dk/api/assignment/${assignment_id_used}/student/${user_id}`,
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                };
                axios(config_user_delete).then(function (response) {
                    remove_user_from_table(email)
                    $('#table_users tbody').empty();
                    insertusersintotable(users_used)
                }).catch(function (error){
                    if (error.response) {
                        console.log("failed to delete user")
                    }
                })
            }



        }


    })


});


$(document).on("click", ".user_course", function(){
    where_user_came_from = "course"
    $('#table_users tbody').empty();
    let course_name = $(this).parents("tr")[0]["childNodes"][0].innerText
    let id = $(this).parents("tr")[0]["childNodes"][1].innerText
    console.log(course_name, id)
    var config_get_users = {
        method: "get",
        url: `https://course.simplebar.dk/api/course/${id}`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };
    axios(config_get_users).then(function (response) {
        let participants = response.data["List of participants"]
        console.log(participants)
        insertusersintotable(participants)
        document.getElementById("users").innerHTML = "<h2> Users <b>in </b> " + course_name + " </h2></div>";
        course_id_used = id
        console.log("why")
        //console.log(courses_objects)
    }).catch(function (error){
        if (error.response) {
            console.log("failed to get participans")
        }
    })

})

$(document).on("click", ".user_assignment", function(){
    let title = $(this).parents("tr")[0]["childNodes"][0].innerText
    let id = $(this).parents("tr")[0]["childNodes"][1].innerText
    assignment_id_used = id
    where_user_came_from = "assignment"
    $('#table_users tbody').empty();

    var config_get_users = {
        method: "get",
        url: `https://course.simplebar.dk/api/assignment/${id}`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };
    axios(config_get_users).then(function (response) {
        let participants = response.data["List of participants"]
        console.log(participants)
        insertusersintotable(participants)
        document.getElementById("users").innerHTML = "<h2> Users <b> in </b> " + title + " </h2></div>";
        document.getElementById("users").innerHTML = "<h2> Users <b> in </b> " + title + " </h2></div>";
        //console.log(courses_objects)
    }).catch(function (error){
        if (error.response) {
            console.log("failed to get courses")
        }
    })

})

$(document).on("click", ".add_user_course", function() {
    $('#table_users tbody').empty();
    let course_name = $(this).parents("tr")[0]["childNodes"][0].innerText
    let course_id = $(this).parents("tr")[0]["childNodes"][1].innerText

        var config_get_users = {
            method: "get",
            url: `https://course.simplebar.dk/api/course/${course_id}`,
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        };

        axios(config_get_users).then(function (response) {
            let participants = response.data["List of participants"]
            let user_that_can_be_added = []
            for(let i = 0; i < all_users.length; i++){
                let check = false
                for (let j = 0; j < participants.length; j++){
                    if(participants[j].id === all_users[i].id ){
                        check = true
                    }
                }
                if(!check) user_that_can_be_added.push(all_users[i])
            }
            users_used = user_that_can_be_added
            course_id_used = course_id
            document.getElementById("users").innerHTML = "<h2> Users <b>Not in </b> " + course_name + " </h2></div>";
            insertpontialusersintotable_course(user_that_can_be_added)

        }).catch(function (error){
            if (error.response) {
                console.log("failed to get participans")
            }
        })



})


$(document).on("click", ".add_user_assignment", function() {
    $('#table_users tbody').empty();
    let assignment_name = $(this).parents("tr")[0]["childNodes"][0].innerText

    let assignment_id = $(this).parents("tr")[0]["childNodes"][1].innerText
    let config_get_user_list = {
        method: "get",
        url: `https://admin.simplebar.dk/api/user_list`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }
    axios(config_get_user_list).then(function (response) {
        all_users = []
        for (let i = 0; i< response.data["list"].length; i++){
            let user = response.data["list"][i]
            if(!user["role"].includes("student")) continue
            all_users.push({
                id:user["id"],
                role: user["role"],
                name: user["name"],
                email: user["email"]
            })
        }
        var config_get_users = {
            method: "get",
            url: `https://course.simplebar.dk/api/assignment/${assignment_id}`,
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        };
        axios(config_get_users).then(function (response) {
            let participants = response.data["List of participants"]
            let user_that_can_be_added = []
            for(let i = 0; i < all_users.length; i++){
                let check = false
                for (let j = 0; j < participants.length; j++){
                    if(participants[j].id === all_users[i].id ){
                        check = true
                    }
                }
                if(!check) user_that_can_be_added.push(all_users[i])
            }
            insertpontialusersintotable_assignment(user_that_can_be_added)
            users_used = user_that_can_be_added
            assignment_id_used = assignment_id
            document.getElementById("users").innerHTML = "<h2> Users <b>Not in </b> " + assignment_name + "</h2></div>";
        }).catch(function (error){
            if (error.response) {
                console.log("failed to get participans")
            }
        })

    }).catch(function (error){
        if (error.response) {
            console.log("failed to get users")
        }
    })
})

$(document).on("click", ".add_course_to_user_not_yet_on_in", function() {
    let email = $(this).parents("tr")[0]["childNodes"][1].innerText
    let user_id = findid(email)
    var config_add_user = {
        method: "post",
        url: `https://admin.simplebar.dk/api/course/${course_id_used}/user/${user_id}`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };
    axios(config_add_user).then(function (response) {
        $('#table_users tbody').empty();
        insertpontialusersintotable_course(users_used.filter(user => user.id !== user_id))
    }).catch(function (error){
        if (error.response) {


        }
    })
})

$(document).on("click", ".add_assignment_to_user_not_yet_on_in", function() {
    let email = $(this).parents("tr")[0]["childNodes"][1].innerText
    let user_id = findid(email)
    var config_add_user = {
        method: "post",
        url: `https://admin.simplebar.dk/api/assignment/${assignment_id_used}/user/${user_id}`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };
    axios(config_add_user).then(function (response) {
        $('#table_users tbody').empty();
        insertpontialusersintotable_assignment(users_used.filter(user => user.id !== user_id))
    }).catch(function (error){
        if (error.response) {


        }
    })
})

function find_course(id){
    for(let i=0; i < courses_objects.length; i++){
        if(courses_objects[i]["id"] === Number(id)){
            return courses_objects[i]
        }
    }
    return Error
}

function findid(email){
    for (let i=0; i< users_used.length; i++){
        if (users_used[i]["email"] === email){
            return users_used[i]["id"]
        }
    }
    return Error
}
function insert_data(array_of_user_object) {
    let table = document.getElementById("table_assignment").getElementsByTagName('tbody')[0];
    for (let i = 0; i < array_of_user_object.length; i++) {
        let row = table.insertRow(0);
        let name_cell = row.insertCell(0);
        let email_cell = row.insertCell(1);
        let role_cell = row.insertCell(2);
        let action_cell = row.insertCell(3);
        let name = array_of_user_object[i]['name']
        name_cell.innerHTML = "<a class = 'get_details'>" + name + "</a>";
        email_cell.innerHTML = array_of_user_object[i]["email"]
        role_cell.innerHTML = array_of_user_object[i]["role"]
        action_cell.innerHTML = "<a class = 'delete'><i   class='fa fa-trash'></i></a>"
    }
}


function insertdataintotable_courses(courses){

}