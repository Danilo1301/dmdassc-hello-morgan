console.log("Game.js")

var ONLINE_SERVER;

Game = class {
  static app;
  static resources = {};
  static loaded = false;

  static start()
  {
    PIXI.utils.skipHello();

    this.app = new PIXI.Application({width: 1024, height: 768, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1})
    this.app.start();

    document.body.appendChild(this.app.view);

    MainLoad.start();

    this.app.ticker.add(this.tick, this);
  }

  static tick(delta)
  {
    Utils.scaleToWindow(this.app.renderer.view);

    if(!this.loaded) { return; }

    Scenes.tick(delta);
  }

  static onLoaded()
  {
    this.loaded = true;
    Scenes.setActiveScene(SceneMain);

    //ONLINE_SERVER = Game.createServer();
    //ONLINE_SERVER.createGameObject(10, 10);
    //ONLINE_SERVER.createGameObject(10, 50);

    this.setMaxFPS(80);
  }

  static setMaxFPS(fps) { this.app.ticker.maxFPS = fps; }

  static getBaseResolution()
  {
    var renderer = this.app.renderer;
    return {width: renderer.width, height: renderer.height}
  }

  static createServer()
  {
    var server = new Server();

    return server;
  }
}

class MainLoad {
  static assets = {
    scripts: ["Scenes", "GameObject"],
    scenes: ["SceneMain"],
    images: {
      "block": "block.png"
    }
  }

  static start()
  {
    const loader = new PIXI.Loader();

    for (var script of this.assets.scripts) { loader.add("SCRIPT." + script, "game/" + script + ".js"); }

    for (var scene of this.assets.scenes) { loader.add("SCENE." + scene, "game/scenes/" + scene + ".js"); }

    for (var image in this.assets.images) { loader.add(image, "images/" + this.assets.images[image]); }

    var baseResolution = Game.getBaseResolution();

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x000000);
    this.graphics.drawRect(0, 0, baseResolution.width, baseResolution.height);
    this.graphics.beginFill(0x191919);
    this.graphics.drawRect(10, baseResolution.height-40, baseResolution.width-20, 30);
    this.graphics.endFill();
    Game.app.stage.addChild(this.graphics);

    this.progressBar = new PIXI.Graphics();
    this.progressBar.position.x = 10;
    this.progressBar.position.y = baseResolution.height-40;
    this.progressBar.beginFill(0xFF7800);
    this.progressBar.drawRect(0, 0, baseResolution.width-20, 30);
    Game.app.stage.addChild(this.progressBar);

    this.infoText = new PIXI.Text("Loading...");
    this.infoText.x = 10;
    this.infoText.y = baseResolution.height-65;
    this.infoText.style.fill = "white";
    this.infoText.style.fontSize = 18
    Game.app.stage.addChild(this.infoText);

    loader.onProgress.add(this.onProgress.bind(this));
    loader.load(this.onFinish.bind(this));
  }

  static destroy()
  {
    this.graphics.destroy();
    this.progressBar.destroy();
    this.infoText.destroy();
  }

  static onProgress(progress, resource)
  {
    this.infoText.text = `Loading... ( ${resource.name} )`;
    this.progressBar.scale.x = progress.progress;
  }

  static onFinish(loader, resources)
  {
    var loadScripts = [];

    for (var script of this.assets.scripts) { loadScripts.push(resources["SCRIPT." + script]); }

    for (var scene of this.assets.scenes) { loadScripts.push(resources["SCENE." + scene]); }

    for (var s of loadScripts)
    {
      var elm = document.createElement("script");
      elm.textContent = s.data;
      document.body.append(elm);
      elm.remove()
    }

    this.destroy();
    Game.app.ticker.remove(this.loop, this);
    Game.resources = resources;
    Game.onLoaded();
  }
}
