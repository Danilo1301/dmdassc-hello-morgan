class Scenes {
  static activeScene = null;

  static setActiveScene(scene)
  {
    if(this.activeScene) { this.activeScene.destroy(); }
    this.activeScene = scene;
    this.activeScene.setup();
    Game.app.stage = this.activeScene.stage;
  }

  static tick(delta)
  {
    if(!this.activeScene) { return; }

    this.activeScene.tick(delta);
  }
}
