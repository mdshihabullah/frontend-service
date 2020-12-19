window.addEventListener("DOMContentLoaded", (event) => {
    if (sessionStorage.getItem("token")) {
        var config = {
            method: "get",
            url: `https://login.simplebar.dk/api/me`,
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        };
        axios(config)
            .then(function (response) {
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
                    window.location.replace("index.html");
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

function courses(){
    window.location.replace("admin-course.html");
}

let log_document = ["First day was awesome", "Second nothing happend", "Third day suspisios activies", "Fourth day lamp went missing","Fifth day our statue of John was smashed", "Sixth day no one is here anymore, logs will stop coming"]

function insertlogs(){
    let logs_container =  document.getElementById("logs");

    var config = {
        method: "get",
        url: `https://admin.simplebar.dk/api/logs`,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };
    axios(config)
        .then(function (response) {
            let table = document.getElementById("table").getElementsByTagName('tbody')[0];
            for (let i = 0; i < response.data["logs"].length; i++){
                let individual_log = response.data["logs"][i]
                let row = table.insertRow(0);
                let id = row.insertCell(0);
                let action = row.insertCell(1);
                let ip_address = row.insertCell(2);
                let log = row.insertCell(3);
                let created_at = row.insertCell(4);
                let updated_at = row.insertCell(5);
                let deleted_at = row.insertCell(6);
                id.innerHTML = individual_log["id"]
                action.innerHTML = individual_log["action"]
                ip_address.innerHTML = individual_log["ip_address"]
                log.innerHTML = JSON.stringify(individual_log["log"])
                created_at.innerHTML = individual_log["created_at"]
                updated_at.innerHTML = individual_log["updated_at"]
                deleted_at.innerHTML = individual_log["deleted_at"]


                if(i > 40){
                    break
                }
            }
            logs_container.innerHTML = stringcontent
            //let name_block = document.getElementById("username");
            //name_block.innerHTML = `Hi,&nbsp;<a href="#" title="${email}" style="text-decoration: none; color: deepskyblue;"> ${name}!</a>`;
            //TODO GET NAME OF COURSES FROM API

        })
        .catch(function (error) {
            console.log("failed to get logs")
        });

}



