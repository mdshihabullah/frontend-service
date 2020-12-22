$(document).ready(function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const assign_id = urlParams.has("id") ? urlParams.get("id") : "";
  $.ajax(
    {
      url: `https://course.simplebar.dk/api/assignment/${assign_id}`,
      type: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },

      success: function (result) {
        console.log(
          "User of this assignment are: \n",
          result["List of participants"]
        );
        const participants = result["List of participants"];
        let tableBody = document.getElementById("table-body-block");
        participants.forEach((user) => {
          tableBody.innerHTML += `<tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>             
                <td>
                    <a class="delete" id="${user.id}" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                </td>
            </tr>`;
        });
      },
      error: function (result) {
        console.log("Result", result);
      },
    },
    "json"
  );

  $('[data-toggle="tooltip"]').tooltip();
  // Delete row on delete button click
  $(document).on("click", '.delete', function () {
    var result = confirm(`Are you sure you want to delete user named: ${$(this).closest('tr').find('td:eq(1)').text()} ?`);

    if (result) {
      const user_id = document.querySelector('.delete').id;
      console.log("User_id", user_id)
      $.ajax({
          url:`https://course.simplebar.dk/api/assignment/${assign_id}/student/${user_id}`,
          type: 'DELETE',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
     //<-----this should be an object.
          contentType:'application/json',  // <---add this
          dataType: 'json',                // <---update this
          success: function (result) {
            console.log("SUCESS OF DELETE ASSIGNMENT API \n");
            console.log(result);
            course_details = result;
            Swal.fire({
              icon: "success",
              title: "Done",
              text: `User  ${user_id} has been deleted successfully!`,
              footer: "Click OK to go back to dashboard",
            }).then(() => {
              $(this).parents("tr").remove();
              $(".add-new").removeAttr("disabled");
            });
          },
          error: function (result) {
            console.log("FAILED DELETE ASSIGNMENT API CALL", result);
            Swal.fire({
              icon: "error",
              title: "Unable to delete the user",
              text: `${result.responseJSON.message}`
            })
          }
      });

    }

  });
});
