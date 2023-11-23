<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/liabru/matter-attractors@gh-pages/build/matter-attractors.js"></script>

<script>
  Matter.use('matter-attractors');
  var radius = 20;
  var mouseConstraint;

  document.addEventListener('DOMContentLoaded', function () {
    try {
        initSimulation();
    } catch (error) {
        console.error('Error in initSimulation:', error);
    }
});



  function isMobile() {
    return window.innerWidth <= 768;
  }

  function initSimulation() {
    var Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Events = Matter.Events;

    var engine = Engine.create();
    var world = engine.world;

    var containerElement = document.querySelector(".tag-canvas");
    var containerWidth = containerElement.clientWidth;
    var containerHeight = containerElement.clientHeight;

    var render = Render.create({
      element: containerElement,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        background: "transparent",
        wireframes: false
      }
    });

    // Створення об'єкта для миші
    var mouse = Matter.Mouse.create(render.canvas);
    mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 1.2,
      },
    });

    // Додавання миші на сцену
    World.add(world, mouseConstraint);

    // Додавання можливості перетягування об'єкта
    Events.on(engine, 'beforeUpdate', function () {
      if (mouseConstraint.mouse.button === -1) {
        // Перевірка, чи об'єкт було клацнуто
        if (mouseConstraint.body) {
          mouseConstraint.body = null;
        }
      }
    });

		var topWall = Bodies.rectangle(containerWidth / 2, -200, containerWidth + 20, 20, { isStatic: true });

   // Ліва стінка
    var leftWall = Bodies.rectangle(-10, containerHeight / 2, 20, 2000, { isStatic: true });
    // Права стінка
    var rightWall = Bodies.rectangle(containerWidth + 10, containerHeight / 2, 20, 2000, { isStatic: true });

  var ground = Bodies.rectangle(
    containerWidth / 2,
    containerHeight + 10,
    containerWidth + 40,
    20,
    { isStatic: true }
  );

  World.add(engine.world, [topWall, leftWall, rightWall, ground]);






    var objects = [
      {
        x: containerWidth / 2 + 150,
        y: -120,
        width: 270,
        height: 85,
        spriteUrl: "bubble.png"
      },
      {
        x: containerWidth / 2 + 144,
        y: -115,
        width: 222,
        height: 85,
        spriteUrl: "weweb.png"
      },
      {
        x: containerWidth / 2 + 100,
        y: -115,
        width: 263,
        height: 85,
        spriteUrl: "stripe.png"
      },
      {
        x: containerWidth / 2 - 125,
        y: -100,
        width: 263,
        height: 85,
        spriteUrl: "hazura.png"
      },
      {
        x: containerWidth / 2 - 174,
        y: -100,
        width: 267,
        height: 85,
        spriteUrl: "make.png"
      },
      {
        x: containerWidth / 2 + 174,
        y: -100,
        width: 265,
        height: 85,
        spriteUrl: "https://uploads-ssl.webflow.com/6511cf051ed1d8237a2b8095/651aacbf117ec7fce4b69646_4444444.svg"
      },
      {
        x: containerWidth / 2 - 100,
        y: -100,
        width: 265,
        height: 85,
        spriteUrl: "codezoid.png"
      },
      {
        x: containerWidth / 2 - 104,
        y: -100,
        width: 275,
        height: 85,
        spriteUrl: "xano.png"
      },
      {
        x: containerWidth / 2 - 135,
        y: -100,
        width: 275,
        height: 85,
        spriteUrl: "airtable.png"
      },
      {
        x: containerWidth / 2 + 140,
        y: -100,
        width: 275,
        height: 85,
        spriteUrl: "https://uploads-ssl.webflow.com/6511cf051ed1d8237a2b8095/651aacc698eca9a6ff9067d7_7777777.svg"
      }
    ];

    // Застосування змін розміру для мобільних пристроїв
    if (isMobile()) {
      for (var i = 0; i < objects.length; i++) {
        objects[i].width *= 0.45;
        objects[i].height *= 0.45;
      }
    }

    var delayBetweenObjects = 200; // 0.2 секунди

    function addNextObject() {
      if (objects.length > 0) {
        var objectData = objects.shift();
        var obj = Bodies.rectangle(objectData.x, objectData.y, objectData.width, objectData.height, {
          chamfer: { radius: radius },
          render: {
            sprite: {
              texture: objectData.spriteUrl,
              xScale: isMobile() ? 0.45 : 1,
              yScale: isMobile() ? 0.45 : 1
            }
          },
          restitution: 0.1,
          density: 0.005,
          frictionAir: 0,
          friction: 0.1, // Коефіцієнт тертя (додайте його, якщо потрібно менше ковзання)
          maxSpeed: 5,
          collisionFilter: {
            category: 0x0001, // Бітова маска категорії об'єкта
            mask: 0x0001 // Бітова маска, представляє з якими категоріями об'єкт взаємодіє
          }
        });

        // Обмеження максимальної швидкості
        Events.on(engine, 'beforeUpdate', function () {
          if (obj.velocity.x > obj.maxSpeed) {
            Matter.Body.setVelocity(obj, { x: obj.maxSpeed, y: obj.velocity.y });
          }
          if (obj.velocity.x < -obj.maxSpeed) {
            Matter.Body.setVelocity(obj, { x: -obj.maxSpeed, y: obj.velocity.y });
          }
          if (obj.velocity.y > obj.maxSpeed) {
            Matter.Body.setVelocity(obj, { x: obj.velocity.x, y: obj.maxSpeed });
          }
          if (obj.velocity.y < -obj.maxSpeed) {
            Matter.Body.setVelocity(obj, { x: obj.velocity.x, y: -obj.maxSpeed });
          }
        });

        World.add(engine.world, [obj]);

        // Перехід до наступного об'єкта через затримку
        setTimeout(addNextObject, delayBetweenObjects);
      }
    }

    // Початок додавання об'єктів із затримкою
    var delayBeforeStart = 1000; // 0.5 секунды задержки перед стартом

    // Початок додавання об'єктів із затримкою
    setTimeout(function() {
      addNextObject();
    }, delayBeforeStart);

    // Видалення обробників подій колеса миші
    mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);

    Engine.run(engine);
    Render.run(render);
  }
  const loadImage = (url, onSuccess, onError) => {
    const img = new Image();
    img.onload = () => {
      onSuccess(img.src);
    };
    img.onerror = onError();
    img.src = url;
  };

  Matter.use('matter-attractors');
</script>

