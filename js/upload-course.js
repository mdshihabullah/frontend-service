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
        if (role == "teacher") {
          let name_block = document.getElementById("username");
          name_block.innerHTML = `Hi,&nbsp;<a href="#" title="${email}" style="text-decoration: none; white-space: nowrap; color: deepskyblue;"> ${name}!</a>`;
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const title = urlParams.has("title") ? urlParams.get("title") : "";
          console.log("Assignment_title: ", title);
          const created_at = urlParams.has("created_at")
            ? urlParams.get("created_at")
            : "";
          console.log("Assignment_title: ", typeof created_at);
          //Check file size
          // this.validateFileSize("#input-test-file");
          // this.validateFileSize("#input-docker-file");
          //UPLOAD ASSIGNMENT
          const uploadCourseForm = document.getElementById("make-assignment");
          // const inputDockerFile = document.getElementById("input-docker-file");
          // const inputPDFFile = document.getElementById("input-pdf-file");
  
          uploadCourseForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const makeCourseData = new FormData();
            let course_details={};
            //Append solution zip file
            const title = document.getElementById("course_title").value;
            makeCourseData.append("title", title);
            makeCourseData.append("description", document.getElementById("course_desc").value);
            // makeCourseData.append("description",inputPDFFile.files[0]);
            //TODO
            //call make assignment API
            $.ajax({
              url: "https://course.simplebar.dk/api/course",
              type: "POST",
              data: makeCourseData,
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              processData: false,
              contentType: false,
              success: function (result) {
                console.log("SUCESS OF MAKE COURSE API \n");
                console.log(result);
                course_details =result;
                Swal.fire({
                  icon: "success",
                  title: "Done",
                  text: `Course named ${title} has been created successfully!`,
                  footer: "Click OK to go back to dashboard",
                }).then(() => {
                  window.location.replace("teacher-dashboard.html");
                });
              },
              error: function (result) {
                console.log("FAILED MAKE COURSE API CALL");
              }
            });
    
            
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only teachers are allowed."
          }).then(()=>{
            sessionStorage.removeItem("token");
            window.location.replace("index.html");
          });
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
          window.location.replace("index.html");
        }
      });
  } else {
    sessionStorage.removeItem("token");
    window.location.replace("index.html");
  }
});

function validateFileSize(id) {
  $(id).on("change", function () {
    const size = (this.files[0].size / 1024 / 1024).toFixed(2);
    if (size <= 5) {
      const extension = this.files[0].type.split('/')[1]
      if ("application/x-zip-compressed".indexOf(extension) == -1) {
        Swal.fire({
          icon: "error",
          title: "Invalid file",
          text: "The file you are trying to upload is not valid",
          footer: "Please try to upload .zip file.",
        });
        return false;
      }
      return true;
    } else {
      $('#input-file').val('');
      Swal.fire({
        icon: "error",
        title: "Too large file",
        text: "The file exceeded the size limit",
        footer: "Please try to upload .zip file less than or equal to 5 MB.",
      });
      return false;
    }
  });
}

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
