require(["scripts/shapes.js"], function (shapes) {
    var cnvs = document.getElementById("cnvs1"),
        ctx = cnvs.getContext("2d"),
        bigRect = shapes.makeRect(100, 100, cnvs.width - 200, cnvs.height - 200),
        lilRect = shapes.makeRect(0, 0, 10, 10);
        
    document.getElementById("cnvs1").onmousemove = function (event) {
        var x = 0, y = 0;
        event = event || window.event;
        event.target = event.target || event.srcElement;
        x = event.offsetX || event.layerX;
        y = event.offsetY || event.layerY;
        lilRect.center(lilRect.center().plus(shapes.makeVector(x, y).minus(lilRect.center()).divide(30)));
    };
        
    setInterval(function () {
        ctx.clearRect(0, 0, cnvs.width, cnvs.height);
        ctx.fillStyle = "rgba(0, 0, 0, .5)";
        bigRect.fill(ctx);
        lilRect.fill(ctx);
    }, 1);    
});