let user_objects = []
let used_user_id;
let courses_used;
let assignment_used;
let course_id_used;
let role = "All"
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
                const name = response.data.user.name;
                const email = response.data.user.email;
                const role = response.data.role[0];
                let name_block = document.getElementById("username");
                name_block.innerHTML = `Hi,&nbsp;<a href="#" title="${email}" style="text-decoration: none; color: deepskyblue; white-space: nowrap;"> ${name}!</a>`;
        
                if (role !== "admin"){
                    window.location.replace("index.html")
                }
                let config_get_user_list = {
                    method: "get",
                    url: `https://admin.simplebar.dk/api/user_list`,
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                }
                axios(config_get_user_list).then(function (response) {
                    console.log(response.data)
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
                window.location.replace("index.html")
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




function insertdataintotable(array_of_user_object){
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
    name_cell.innerHTML = name
    email_cell.innerHTML = array_of_user_object[i]["email"]
    role_cell.innerHTML = array_of_user_object[i]["role"]
    if (array_of_user_object[i]["role"][0] === "student"  )action_cell.innerHTML = "<a class = 'delete'><i   class='fa fa-trash'></i></a>"+ "<a class = 'get_details'> <i   class='fas fa-user'></i> </a>" +  "<a class = 'get_nonadded_course'><i   class='fas fa-user-plus'></i></a>"
    else{
        action_cell.innerHTML = "<a class = 'delete'><i   class='fa fa-trash'></i></a>"
    }
}




function get_students(){
    remove_content_from_table()
    role = "student"
    insertdataintotable(user_objects )
}
function get_teacher(){
    remove_content_from_table()
    role = "teacher"
    insertdataintotable(user_objects)
}

function get_admin(){
    remove_content_from_table()
    role = "admin"
    insertdataintotable(user_objects)
}

function get_all(){
    remove_content_from_table()
    role = "All"
    insertdataintotable(user_objects);



}

function remove_content_from_table(){
    $('#table tbody').empty();
}

function insert_assignment_not_yet_added(assignment){
    let table = document.getElementById("table_assignment").getElementsByTagName('tbody')[0];
    for (let i= 0; i < assignment.length; i++){
        let row = table.insertRow(0);
        let name_cell = row.insertCell(0);
        let ID_cell = row.insertCell(1);
        let action_cell = row.insertCell(2);
        let name = assignment[i]['title']
        name_cell.innerHTML =   name
        ID_cell.innerHTML = assignment[i]["id"]
        action_cell.innerHTML = "<a class = 'insert_assignment_not_yet_added'><i   class='fa fa-check'></i></a>"
    }
}





function insert_assignment(assignment){
    let table = document.getElementById("table_assignment").getElementsByTagName('tbody')[0];
    if (assignment == null) return
    for (let i= 0; i < assignment.length; i++){
        let row = table.insertRow(0);
        let name_cell = row.insertCell(0);
        let ID_cell = row.insertCell(1);
        let action_cell = row.insertCell(2);
        let name = assignment[i]['title']
        name_cell.innerHTML =   name 
        ID_cell.innerHTML = assignment[i]["id"]
        action_cell.innerHTML = "<a class = 'delete_assignment'><i   class='fa fa-trash'></i></a>"
    }
}


function insert_course_not_yet_added(course){
    let table = document.getElementById("table_course").getElementsByTagName('tbody')[0];
    for (let i= 0; i < course.length; i++){
        let row = table.insertRow(0);
        let name_cell = row.insertCell(0);
        let ID_cell = row.insertCell(1);
        let action_cell = row.insertCell(2);
        let name = course[i]['title']
        name_cell.innerHTML = name
        ID_cell.innerHTML = course[i]["id"]
        action_cell.innerHTML = "<a class = 'insert_course_not_yet_added'><i   class='fa fa-check'></i></a>"
    }
}


function insert_course(course){
    let table = document.getElementById("table_course").getElementsByTagName('tbody')[0];
    for (let i= 0; i < course.length; i++){
        let row = table.insertRow(0);
        let name_cell = row.insertCell(0);
        let ID_cell = row.insertCell(1);
        let action_cell = row.insertCell(2);
        let name = course[i]['title']
        name_cell.innerHTML = name;
        ID_cell.innerHTML = course[i]["id"]
        action_cell.innerHTML = "<a class = 'delete_course'><i   class='fa fa-trash'></i></a>" + "<a class = 'get_assignments'> <i   class='fa fa-user'></i> </a>"  + "<a class = 'get_nonadded_assignment'><i   class='fas fa-user-plus'></i></a>"
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

$(document).on("click", ".get_assignments", function(){
    $('#table_assignment tbody').empty();
    let course_id = $(this).parents("tr")[0]["childNodes"][1].innerHTML
    let config_get_user_courses = {
        method: "get",
        url: `https://admin.simplebar.dk/api/user/${used_user_id}`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }
    axios(config_get_user_courses).then(function (response) {
        let user_courses =  response.data["courses"]

        for (let i = 0; i < user_courses.length; i++){
            let course = user_courses[i]
            if (course.id === Number(course_id)){
                assignment_used = course["assignments"]
                course_id_used = course_id
                break
            }

        }
        insert_assignment(assignment_used)
    }).catch(function (error){
        if (error.response) {
            console.log("failed to get courses")
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
                $('#table tbody').empty();
                deleterow(email_of_person)
                insertdataintotable(user_objects)

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
                url: `https://course.simplebar.dk/api/course/${course_id}/student/${used_user_id}`,
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            };
            axios(config_user_delete).then(function (response) {
                courses_used = courses_used.filter(course => Number(course.id) !== Number(course_id))
                $('#table_course tbody').empty();
                insert_course(courses_used)

            }).catch(function (error){
                if (error.response) {
                    console.log("failed to delete course")
                }
            })


        }
    })
})

$(document).on("click", ".delete_assignment", function() {
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
            let assignment_id = $(this).parents("tr")[0]["childNodes"][1].innerHTML


            let config_user_delete = {
                    method: "DELETE",
                    url: `https://course.simplebar.dk/api/assignment/${assignment_id}/student/${used_user_id}`,

                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            };
            axios(config_user_delete).then(function (response) {
                assignment_used = assignment_used.filter(assignment => Number(assignment.id) !== Number(assignment_id))
                $('#table_assignment tbody').empty();
                insert_assignment(assignment_used)

            }).catch(function (error){
                if (error.response) {
                    console.log("failed to delete assignment")
                }
            })




        }
    })
})

