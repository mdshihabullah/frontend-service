window.addEventListener("DOMContentLoaded", (event) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const course_id = urlParams.has("id") ? urlParams.get("id") : "";
  $.ajax(
    {
      url: `https://course.simplebar.dk/api/course/${course_id}`,
      type: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },

      success: function (result) {
        console.log(
          "Users of this Course are: \n",
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
                    <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                </td>
            </tr>`;
        });
      },
      error: function (result) {
        console.log("Result", result);
          Swal.fire({
            icon: "error",
            title: "Unable to delete the user",
            text: `${result.responseJSON.message}`
          });      
      },
    },
    "json"
  );

  $('[data-toggle="tooltip"]').tooltip();
  // Delete row on delete button click
  $(document).on("click", ".delete", function () {
    var result = confirm(`Are you sure you want to delete user named: ${$(this).closest('tr').find('td:eq(1)').text()} ?`);

    if (result) {
      const user_id =$(this).closest('tr').find('td:eq(0)').text();
    console.log("User_id to delete from course",user_id )
    
    $.ajax({
        url: `https://course.simplebar.dk/api/course/${course_id}/student/${user_id}`,
        type: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
   //<-----this should be an object.
        contentType:'application/json',  // <---add this
        dataType: 'json',                // <---update this
        success: function (result) {
          console.log("SUCESS OF DELETE Course API \n");
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
            window.location.reload(true);

          });

        },
        error: function (result) {
          console.log("Result", result);
          if (result.status === 422) {
            Swal.fire({
              icon: "error",
              title: "Unable to delete the user",
              text: `${result.responseJSON.message}`
            });
          }
          else{
            Swal.fire({
              icon: "error",
              title: "Unable to delete the user",
              text: `${result.responseJSON.message}`
            });
          }
        }
    });      
    }

  });
});
