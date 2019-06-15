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
      success: data => {
        console.log("success");
      },
      error: e => console.log("error", e)
    });
  };

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
              <p>${data[i].description}</p>
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

  let getMyCommodities = () => {
    $.ajax({
      type: "GET",
      url: `${url}/loggedInUser`,
      contentType: "application/json",
      success: data => {
        let {mail} = data[0];

        // get loggedin user commodities
        $.ajax({
          type: "GET",
          url: `${url}/users?email=${mail}`,
          contentType: "application/json",
          success: data => {
            let {commodities} = data[0];
            let c = ''
            for (let i = 0; i < commodities.length; i++) {
              c += `<p>${commodities[i].name}</p>`
            }
            $('#myCommodities').append(c);
          },
          error: e => console.log('error', e)
        })
      },
      error: e => console.log("error", e)
    });
  };

  // submit to post commodities
  $("#submit").on("click", () => {
    let nm = $("#name").val();
    let txt = $("#ta").val();

    if (!nm || !txt) return;

    let data = {
      name: nm,
      imageUrl: "",
      description: txt
    };

    $.ajax({
      type: "post",
      data: JSON.stringify(data),
      url: `${url}/commodities`,
      dataType: "json",
      contentType: "application/json",
      success: data => {
        console.log("record created", data);
        $("#closeModal").click();
        getCommodities();
      },
      error: e => console.log("error", e)
    });
  });

  getCommodities();
  getCategoriesDropdown();
  getMyCommodities();
}); //end query
