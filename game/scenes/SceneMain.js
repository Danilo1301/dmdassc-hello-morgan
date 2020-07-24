class SceneMain {
  static stage = new PIXI.Container();

  static currentRenderingServer;

  static renderingObjects = [];

  static setup()
  {
    this.server = Game.createServer();

    this.server.createGameObject(100, 100);
    this.server.createGameObject(150, 300);

    this.setCurrentRenderingServer(this.server);

    function onMouseMove(e) {

      //console.log(e.data.getLocalPosition(this))
    }

    this.stage.interactive = true;
    this.stage.on('mousemove', onMouseMove);
  }

  static setCurrentRenderingServer(server)
  {
    while(this.stage.children[0]) {
        //this.stage.removeChild(this.stage.children[0]);
    }

    this.currentRenderingServer = server;
  }

  static tick(delta) {

    this.server.tick(delta);

    this.renderServer(this.currentRenderingServer);
  }

  static destroy()
  {
    for (var obj of this.stage.children) {
      obj.destroy();
    }
  }

  static renderServer(server)
  {
    for (var object of server.objects) {
      if(!this.stage.children.includes(object.sprite)) {
        this.stage.addChild(object.sprite);
        this.renderingObjects.push(object);
      }

      object.draw();
    }

    for (var object of this.renderingObjects) {
      if(!server.objects.includes(object)) {
        this.stage.removeChild(object.sprite);
      }
    }

  }
}
