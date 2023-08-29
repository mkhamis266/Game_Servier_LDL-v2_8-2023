let apiUrl = "https://gameservierldl8-2023-default-rtdb.europe-west1.firebasedatabase.app/players.json";

$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

// const fullNameRegex = /(^\w{2,16})([ ])(\w{2,16})?([ ]{0,1})?([A-Za-z]{2,16})?([ ]{0,1})?([A-Za-z]{2,16})/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function registerPlayer() {
  // if (!fullNameRegex.test($("#inputFullName").val().trimStart())) {
  //   swal.fire("Full Name Error!", "Full name should be 2 name at least and separated by space", "error");
  //   return;
  // } else 
  if (!emailRegex.test($("#inputEmail").val().trimStart())) {
    swal.fire("Email Error!", "email should be xxx@xxx.xxx", "error");
    return;
  } else {
    const player = {
      name: $("#inputFullName").val().trimStart(),
      email: $("#inputEmail").val().trimStart(),
      score: 0,
    };
    $("#inputFullName").val("");
    $("#inputEmail").val("");
    return player;
  }
}

function saveToFirebase(player) {
  $.ajax({
    type: "POST",
    url: apiUrl,
    data: JSON.stringify(player),
    success: function () {
      $(".reset").css({
        zIndex: 10,
      });
    },
  });
}

async function loadFromFirebase() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

function deletePlayer(playerId) {
  url = apiUrl.replace(".json", `/${playerId}.json`);
  $.ajax({
    type: "DELETE",
    url: url,
    success: function () {
      $("tr#" + playerId).remove();
    },
  });
}
