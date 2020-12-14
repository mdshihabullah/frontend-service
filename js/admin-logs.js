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
                if (role !== "admin"){
                    window.location.replace("index.html")
                }
                insertlogs()
                //let name_block = document.getElementById("username");
                //name_block.innerHTML = `Hi,&nbsp;<a href="#" title="${email}" style="text-decoration: none; color: deepskyblue;"> ${name}!</a>`;
                //TODO GET NAME OF COURSES FROM API

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

function database(){
    window.location.replace("admin-dashboard.html");
}

let log_document = ["First day was awesome", "Second nothing happend", "Third day suspisios activies", "Fourth day lamp went missing","Fifth day our statue of John was smashed", "Sixth day no one is here anymore, logs will stop coming"]

function insertlogs(){
    let logs_container =  document.getElementById("logs");
    for (let i = 0; i < log_document.length; i++){
        logs_container.innerHTML = logs_container.innerHTML + "<p>" + log_document[i] + "</p>"
    }

}