$(document).on("click", ".get_nonadded_course", function(){
    $('#table_course tbody').empty();
    let email = $(this).parents("tr")[0]["childNodes"][1].innerText
    let id = findid(email)
    let config_get_courses = {
        method: "get",
        url: `https://admin.simplebar.dk/api/courses`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }
    axios(config_get_courses).then(function (response) {
        let all_courses = []
        for (let i = 0; i< response.data["courses"].length; i++){
            let courses = response.data["courses"][i]
            all_courses.push({
                id:courses["id"],
                description: courses["description"],
                title: courses["title"],
                assignments: courses["assignments"]
            })
        }
        let config_get_user_courses = {
            method: "get",
            url: `https://admin.simplebar.dk/api/user/${id}`,
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
        axios(config_get_user_courses).then(function (response) {
            let user_courses =  response.data["courses"]
            let availbe_courses = []

            for (let i=0; i < all_courses.length; i++){
                let check = false

                for (j= 0; j < user_courses.length; j++){
                    if (user_courses[j].id === all_courses[i].id ) check = true
                }
                if (!check) availbe_courses.push(all_courses[i])
            }
            used_user_id = id
            courses_used = availbe_courses
            insert_course_not_yet_added(availbe_courses)
        }).catch(function (error){
            if (error.response) {
                console.log("failed to get courses")
            }
        })


        //console.log(courses_objects)

    }).catch(function (error){
        if (error.response) {
            console.log("failed to get courses")
        }
    })

})

$(document).on("click", ".insert_course_not_yet_added", function(){
    let id_course = $(this).parents("tr")[0]["childNodes"][1].innerText
    var config_add_user = {
        method: "post",
        url: `https://admin.simplebar.dk/api/course/${id_course}/user/${used_user_id}`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };
    axios(config_add_user).then(function (response) {
        $('#table_course tbody').empty();
        courses_used = courses_used.filter(course => course.id !== Number(id_course))
        insert_course_not_yet_added(courses_used)
    }).catch(function (error){
        if (error.response) {


        }
    })


})

$(document).on("click", ".insert_assignment_not_yet_added", function(){
    let id_assignment = $(this).parents("tr")[0]["childNodes"][1].innerText


    var config_add_user = {
        method: "post",
        url: `https://admin.simplebar.dk/api/assignment/${id_assignment}/user/${used_user_id}`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };
    axios(config_add_user).then(function (response) {
        $('#table_assignment tbody').empty();
        insert_assignment_not_yet_added(assignment_used.filter(assignment => assignment.id !== Number(id_assignment)))
    }).catch(function (error){
        if (error.response) {


        }
    })


})



$(document).on("click", ".get_nonadded_assignment", function() {
    $('#table_assignment tbody').empty();
    let id_course = $(this).parents("tr")[0]["childNodes"][1].innerText
    let user_id = used_user_id


    let config_user_assignment = {
        method: "get",
        url: `https://admin.simplebar.dk/api/courses`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };
    axios(config_user_assignment).then(function (response) {
        let assignment = response.data["courses"].filter(course => course.id === Number(id_course))[0]["assignments"]
        if(assignment == null) return
        //console.log(assignment)
        var config_get_user = {
            method: "get",
            url: `https://admin.simplebar.dk/api/user/${user_id}`,
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        };
        axios(config_get_user).then(function (response) {
            let user_assignment = response.data["courses"]
            let assignment_of_user = getcourse(user_assignment, id_course)

            let availbe_courses = []
            for(let i = 0; i < assignment.length; i++){
                let check = true
                for (let j = 0; j < assignment_of_user.length; j++){
                    if(assignment[i].id === assignment_of_user[j].id) check = false
                }
                if(check)availbe_courses.push(assignment[i])
            }
            assignment_used = availbe_courses
            insert_assignment_not_yet_added(availbe_courses)

        }).catch(function (error){
            if (error.response) {
                console.log("failed to get participans")
            }
        })

        /*
        let users_assignment = courses_used.filter(course => course.id === Number(id_course))["assignments"]
        if(users_assignment == null) users_assignment = []
        console.log(users_assignment)
        /*
        let not_added_assignment = []
        for(let i=0; i<assignment.length; i++){
            let assignment_id = assignment[i].id
            var config_get_users = {
                method: "get",
                url: `https://course.simplebar.dk/api/assignment/${assignment_id}`,
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            };
            axios(config_get_users).then(function (response) {
                let participants = response.data["List of participants"]
                for(let j = 0; j < participants.length; j++){
                    if (participants[j].id === Number(user_id)){
                        not_added_assignment.push(assignment[i])
                    }
                }
                //console.log(courses_objects)
                if(i === assignment.length -1) {
                    insert_assignment_not_yet_added(not_added_assignment)
                    assignment_used = not_added_assignment
                }

            }).catch(function (error){
                if (error.response) {
                    console.log("failed to get participans")
                }
            })


        }

         */

    }).catch(function (error){
        if (error.response) {
            console.log("failed to courses details")
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

function getcourse(courses, course_id){
    for (let i = 0; i < courses.length; i++){

        if(courses[i].id === Number(course_id)){

            return courses[i]["assignments"]
        }


    }
    return null
}