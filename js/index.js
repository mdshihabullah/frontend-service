const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const signup = (event) => {
  event.preventDefault();
  const full_name = document.getElementById("sign-up-fullname").value;
  const email = document.getElementById("sign-up-email").value;
  const password = document.getElementById("sign-up-password").value;
  const confirm_password = document.getElementById("sign-up-confirm-password").value;
  document.getElementById("loader").style.display = "inline-block";
  if (cleaninput(full_name, email, password, confirm_password) === 1){
    return
  }
  var config = {
    method: 'post',
    url: `https://login.simplebar.dk/api/register?name=${full_name}&email=${email}&password=${password}&password_confirmation=${confirm_password}`
  };
  
  axios(config)
  .then(function (response) {
    console.log("API RESPONSE: ", JSON.stringify(response.data));
    const token = response.data;
    document.getElementById("loader").style.display = "none";
  })
  .catch(function (error) {
    if (error.response) {
      document.getElementById("loader").style.display = "none";
      if(error.response.status == 422){
        Swal.fire({
          icon: 'error',
          title: 'Sorry',
          text: 'The email is either taken or unavailable',
          footer: 'Use different email address'
        })
      }

    }
  });
};


const login = (event) => {
  event.preventDefault();  
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  document.getElementById("loader").style.display = "inline-block";
  var config = {
    method: 'post',
    url: `https://login.simplebar.dk/api/login?email=${email}&password=${password}`
  };
  
  axios(config)
  .then(function (response) {
    console.log("API RESPONSE: ", JSON.stringify(response.data));
    const token = response.data.token;
    sessionStorage.setItem('token', token);
    document.getElementById("loader").style.display = "none";
    window.location.replace('user.html');
  })
  .catch(function (error) {
    if (error.response) {
      document.getElementById("loader").style.display = "none";
      if(error.response.status == 401){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Credentials are either invalid or mismatched.',
          footer: 'Please try again'
        })
      }

    }
  });
};


function cleaninput(full_name ,email,password, confirm_password){
  if ( full_name.match(/[1-9]/g)){
    Swal.fire({
      icon: 'error',
      title: 'Sorry',
      text: 'You can not have numbers in your name',

    })
    return 1
  }
  if(password !== confirm_password){
    console.log("fail")
    Swal.fire({
      icon: 'error',
      title: 'Sorry',
      text: 'Password does not match'
    })
    return 1

  }
  if(password.length < 5){
    Swal.fire({
      icon: 'error',
      title: 'Sorry',
      text: 'Password must be at least have 5 characters long '
    })
    return 1
  }
  return 0

}