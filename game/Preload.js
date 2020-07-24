class Preload {
  static start() {
    var files = ["Game", "Utils"];
    var promises = [];

    for (var file of files) { promises.push(this.loadFile(file)); }

    Promise.all(promises).then(() => { Game.start(); })
  }

  static loadFile(file) {
    return new Promise(function(resolve) { $.getScript("/game/" + file + ".js", ()=> { resolve(); }); });
  }
}

Preload.start();
