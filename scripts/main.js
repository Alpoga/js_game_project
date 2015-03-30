require(["scripts/game.js", "scripts/shapes.js"], function (game, shapes) {
    var cnvs = document.getElementById("cnvs1"),
        ctx = cnvs.getContext("2d"),
        conSprite,
        imageMap = game.imageMap(),
        inputHandler = game.inputHandler(),
        map = game.makeMap("https://raw.githubusercontent.com/Alpoga/js_game_project/master/xml/maptest.tmx");
        
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    
    imageMap.set("sprite", "C:/users/alan/documents/webprogramming/resource/pics/sprite.png");
    inputHandler.bind(cnvs, "mousemove");
    inputHandler.bind(cnvs, "mousebutton");
    inputHandler.bind(document.querySelector("body"), "key");
    
    function checkMouseAbove(cursor) {
        var diff = cursor.minus(this.dRect().center());
        if (diff.y < 0 && Math.abs(diff.y) > Math.abs(diff.x)) {
            return true;
        }
        return false;
    }
    
    conSprite = game.makePlayer(game.makeControlledSprite(game.makeSprite("sprite", shapes.makeRect(0, 0, 32, 32), shapes.makeRect(100, 100, 50, 50), 3, 4, 75),[
        game.makeAnimMap("sprite", 0, 0, 3, "key", ["s", "down"]),
        game.makeAnimMap("sprite", 1, 0, 3, "key", ["a", "left"]),
        game.makeAnimMap("sprite", 2, 0, 3, "key", ["d", "right"]),
        game.makeAnimMap("sprite", 3, 0, 3, "key", ["w", "up"])
    ]), 1.4);
    
    setInterval(function () {
        ctx.clearRect(0, 0, cnvs.width, cnvs.height);
        map.update();
        map.draw(ctx);
        conSprite.update();
        conSprite.draw(ctx);
    }, 1);
});