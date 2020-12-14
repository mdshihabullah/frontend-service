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
        let name_block = document.getElementById("username");
        name_block.innerHTML = `Hi,&nbsp;<a href="#" title="${email}" style="text-decoration: none; color: deepskyblue;"> ${name}!</a>`;
        if(role == "teacher"){
          
        config = {
          method: "get",
          url: `https://course.simplebar.dk/api/me`,
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        };

        axios(config)
          .then(function (response) {
          console.log("Course assignment INFO \n", response.data);
          let course_and_assignment_details = response.data;

        //TODO GET NAME OF COURSES FROM API
        let list_tab = document.getElementById("list-tab");
        //GET FROM API
        let course_list = [];
        let assignment_list = [];

      console.log("Course_and_assignment_details", course_and_assignment_details);

        course_and_assignment_details.courses.map((course) =>
          course_list.push({
            title: course.title,
            code: course.id,
            description: course.description,
            assign_count: course.assignments ? course.assignments.length : 0,
          })
        );
        course_and_assignment_details.courses.map((course) =>
          assignment_list.push(course.assignments ?course.assignments: {})
        );
        console.log("Course_list", course_list);
        console.log("Assignment_list", assignment_list);
        console.log("Assignment_list", assignment_list[1][0]);

        for (let index = 0; index < course_list.length; index++) {
          if (index == 0) {
          
            list_tab.innerHTML += `<a class="list-group-item d-flex justify-content-between align-items-center list-group-item-action active" id="list-${course_list[index].title}-list" data-toggle="list" href="#list-${course_list[index].title}" role="tab" aria-controls="${course_list[index].title}">${course_list[index].title}<span class="badge badge-dark badge-pill">${course_list[index].assign_count}</span></a>`;
          } else {
            list_tab.innerHTML += `<a class="list-group-item d-flex justify-content-between align-items-center list-group-item-action" id="list-${course_list[index].title}-list" data-toggle="list" href="#list-${course_list[index].title}" role="tab" aria-controls="${course_list[index].title}">${course_list[index].title}<span class="badge badge-dark badge-pill">${course_list[index].assign_count}</span></a>`;
          }
        }
        list_tab.innerHTML += `<a href="upload-course.html" id="upload-course" class="mt-5 btn btn-success"><i class="fas fa-plus-circle pr-2"></i>Upload New Course</a>`

        let list_tab_html_content = "";

        for (let index = 0; index < assignment_list.length; index++) {
          if (index == 0) {
            list_tab_html_content += `<div class="tab-pane fade show active" id="list-${course_list[index].title}" role="tabpanel" aria-labelledby="list-${course_list[index].title}-list">
                <div class="list-group">`;
                  var assignment_each_course = assignment_list[index];
                  for (let i = 0; i < assignment_each_course.length; i++) {
                    const assignment = assignment_each_course[i];
                    if (assignment !={}){
                      console.log("assignment for course"+index, assignment);
                    let created_at = Date.parse(assignment.created_at);
                    console.log("assign created at",created_at);
                    let daysDifference = Math.floor( (Date.now() - created_at) / 1000 / 60 / 60 / 24);
                    let deadline = new Date(assignment.due_date).toDateString();
                    let assignment_desc = assignment.description;
                    
                    list_tab_html_content += `<div class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="mb-1 d-flex w-100 justify-content-between">
                          <h5 class="mb-1"><a href="assignment.html?id=${assignment.id}&title=${assignment.title}&created_at=${created_at}&deadline=${deadline}&pdf_link=${assignment_desc}" style="text-decoration:none">${assignment.title}</a></h5>
                          <small>Created: ${daysDifference} days ago</small>
                        </div>
                        <p class="mb-2">${assignment_desc}</p>
                        <small><mark><b style="color:#ff4136">Deadline: ${deadline}</b><mark></small>
                        <button id="delete-assign-btn" value="${assignment.id},${course_list[index].code},${assignment.title} " onclick="deleteAssignment();" class= "btn btn-danger float-right">Delete</button>
                      </div>`;

                    }
                  }             
            
            list_tab_html_content += `</div></div>`;
          } else {
            list_tab_html_content += `<div class="tab-pane fade show" id="list-${course_list[index].title}" role="tabpanel" aria-labelledby="list-${course_list[index].title}-list">
                <div class="list-group">`;

                  assignment_each_course = assignment_list[index];
                  for (let i = 0; i < assignment_each_course.length; i++) {
                    const assignment = assignment_each_course[i];
                    if (assignment !={}){
                      console.log("assignment for course"+index, assignment);
                    let created_at = Date.parse(assignment.created_at);
                    console.log("assign created at",created_at);
                    let daysDifference = Math.floor( (Date.now() - created_at) / 1000 / 60 / 60 / 24);
                    let deadline = new Date(assignment.due_date).toDateString();
                    let assignment_desc = assignment.description;
                    
                    list_tab_html_content += `<div class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="mb-1 d-flex w-100 justify-content-between">
                          <h5 class="mb-1"><a href="assignment.html?id=${assignment.id}&title=${assignment.title}&created_at=${created_at}&deadline=${deadline}&pdf_link=${assignment_desc}" style="text-decoration:none">${assignment.title}</a></h5>
                          <small>Created: ${daysDifference} days ago</small>
                        </div>
                        <p class="mb-2">${assignment_desc}</p>
                        <small><mark><b style="color:#ff4136">Deadline: ${deadline}</b><mark></small>
                        <button id="delete-assign-btn" value="${assignment.id},${course_list[index].code},${assignment.title}" onclick="deleteAssignment();" class= "btn btn-danger float-right">Delete</button>
                      </div>`;

                    }
                    
                  }

            list_tab_html_content += `</div></div>`;
          }
        }
        // console.log(list_tab_html_content);
        document.getElementById("nav-tabContent").innerHTML = list_tab_html_content;
          
          
          }).catch(function (error) {
            console.log("Error", error);
          });
        }else{
          sessionStorage.removeItem("token");
          window.location.replace("index.html");
        }

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
const deleteAssignment = (event) => {

  const assign_id = document.getElementById("delete-assign-btn").value.split(",")[0];
  console.log("Assign_id", assign_id)
  const course_id = document.getElementById("delete-assign-btn").value.split(",")[1];
  console.log("Course_id", course_id)
  var result = confirm(`Do you confirm deleting "${document.getElementById("delete-assign-btn").value.split(",")[2]}"?`);
  if (result) {
    $.ajax({
      url: 'https://course.simplebar.dk/api/delete_assignment' + '?' + $.param({"id": assign_id, "course_id" : course_id}),
      type: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      // processData: false,
      // contentType: false,
      success: function (result) {
        console.log("SUCESS OF DELETE ASSIGNMENT API \n");
        console.log(result);
        course_details =result;
        Swal.fire({
          icon: "success",
          title: "Done",
          text: `Assignment  ${assign_id} has been deleted successfully!`,
          footer: "Click OK to go back to dashboard",
        }).then(() => {
          window.location.replace("teacher-dashboard.html");
        });
      },
      error: function (result) {
        console.log("FAILED DELETE ASSIGNMENT API CALL");
      }
    });
  }
  
};