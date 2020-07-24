class Events {
  constructor() {
    this.all = [];
  }

  trigger(id, data) {
    this.all.push({id: id, data: data})
  }
}

class DataHistory {
  constructor()
  {
    this.frameIndex = [0, 0];
    this.frames = [];
    this.timeArray = [];
  }

  getObjectData(object)
  {
    var data = {};

    for (var key in object.data) {
      data[key] = {};

      for (var k in object[key]) {
        data[key][k] = object[key][k];
      }
    }

    return data;
  }

  restoreObjectData(object, data)
  {
    for (var key in data) {
      for (var k in data[key]) {
        object[key][k] = data[key][k];
      }
    }
  }

  addFrame(frame)
  {
    this.frames.push(frame);
    this.frameIndex[1]++;

    this.timeArray.push(frame.time);

    for (var t of this.timeArray) {
      if(Date.now() - t > 5000) {
        this.frames.splice(this.timeArray.indexOf(t), 1);
        this.timeArray.splice(this.timeArray.indexOf(t), 1);
        this.frameIndex[0]++;
      }
    }

  }
}

class Server {
  constructor()
  {
    console.warn("Object instead of Array (objects)");
    this.objects = [];
    this.dataHistory = new DataHistory();
    this.currentTick = 0;

    this.pauseTick = false;

    this.playBack = {
      running: false,
      from: 0,
      to: 40,
      current: 0
    };

    this.events = new Events();
  }

  restoreFrame(frameTick)
  {
    if(frameTick == -1) {
      frameTick++;

      this.saveFrame();
    }

    var frame = this.dataHistory.frames[ frameTick - this.dataHistory.frameIndex[0] ];

    for (var object of this.objects) {

      if(!frame.objects[object.id]) {
        this.destroyGameObject(object);
      }

      this.dataHistory.restoreObjectData(object, frame.objects[object.id]);
    }

    this.events.all = frame.events;

    return frame;
  }

  saveFrame()
  {
    var frame = {
      tick: this.currentTick,
      time: Date.now(),
      delta: this.currentDelta,
      objects: {},
      events: Object.assign([], this.events.all)
    }


    for (var object of this.objects) {
      frame.objects[object.id] = this.dataHistory.getObjectData(object);
    }

    this.dataHistory.addFrame(frame);

    this.currentTick++;
  }

  tick(delta)
  {
    this.currentDelta = delta;

    if(!this.pauseTick) {
      this.restoreFrame(this.currentTick-1);

      if(this.currentTick == 100) {
        this.events.trigger("CREATE_GAME_OBJECT", {x: 400, y: 300});
        this.events.trigger("CREATE_GAME_OBJECT", {x: 10, y: 10});
      }

      this.update(delta);
      this.saveFrame();

    }


    if(this.currentTick > 200) {
      this.pauseTick = true;

      if(!this.playBack.running) {
        this.playBack.running = true;
        this.playBack.to = this.currentTick-1;
      }

      if(this.playBack.running) {
        var frame = this.restoreFrame(this.playBack.current);



        this.update(frame.delta);
        //this.update(frame.delta);
        this.playBack.current++;
        if(this.playBack.current > this.playBack.to) {
          this.playBack.current = this.playBack.from
        }
      }
    }

    //this.restoreFrame();
    //this.update(delta);
    //this.dataHistory.saveCurrentFrame();
  }

  update(delta)
  {
    for (var e of this.events.all) {
      if(e.id == "CREATE_GAME_OBJECT") {
        this.createGameObject(e.data.x, e.data.y);
      }
    }


    for (var object of this.objects) {
      object.update(delta);
    }

    this.events.all = [];

  }

  createGameObject(x, y)
  {
    var object = new GameObject();
    object.position.x = x;
    object.position.y = y;
    this.objects.push(object);
    object.id = this.objects.indexOf(object);
    return object;
  }

  destroyGameObject(object) {
    this.objects.splice(this.objects.indexOf(object), 1);
  }
}

class GameObject {
  constructor()
  {
    this.data = {position: {test: 123}, velocity: {}};

    this.sprite = new PIXI.Graphics();
    this.sprite.beginFill(0xDE3249);
    this.sprite.drawRect(0, 0, 50, 50);
    this.sprite.beginFill(0xFFFFFF);
    this.sprite.drawRect(5, 5, 40, 40);
    this.sprite.endFill();

    this.position = {x: 0, y: 0};
    this.velocity = {x: Math.random()*10, y: Math.random()*10};

    //Scenes.activeScene.stage.addChild(this.sprite);
  }

  update(delta)
  {

    if(this.position.x > 800) {
      this.position.x = 0;
    }
    this.position.x += this.velocity.x * 2 * delta;
    this.position.y += this.velocity.y * 2 * delta;

    this.velocity.x -= 0.2 * delta;
    this.velocity.y -= 0.2 * delta;

    if(this.velocity.x < 0) { this.velocity.x = 0; }
    if(this.velocity.y < 0) { this.velocity.y = 0; }
  }

  draw()
  {
    if(this.blocked) {
      this.sprite.position.x = 0;
      this.sprite.position.y = 0;
      return
    }

    this.sprite.position.x = this.position.x;
    this.sprite.position.y = this.position.y;
  }


}
