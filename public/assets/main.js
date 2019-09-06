$(function() {
  const url = "http://localhost:3000";

  // handle login
  var userEmail = "";
  var pwd = "";

  $("#loginBtn").on("click", () => {
    let inputMail = $("#usermail").val();
    let inputPwd = $("#pwd").val();

    userEmail = inputMail;
    pwd = inputPwd;

    $.ajax({
      type: "GET",
      url: `${url}/users?email=${userEmail}&password=${pwd}`,
      contentType: "application/json",
      success: data => {
        if (data[0].length === 0) return;
        window.location = "http://localhost:3000/home.html";
        postUser();
      },
      error: e => console.log("error", e)
    });
  });

  // post loggedin user
  let postUser = () => {
    let user = { mail: userEmail };

    $.ajax({
      type: "POST",
      url: `${url}/loggedInUser`,
      data: JSON.stringify(user),
      dataType: "json",
      contentType: "application/json",
      success: data => {},
      error: e => console.log("error", e)
    });
  };

  // get categories to the dropdown
  let getCategoriesDropdown = () => {
    let options = "<option disabled selected>Categories</option>";
    $.ajax({
      type: "get",
      url: `${url}/categories`,
      dataType: "json",
      success: data => {
        for (var i = 0; i < data.length; i++) {
          options += `<option key='${data[i].id}'>${data[i].name}</option>`;
        }
        $("#categories").html(options);
        $("#categoriesOnAdd").append(options);
      },
      error: e => console.log("error", e)
    });
  };

  // get featured commodities
  let getCommodities = () => {
    $.ajax({
      type: "GET",
      url: `${url}/commodities`,
      dataType: "json",
      success: data => {
        let newData = "";
        for (let i = 0; i < data.length; i++) {
          newData += `<div class="col-md-3">
            <div class="card m-3">
              <img src="${data[i].imageUrl}" alt="image" />
              <hr />
              <h4>${data[i].name}</h4>
              <div class="details">${data[i].description}</div>
              <div class="m-3 shadow-lg">
                <button class="btn btn-light" id='xbtn'>Contact</button>
              </div>
            </div>
          </div>`;
        }
        $("#commodity-row").append(newData);
      },
      error: e => console.log("error", e)
    });
  };

  // get my commodities
  let getMyCommodities = () => {
    $.ajax({
      type: "GET",
      url: `${url}/loggedInUser`,
      contentType: "application/json",
      success: data => {
        let { mail } = data[0];

        // get loggedin user commodities
        $.ajax({
          type: "GET",
          url: `${url}/users?email=${mail}`,
          contentType: "application/json",
          success: data => {
            $("#currentUser").html(data[0].firstName);
            let { commodities } = data[0];
            let c = "";
            for (let i = 0; i < commodities.length; i++) {
              c += `<div class="col-md-3">
              <div class="card m-3 p-1">
                <img src="${commodities[i].imageUrl}" alt="image" />
                <h3>${commodities[i].name}</h3>
                <hr/>
                <div class="details">${commodities[i].description}</div>
                <div class="m-3 shadow-lg">
                  <button class="btn btn-danger" id='xbtn'>delete</button>
                </div>
              </div>
            </div>`;
            }
            $("#myCommodities").append(c);
          },
          error: e => console.log("error", e)
        });
      },
      error: e => console.log("error", e)
    });
  };

  // user add a commodity
  $("#submit").on("click", () => {
    let cat = $("#categoriesOnAdd").val();
    let name = $("#name").val();
    let desc = $("#desc").val();

    let newCommodity = {
      name: name,
      description: desc,
      category: cat
    };

    // first get loggedin user
    $.ajax({
      type: "GET",
      url: `${url}/loggedInUser`,
      contentType: "application/json",
      success: data => {
        let { mail } = data[0];

        // then patch loggedin user commodities on success
        $.ajax({
          type: "PATCH",
          url: `${url}/users?email=${mail}`,
          contentType: "application/json",
          data: JSON.stringify(newCommodity),
          success: data => {
            console.log('posting...', data)
          },
          error: e => console.log("error", e)
        });
      },
      error: e => console.log("error", e)
    });
  });

  getCommodities();
  getCategoriesDropdown();
  getMyCommodities();
}); //end query
