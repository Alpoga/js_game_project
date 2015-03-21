require(["scripts/game.js", "scripts/shapes.js"], function (game, shapes) {
    var cnvs = document.getElementById("cnvs1"),
        ctx = cnvs.getContext("2d"),
        imageMap = game.imageMap,
        map = game.makeMap("https://raw.githubusercontent.com/Alpoga/js_game_project/master/xml/maptest.tmx", shapes.makeRect(0, 0, cnvs.width, cnvs.height)),
        cursorVec = shapes.makeVector(0, 0),
        center = shapes.makeVector(cnvs.width / 2, cnvs.height / 2),
        grid = shapes.makeGrid(2, 2);
    
    grid.forEach(function (ele, vec) {
        this.set(vec, shapes.makeRect(vec.x * cnvs.width / 2, vec.y * cnvs.height / 2, cnvs.width / 2, cnvs.height / 2));
    }, grid);
        
    cnvs.onmousemove = function (event) {
        event = event || window.event;
        event.target = event.target || event.srcElement;
        event.offsetX = event.offsetX || event.layerX;
        event.offsetY = event.offsetY || event.layerY;
        cursorVec.equals(shapes.makeVector(event.offsetX, event.offsetY));
    }
        
    setInterval(function () {
        ctx.clearRect(0, 0, cnvs.width, cnvs.height);
        map.position(cursorVec);
        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        map.draw(ctx);
        ctx.strokeStyle = "rgba(0, 255, 0, 1)";
        grid.forEach(function (ele) {
            ele.stroke(ctx);
        })
        ctx.fillText("Pos: " + map.destRect.topLeft().toString(), cursorVec.x, cursorVec.y);
    }, 1);
});