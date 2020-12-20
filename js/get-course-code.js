window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("token")) {
    var config = {
      method: "get",
      url: `https://login.simplebar.dk/api/me`,
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };
    axios(config).then(function (response) {
      const role = response.data.role[0];
      if (role == "teacher") {
        const myForm = document.getElementById("generate-code-form");

        myForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const endPoint = "https://login.simplebar.dk/api/join/create";
          const formData = new FormData();
          formData.append("limit", document.getElementById("inputLimit").value);
          formData.append(
            "course",
            document.getElementById("inputCourseID").value
          );
          formData.append(
            "assignment",
            document.getElementById("inputAssignmentID").value
          );
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
                console.log(
                  "Get course code API has been called successfully",
                  result
                );
                Swal.fire({
                  icon: "success",
                  title: `${result.code.code}`,
                  text: `Copy and use the above code to enroll student in the mentioned course or assignment`,
                }).then(() => {
                  window.location.replace("teacher-dashboard.html");
                });
              },
              error: function (result) {
                console.log("Result", result);
              },
            },
            "json"
          );
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only teachers are allowed.",
        }).then(() => {
          sessionStorage.removeItem("token");
          window.location.replace("index.html");
        });
      }
    });
  } else {
    sessionStorage.removeItem("token");
    window.location.replace("index.html");
  }
});
