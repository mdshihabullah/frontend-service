window.addEventListener("DOMContentLoaded", (event) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const assign_id = urlParams.has("id") ? urlParams.get("id") : "";
  const solution_id = null;
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
                    <a class="get-solution" title="No solution uploaded" style="pointer-events: none;" data-toggle="tooltip"><i class="material-icons" style="color:red">&#xE85F;</i></a>
                </td>
            </tr>`;
          } else {
            tableBody.innerHTML += `<tr>
            <td>${solution.id}</td>
            <td style="display:none;">${
              solution.solution_id && solution.solution_id
            }</td>
            <td>${solution.name}</td>
            <td>${solution.email}</td>   
            <td>${solution.status}</td>           
            <td>
                <a class="get-solution" title="Get Solution" data-solutionId="${
                  solution.solution_id
                }" data-toggle="tooltip" download><i class="material-icons">&#xE861;</i></a>
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
  $(document).on("click", ".get-solution", function (e) {
    // var result = confirm(
    //   `Are you sure you want to download solution of ${$(this)
    //     .closest("tr")
    //     .find("td:eq(2)")
    //     .text()} ?`
    // );

    // if (result) {

    // }

    const solution_id = $(this).closest("tr").find("td:eq(1)").text();
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
      },
      error: function (result) {
        console.log("Result", result);
        if (result.status === 422) {
          Swal.fire({
            icon: "error",
            title: "Download Error!",
            text: `${result.responseJSON.message}`,
          });
        }
        if (result.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Solution downloaded!",
            text: `Please click 'OK' to see the solution in a new tab`,
          }).then(() => {
            var w = window.open("");
            w.document.write(`<p>${result.responseText}</p>`);
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
  });
});
