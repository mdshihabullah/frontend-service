var role;
var pdf_link;
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
        const user_id = response.data.user.id;
        role = response.data.role[0];
        let name_block = document.getElementById("username");
        name_block.innerHTML = `Hi,&nbsp;<a href="#" title="${email}" style="text-decoration: none; color: deepskyblue;"> ${name}!</a>`;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const title = urlParams.has("title") ? urlParams.get("title") : "";
        document.getElementById("assignment-title").innerText = title;
        const created_at = urlParams.has("created_at")
          ? urlParams.get("created_at")
          : "";
        console.log("Assignment_title: ", typeof created_at);
        
        const deadline = urlParams.has("deadline")
          ? urlParams.get("deadline")
          : "";
          document.getElementById("deadline").innerText = `DEADLINE: ${deadline}`;
        console.log("Assignment Deadline: ", deadline);

        pdf_link = urlParams.has("pdf_link")
          ? urlParams.get("pdf_link")
          : "";
        console.log("Assignment PDF LINK: ", pdf_link);

        const assign_id = urlParams.has("id")
          ? urlParams.get("id")
          : "";
          const course_id = urlParams.has("course_id")
          ? urlParams.get("course_id")
          : "";
        console.log("Assignment ID: ", parseInt(assign_id));
        document.getElementById("assignment_id").value = assign_id;
        document.getElementById("pdf_link").src = pdf_link;
        document.getElementById("assignment-user").src = `./show-user-assignment.html?id=${assign_id}`;
        //Check file size
        this.validateFileSize();
        //UPLOAD ASSIGNMENT
        const myForm = document.getElementById("myForm");
        const inputFile = document.getElementById("input-file");

        myForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const endPoint = "https://upload.simplebar.dk/api/docker";
          const formData = new FormData();
          //Append solution zip file
          formData.append("image", inputFile.files[0]);
          
          //Append assignmentID 
          console.log("Assign_ID", document.getElementById("assignment_id").value)

          formData.append("assignment_id", document.getElementById("assignment_id").value);
          console.log("FormData", formData);
          console.log("Inputfile", inputFile.files[0]);
          console.log("Docker upload API called");
          $.ajax(
            {
              url: endPoint,
              type: "POST",
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              data: formData,
              cache: false,
              contentType: false,
              processData: false,
              success: function (result) {
                console.log("Docker file has been uploaded successfully", result);
                Swal.fire({
                  icon: "success",
                  title: "Upload Successful!",
                  text: "The docker file has been uploaded to the server"
                }).then(() => {
                  window.location.replace("teacher-dashboard.html");
                });
                
              //   const solution_id = result.solution_id;
              //   const run_submission_end_point = "http://container.simplebar.dk/runsubmission";
              //   Swal.fire({
              //     icon: "success",
              //     title: "Uploaded successfully!",
              //     text: "Your solution is getting submitted.",
              //     footer: "Please wait while automatic submission in progress...",
              //   });
              //   continueFetching();
              //   function continueFetching() {
                  
              //     setTimeout(() => {
              //       console.log("countinue fetching........")
              //       $.ajax(
              //         {
              //           url: 'https://course.simplebar.dk/api/result',
              //           type: "GET",
              //           headers: {
              //             Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              //           },
              //           data: { 
              //             course_id: course_id, 
              //             assignment_id: assign_id
              //           },

              //           success: function (result) {
              //             if(result.Status == "Uploaded" || result.Status == "Testing started"){
              //               continueFetching();
              //             }else if(result.Status == "Completed"){
              //               console.log("Fetching assignment result is successful", result)
              //               document.getElementById("test-result-block").innerText= result.Result;
              //             }
                          
              //           },
              //   },
              //   "json"
              // );
              //     }, 5000);
                  
              //   }
              },
              error: function (result) {
              console.log("Result", result);
                
              }
            },
            "json"
          );
        });
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

function validateFileSize() {
  $("#input-file").on("change", function () {
    const size = (this.files[0].size / 1024 / 1024).toFixed(2);
    if (size <= 500) {
      const extension = this.files[0].type.split('/')[1]
      if ("application/x-zip-compressed".indexOf(extension) == -1 &&
      "application/x-tar".indexOf(extension) == -1 &&
      "application/x-gtar".indexOf(extension) == -1 ) {
        Swal.fire({
          icon: "error",
          title: "Invalid file",
          text: "The file you are trying to upload is not valid",
          footer: "Please try to upload .zip file.",
        }).then(()=>{
          $('#input-file').val('');
        });
        
      }
      return true;
    }
    else if (inputFile.files[0] == undefined) {
      Swal.fire({
        icon: "error",
        title: "No file has been selected",
        text: "Please select a file to upload"
      });
      return false;
    }
    else {
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
//DOWNLOAD ASSIGNMENT
$("#download-btn").on("click", function () {
  document.getElementById("download-btn").href = pdf_link;
})

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

$('#logo-block').click(function(){
  role == "student" ? window.location.replace("student-dashboard.html") : window.location.replace("teacher-dashboard.html");
});