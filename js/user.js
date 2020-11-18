window.addEventListener("DOMContentLoaded", (event) => {
  if (sessionStorage.getItem("token")) {

    var config = {
      method: "get",
      url: `https://login.simplebar.dk/api/me`,
      headers: { "Authorization": `Bearer ${sessionStorage.getItem('token')}` }
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response));
        document.getElementById("loader").style.display = "none";
        const name = response.data.name;
        const email = response.data.email;
        let name_block = document.getElementById("username");
        name_block.innerHTML = `Hi,&nbsp;<a href="#" title="${email}" style="text-decoration: none; color: deepskyblue;"> ${name}!</a>`;
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
  var config = {
    method: 'post',
    url: `https://login.simplebar.dk/api/logout`,
    headers: { "Authorization": `Bearer ${sessionStorage.getItem('token')}` }
  };
  
  axios(config)
  .then(function (response) {
    console.log("API RESPONSE: ", JSON.stringify(response.data));
    // const token = response.data.token;
    sessionStorage.removeItem("token");
    document.getElementById("loader").style.display = "none";
    window.location.replace("index.html");
  })
  .catch(function (error) {
    if (error.response) {
      document.getElementById("loader").style.display = "none";
      if(error.response.status == 401){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Sorry, logging out failed.',
          footer: 'Please try again'
        })
      }

    }
  });
};



