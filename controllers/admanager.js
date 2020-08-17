module.exports.adManager = function (req, res, next) {
  if (req.isAuthenticated()) {
    var arrAd = [
      new getImage("dingtea.png", "https://dantri.com.vn/"),
      new getImage("toco.jpg", "https://vnexpress.net/"),
    ];

    return res.render("admin", { arrAd });
  } else {
    return res.render("login");
  }
};

module.exports.client = function (req, res, next) {
  return res.render("web");
};

module.exports.changeAd = function (socket, io) {
  socket.on("admin-send-data", function (data) {
    io.sockets.emit("server-send-data", data);
  });
};

function getImage(hinh, link) {
  this.hinh = hinh;
  this.link = link;
}

module.exports.login = function (req, res, next) {
  return res.render("login");
};
