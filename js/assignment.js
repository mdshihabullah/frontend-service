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
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const title = urlParams.has("title") ? urlParams.get("title") : "";
        document.getElementById("assignment-title").innerText = title;
        const created_at = urlParams.has("created_at")
          ? urlParams.get("created_at")
          : "";
        console.log("Assignment_title: ", typeof created_at);
        //Check file size
        this.validateFileSize();
        //UPLOAD ASSIGNMENT
        const myForm = document.getElementById("myForm");
        const inputFile = document.getElementById("input-file");

        myForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const endPoint = "https://upload.simplebar.dk/api/upload/solution";
          const formData = new FormData();
          //Append solution zip file
          formData.append("solution", inputFile.files[0]);
          //Append assignmentID zip file
          // formData.append("assignmentID", "1234");
          console.log(
            "🚀 ~ file: assignment.js ~ line 84 ~ formData",
            formData
          );
          console.log(
            "🚀 ~ file: assignment.js ~ line 84 ~ inputfile",
            inputFile.files[0]
          );
          $.ajax({
            url: "https://upload.simplebar.dk/api/upload/solution",
            type: "POST",
            data: formData,
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            processData: false,
            contentType: false,
            success: function (result) {
              console.log("Solution uploaded successfully");
              Swal.fire({
                icon: "success",
                title: "Uploaded successfully!",
                text: "Your solution has been uploaded successfully.",
                footer: "Please wait to get back the test results"
              });
            },
          });
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
//DOWNLOAD ASSIGNMENT
$("#download-btn").on("click", function () {
  assignId = "1234";
  console.log("assignId", assignId)
  document.getElementById("download-btn").href = "http://www.africau.edu/images/default/sample.pdf";
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
