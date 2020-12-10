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
        if (role !== "student"){
            window.location.replace("index.html")
        }
        let name_block = document.getElementById("username");
        name_block.innerHTML = `Hi,&nbsp;<a href="#" title="${email}" style="text-decoration: none; color: deepskyblue;"> ${name}!</a>`;
        //TODO GET NAME OF COURSES FROM API
        let list_tab = document.getElementById("list-tab");
        //GET FROM API
        let course_list = ["DS808", "DM873", "DM874", "DM870"];
        //GET FROM API
        let assignment_list = [
          [
            "Assignment 01",
            "Assignment 02",
            "Assignment 03",
            "Final Assignment",
            "Project 01",
            "Bonus Assignment",
          ],
          ["Assignment 01", "Assignment 02", "Final Assignment"],
          ["Assignment 01", "Final Assignment"],
          ["Final Assignment"],
        ];
        for (let index = 0; index < course_list.length; index++) {
          if (index == 0) {
            list_tab.innerHTML += `<a class="list-group-item d-flex justify-content-between align-items-center list-group-item-action active" id="list-${course_list[index]}-list" data-toggle="list" href="#list-${course_list[index]}" role="tab" aria-controls="${course_list[index]}">${course_list[index]}<span class="badge badge-dark badge-pill">${assignment_list[index].length}</span></a>`;
          } else {
            list_tab.innerHTML += `<a class="list-group-item d-flex justify-content-between align-items-center list-group-item-action" id="list-${course_list[index]}-list" data-toggle="list" href="#list-${course_list[index]}" role="tab" aria-controls="${course_list[index]}">${course_list[index]}<span class="badge badge-dark badge-pill">${assignment_list[index].length}</span></a>`;
          }
        }
        let list_tab_html_content = "";

        for (let index = 0; index < assignment_list.length; index++) {
          if (index == 0) {
            list_tab_html_content += `<div class="tab-pane fade show active" id="list-${course_list[index]}" role="tabpanel" aria-labelledby="list-${course_list[index]}-list">
                <div class="list-group">`;

            assignment_list[index].forEach((assignment) => {
              let created_at = Date.parse('2020-11-29T12:59:00.000000Z');
              console.log("assign created at",created_at);
              let daysDifference = Math.floor( (Date.now() - created_at) / 1000 / 60 / 60 / 24);
              let deadline = new Date('2020-11-29T12:59:00.000000Z').toDateString();
              let assignment_desc = `This assignment is inspired by Gabin Belson who never ceased to amaze us just like Elrich Bachman.`;
              
              list_tab_html_content += `<div class="list-group-item list-group-item-action flex-column align-items-start">
                  <div class="mb-1 d-flex w-100 justify-content-between">
                    <h5 class="mb-1"><a href="assignment.html?title=${assignment}&created_at=${created_at}&deadline=${deadline}" style="text-decoration:none">${assignment}</a></h5>
                    <small>Created: ${daysDifference} days ago</small>
                  </div>
                  <p class="mb-2">${assignment_desc}</p>
                  <small><mark><b style="color:#ff4136">Deadline: ${deadline}</b><mark></small>
                </div>`;
            });

            list_tab_html_content += `</div></div>`;
          } else {
            list_tab_html_content += `<div class="tab-pane fade show" id="list-${course_list[index]}" role="tabpanel" aria-labelledby="list-${course_list[index]}-list">
                <div class="list-group">`;

            assignment_list[index].forEach((assignment) => {
              let created_at = Date.parse('2020-11-29T12:59:00.000000Z');
              console.log("assign created at",created_at);
              let daysDifference = Math.floor( (Date.now() - created_at) / 1000 / 60 / 60 / 24);
              let deadline = new Date('2020-11-29T12:59:00.000000Z').toDateString();
              let assignment_desc = `This assignment is inspired by Gabin Belson who never ceased to amaze us just like Elrich Bachman.`;
              
              list_tab_html_content += `<div class="list-group-item list-group-item-action flex-column align-items-start">
                      <div class="mb-1 d-flex w-100 justify-content-between">
                        <h5 class="mb-1"><a href="assignment.html?title=${assignment}&created_at=${created_at}&deadline=${deadline}" style="text-decoration:none">${assignment}</a></h5>
                        <small>Created: ${daysDifference} days ago</small>
                      </div>
                      <p class="mb-2">${assignment_desc}</p>
                      <small><mark><b style="color:#ff4136">Deadline: ${deadline}</b><mark></small>
                    </div>`;
            });

            list_tab_html_content += `</div></div>`;
          }
        }
        console.log(list_tab_html_content);
        document.getElementById("nav-tabContent").innerHTML = list_tab_html_content;
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
