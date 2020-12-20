window.addEventListener("DOMContentLoaded", (event) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const assign_id = urlParams.has("id") ? urlParams.get("id") : "";

  const fetch_all_solutions_end_point =
    "https://course.simplebar.dk/api/fetch_bulk";
  $.ajax(
    {
      url: fetch_all_solutions_end_point,
      type: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      data: {
        assignment_id: assign_id,
      },

      success: function (result) {
        console.log("solutions of this courses are: \n", result.list);
        const solution_list = result.list;
        let tableBody = document.getElementById("table-body-block");
        solution_list.forEach((solution) => {
          if (solution.status == "no solution") {
            tableBody.innerHTML += `<tr>
                <td>${solution.id}</td>
                <td>${solution.name}</td>
                <td>${solution.email}</td>   
                <td>${solution.status}</td>           
                <td>
                    <a class="get-solution" title="Get Solution" data-toggle="tooltip"><i class="material-icons" style="color:red">&#xE85F;</i></a>
                </td>
            </tr>`;
          } else {
            tableBody.innerHTML += `<tr>
            <td>${solution.id}</td>
            <td>${solution.name}</td>
            <td>${solution.email}</td>   
            <td>${solution.status}</td>           
            <td>
                <a class="get-solution" title="Get Solution" data-toggle="tooltip"><i class="material-icons">&#xE861;</i></a>
            </td>
        </tr>`;
          }
        });
      },
      error: function (result) {
        console.log("Result", result);
        Swal.fire({
          icon: "error",
          title: "Unable to get solution for the assignment",
          text: `${result.message}`,
        });
      },
    },
    "json"
  );

  $('[data-toggle="tooltip"]').tooltip();
  // get-solution row on get-solution button click
  $(document).on("click", ".get-solution", function () {
    var result = confirm(
      `Are you sure you want to get-solution solution named: ${$(this)
        .closest("tr")
        .find("td:eq(1)")
        .text()} ?`
    );

    if (result) {
      const solution_id = $(this).closest("tr").find("td:eq(0)").text();
      console.log("solution_id", solution_id);

      $.ajax({
        url: `https://upload.simplebar.dk/api/solution`,
        type: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        data: {
          solution_id: solution_id,
        },
        //<-----this should be an object.
        contentType: "application/json", // <---add this
        dataType: "json", // <---update this
        success: function (result) {
          console.log("SUCESS OF get-solution Course API \n");
          console.log(result);

          // ***********TODO**********

          // course_details = result;
          // Swal.fire({
          //   icon: "success",
          //   title: "Done",
          //   text: `solution  ${solution_id} has been get-solutiond successfully!`,
          //   footer: "Click OK to go back to dashboard",
          // }).then(() => {
          //   $(this).parents("tr").remove();
          //   $(".add-new").removeAttr("disabled");
          //   window.location.reload(true);

          // });
        },
        error: function (result) {
          console.log("Result", result);
          if (result.status === 422) {
            Swal.fire({
              icon: "error",
              title: "Download Error!",
              text: `${result.responseJSON.message}`,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Download Error!",
              text: `${result.responseJSON.message}`,
            });
          }
        },
      });
    }
  });
});
