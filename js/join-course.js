const myForm = document.getElementById("generate-code-form");

myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const endPoint = "https://login.simplebar.dk/api/join";
  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("password", document.getElementById("password").value);
  formData.append("password_confirmation", document.getElementById("confirm-password").value);
  formData.append("code", document.getElementById("code").value);
  formData.append("role", "student");

  $.ajax(
    {
      url: endPoint,
      type: "POST",
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (result) {
        console.log("Join course API has been called successfully", result);
        Swal.fire({
          icon: "success",
          title: `You have enrolled in the course or assignment successfully`,
          text: `Please sign in with the credentials to access the course and assignment`,
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
