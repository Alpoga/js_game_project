define((function (exported) {
    "use strict";
    var operate = (function () {
            var operations = ["=", "+", "-", "*", "/", "%", "^", "==", "<=", ">=", "<", ">"];
            return function (prop, op, val) {
                if (this.hasOwnProperty(prop) && operations.indexOf(op) !== -1 && typeof val === "number") {
                    switch (op) {
                    case "=":
                        this[prop] = val;
                        break;
                    case "+":
                        this[prop] += val;
                        break;
                    case "-":
                        this[prop] -= val;
                        break;
                    case "*":
                        this[prop] *= val;
                        break;
                    case "/":
                        this[prop] /= val;
                        break;
                    case "%":
                        this[prop] %= val;
                        break;
                    case "^":
                        this[prop] = Math.pow(this[prop], val);
                        break;
                    case "==":
                        return (this[prop] === val);
                    case "<=":
                        return (this[prop] <= val);
                    case ">=":
                        return (this[prop] >= val);
                    case "<":
                        return (this[prop] < val);
                    case ">":
                        return (this[prop] > val);
                    default:
                        throw new Error("Size.operate does not support " + op);
                    }
                    return this;
                }
            };
        }());

    // VECTOR
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.equals = function (vec) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    };
    Vector.prototype.plus = function (val) {
        var x = (val instanceof Vector ? val.x : (typeof val === "number" ? val : 0)),
            y = (val instanceof Vector ? val.y : (typeof val === "number" ? val : 0));
        return new Vector(this.x + x, this.y + y);
    };
    Vector.prototype.minus = function (val) {
        var x = (val instanceof Vector ? val.x : (typeof val === "number" ? val : 0)),
            y = (val instanceof Vector ? val.y : (typeof val === "number" ? val : 0));
        return new Vector(this.x - x, this.y - y);
    };
    Vector.prototype.multiply = function (val) {
        var x = (val instanceof Vector ? val.x : (typeof val === "number" ? val : 0)),
            y = (val instanceof Vector ? val.y : (typeof val === "number" ? val : 0));
        return new Vector(this.x * x, this.y * y);
    };
    Vector.prototype.divide = function (val) {
        var x = (val instanceof Vector ? val.x : (typeof val === "number" ? val : 0)),
            y = (val instanceof Vector ? val.y : (typeof val === "number" ? val : 0));
        return new Vector(this.x / x, this.y / y);
    };
    Vector.prototype.plusEq = function (val) {
        var x = (val instanceof Vector ? val.x : (typeof val === "number" ? val : 0)),
            y = (val instanceof Vector ? val.y : (typeof val === "number" ? val : 0));
        this.x += x;
        this.y += y;
        return this;
    };
    Vector.prototype.minusEq = function (val) {
        var x = (val instanceof Vector ? val.x : (typeof val === "number" ? val : 0)),
            y = (val instanceof Vector ? val.y : (typeof val === "number" ? val : 0));
        this.x -= x;
        this.y -= y;
        return this;
    };
    Vector.prototype.multiplyEq = function (val) {
        var x = (val instanceof Vector ? val.x : (typeof val === "number" ? val : 0)),
            y = (val instanceof Vector ? val.y : (typeof val === "number" ? val : 0));
        this.x *= x;
        this.y *= y;
        return this;
    };
    Vector.prototype.divideEq = function (val) {
        var x = (val instanceof Vector ? val.x : (typeof val === "number" ? val : 0)),
            y = (val instanceof Vector ? val.y : (typeof val === "number" ? val : 0));
        this.x /= x;
        this.y /= y;
        return this;
    };
    Vector.prototype.operate = function (property, operation, value) {
        if (this.hasOwnProperty(property)) {
            return operate.call(this, property, operation, value);
        }
    };
    Vector.prototype.minX = function (vec) {
        if (vec.hasOwnProperty("x")) {
            return (this.x <= vec.x ? this.clone() : vec.clone());
        }
        throw new Error("shapes.Vector.minX requires type with 'x' property.");
    };
    Vector.prototype.maxX = function (vec) {
        if (vec.hasOwnProperty("x")) {
            return (this.x >= vec.x ? this.clone() : vec.clone());
        }
        throw new Error("shapes.Vector.maxX requires type with 'x' property.");
    };
    Vector.prototype.minY = function (vec) {
        if (vec.hasOwnProperty("x")) {
            return (this.y <= vec.y ? this.clone() : vec.clone());
        }
        throw new Error("shapes.Vector.minY requires type with 'x' property.");
    };
    Vector.prototype.maxY = function (vec) {
        if (vec.hasOwnProperty("x")) {
            return (this.y >= vec.y ? this.clone() : vec.clone());
        }
        throw new Error("shapes.Vector.maxY requires type with 'x' property.");
    };
    Vector.prototype.inside = function (rect) {
        return (this.x >= rect.x && this.y >= rect.y && this.x < rect.x + rect.w && this.y <= rect.y + rect.h ? true : false);
    };
    Vector.prototype.length = function () {
        var args = arguments;
        if (args.length > 0 && args[0] instanceof Vector) {
            return Math.sqrt(Math.abs(this.x - args[0].x) * Math.abs(this.x - args[0].x) + Math.abs(this.y - args[0].y) * Math.abs(this.y - args[0].y));
        }
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector.prototype.normalize = function () {
        var l = this.length();
        if (l > 0) {
            this.equals(this.multiply(1 / l));
        }
        return this;
    };
    Vector.prototype.toAngle = function () {
        var args = arguments,
            origin = (args.length > 0 && args[0] instanceof Vector ? args[0] : new Vector(0, 0));
        return (Math.atan2(this.y - origin.y, this.x - origin.x)) * 180 / 3.14159265359;
    };
    Vector.prototype.toRadian = function () {
        var args = arguments,
            origin = (args.length > 0 && args[0] instanceof Vector ? args[0] : new Vector(0, 0));
        return (Math.atan2(this.y - origin.y, this.x - origin.x));
    };
    Vector.prototype.rotate = function () {
        var args = arguments,
            angle = (args.length > 0 ? args[0] : 0),
            org = (args.length > 1 && args[1] instanceof Vector ? args[1] : new Vector()),
            inRadians = (angle *  3.14159265359 / 180),
            cosTheta = Math.cos(inRadians),
            sinTheta = Math.sin(inRadians),
            newX = (cosTheta * (this.x - org.x) - sinTheta * (this.y - org.y) + org.x),
            newY = (sinTheta * (this.x - org.x) + cosTheta * (this.y - org.y) + org.y);
        this.x = newX;
        this.y = newY;
        return this;
    };
    Vector.prototype.floor = function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    };
    Vector.prototype.ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    };
    Vector.prototype.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    };
    Vector.prototype.toString = function () {
        return (this.x + "," + this.y);
    };
    // SIZE
    function Size(w, h) {
        this.w = w;
        this.h = h;
    }
    Size.prototype.equals = function (size) {
        if (size instanceof Size) {
            this.w = size.w;
            this.h = size.h;
        }
        return this;
    };
    Size.prototype.clone = function () {
        return new Size(this.w, this.h);
    };
    Size.prototype.minW = function (size) {
        if (size instanceof Size) {
            return (this.w <= size.w ? this.clone() : size.clone());
        }
        throw new Error("shapes.Size.minW requires Size type");
    };
    Size.prototype.maxW = function (size) {
        if (size instanceof Size) {
            return (this.w >= size.w ? this.clone() : size.clone());
        }
        throw new Error("shapes.Size.maxW requires Size type");
    };
    Size.prototype.minH = function (size) {
        if (size instanceof Size) {
            return (this.h <= size.h ? this.clone() : size.clone());
        }
        throw new Error("shapes.Size.minH requires Size type");
    };
    Size.prototype.maxH = function (size) {
        if (size instanceof Size) {
            return (this.h >= size.h ? this.clone() : size.clone());
        }
        throw new Error("shapes.Size.maxH requires Size type");
    };
    Size.prototype.scale = function (val) {
        if (val instanceof Size) {
            this.w += val.w;
            this.h += val.h;
        } else if (typeof val === "number") {
            this.w += val;
            this.h += val;
        }
        return this;
    };
    Size.prototype.plus = function (val) {
        var w = (val instanceof Size ? val.w : (typeof val === "number" ? val : 0)),
            h = (val instanceof Size ? val.h : (typeof val === "number" ? val : 0));
        return new Size(this.w + w, this.h + h);
    };
    Size.prototype.minus = function (val) {
        var w = (val instanceof Size ? val.w : (typeof val === "number" ? val : 0)),
            h = (val instanceof Size ? val.h : (typeof val === "number" ? val : 0));
        return new Size(this.w - w, this.h - h);
    };
    Size.prototype.multiply = function (val) {
        var w = (val instanceof Size ? val.w : (typeof val === "number" ? val : 0)),
            h = (val instanceof Size ? val.h : (typeof val === "number" ? val : 0));
        return new Size(this.w * w, this.h * h);
    };
    Size.prototype.divide = function (val) {
        var w = (val instanceof Size ? val.w : (typeof val === "number" ? val : 0)),
            h = (val instanceof Size ? val.h : (typeof val === "number" ? val : 0));
        return new Size(this.w / w, this.h / h);
    };
    Size.prototype.operate = function (property, operation, value) {
        if (this.hasOwnProperty(property)) {
            return operate.call(this, property, operation, value);
        }
    };
    Size.prototype.isEmpty = function () {
        return (this.w === 0 || this.h === 0 ? true : false);
    };
    // RECT
    function Rect(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    Rect.prototype.clone = function () {
        return new Rect(this.x, this.y, this.w, this.h);
    };
    Rect.prototype.operate = function (property, operation, value) {
        if (this.hasOwnProperty(property)) {
            return operate.call(this, property, operation, value);
        }
    };
    Rect.prototype.equals = function (obj) {
        if (obj instanceof Rect) {
            this.x = obj.x;
            this.y = obj.y;
            this.w = obj.w;
            this.h = obj.h;
        } else if (obj instanceof Vector) {
            this.x = obj.x;
            this.y = obj.y;
        } else if (obj instanceof Size) {
            this.w = obj.w;
            this.h = obj.h;
        } else {
            throw new Error("Rect.equals requires Rect, Vector, or Size.");
        }
        return this;
    };
    Rect.prototype.left = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Vector) {
                this.x = args[0].x;
            } else if (typeof args[0] === "number") {
                this.x = args[0];
            } else {
                throw new Error("Rect.left setter requires either Vector or Number.");
            }
            return this;
        }
        return this.x;
    };
    Rect.prototype.topLeft = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Vector) {
                this.x = args[0].x;
                this.y = args[0].y;
                return this;
            }
            throw new Error("Rect.topLeft setter Requires Vector.");

        }
        return new Vector(this.x, this.y);
    };
    Rect.prototype.top = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Vector) {
                this.y = args[0].y;
            } else if (typeof args[0] === "number") {
                this.y = args[0];
            } else {
                throw new Error("Rect.top setter requires either Vector or Number.");
            }
            return this;
        }
        return this.y;
    };
    Rect.prototype.topRight = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Vector) {
                this.x = args[0].x - this.w;
                this.y = args[0].y;
                return this;
            }
            throw new Error("Rect.topRight setter requires Vector.");

        }
        return new Vector(this.x + this.w, this.y);
    };
    Rect.prototype.right = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Vector) {
                this.x = args[0].x - this.w;
            } else if (typeof args[0] === "number") {
                this.x = args[0] - this.w;
            } else {
                throw new Error("Rect.right setter requires Vector or Number.");
            }
            return this;
        }
        return this.x + this.w;
    };
    Rect.prototype.bottomRight = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Vector) {
                this.x = args[0].x - this.w;
                this.y = args[0].y - this.h;
                return this;
            }
            throw new Error("Rect.bottomRight setter requires Vector.");
        }
        return new Vector(this.x + this.w, this.y + this.h);
    };
    Rect.prototype.bottom = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Vector) {
                this.y = args[0].y - this.h;
            } else if (typeof args[0] === "number") {
                this.y = args[0] - this.h;
            } else {
                throw new Error("Rect.bottom setter requires Vector or Number");
            }
            return this;
        }
        return this.y + this.h;
    };
    Rect.prototype.bottomLeft = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Vector) {
                this.x = args[0].x;
                this.y = args[0].y - this.h;
                return this;
            }
            throw new Error("Rect.bottomLeft setter requires Vector.");
        }
        return new Vector(this.x, this.y + this.h);
    };
    Rect.prototype.center = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Vector) {
                this.x = args[0].x - (this.w / 2);
                this.y = args[0].y - (this.h / 2);
                return this;
            }
            throw new Error("Rect.center setter requires Vector.");
        }
        return new Vector(this.x + (this.w / 2), this.y + (this.h / 2));
    };
    Rect.prototype.width = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Size) {
                this.w = args[0].w;
            } else if (typeof args[0] === "number") {
                this.w = args[0];
            } else {
                throw new Error("Rect.width setter requires Size or Number.");
            }
            return this;
        }
        return this.w;
    };
    Rect.prototype.height = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Size) {
                this.h = args[0].h;
            } else if (typeof args[0] === "number") {
                this.h = args[0];
            } else {
                throw new Error("Rect.height setter requires Size or Number.");
            }
            return this;
        }
        return this.h;
    };
    Rect.prototype.size = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Size) {
                this.w = args[0].w;
                this.h = args[0].h;
                return this;
            }
            throw new Error("Rect.size setter requires Size.");
        }
        return new Size(this.w, this.h);
    };
    Rect.prototype.vector = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Size) {
                this.x = args[0].x;
                this.y = args[0].y;
                return this;
            }
            throw new Error("Rect.vector setter requires Vector.");
        }
        return new Vector(this.x, this.y);
    };
    Rect.prototype.isEmpty = function () {
        return (new Size(this.w, this.h).isEmpty());
    };
    Rect.prototype.isInverted = function () {
        return (this.w < 0 || this.h < 0 ? true : false);
    };
    Rect.prototype.contains = function (obj) {
        var result = false;
        if (obj instanceof Vector) {
            result = ((this.x <= obj.x && this.y <= obj.y && this.x + this.w >= obj.x && this.y + this.h >= obj.y) ? true : false);
        } else if (obj instanceof Size) {
            result = ((this.w >= obj.w && this.h >= obj.h) ? true : false);
        } else if (obj instanceof Rect) {
            result = ((this.x <= obj.x && this.y <= obj.y && this.x + this.w >= obj.x + obj.w && this.y + this.h >= obj.y + obj.h ? true : false));
        } else {
            throw new Error("Rect.contains requires Vector, Size, or Rect.");
        }
        return result;
    };
    Rect.prototype.floor = function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.w = Math.floor(this.w);
        this.h = Math.floor(this.h);
        return this;
    };
    Rect.prototype.ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.w = Math.ceil(this.w);
        this.h = Math.ceil(this.h);
        return this;
    };
    Rect.prototype.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.w = Math.round(this.w);
        this.h = Math.round(this.h);
        return this;
    };
    Rect.prototype.fill = function (ctx) {
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    Rect.prototype.stroke = function (ctx) {
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    };
    Rect.prototype.clear = function (ctx) {
        ctx.clearRect(this.x, this.y, this.w, this.h);
    };

    // GRID
    function Grid(width, height) {
        this.width = width;
        this.height = height;
        this.space = new Array(this.width * this.height);
    }
    Grid.prototype.get = function (vec) {
        if (vec instanceof Vector) {
            return this.space[vec.x + vec.y * this.width];
        }
        throw new TypeError("Grid.get requires Vector type.");
    };
    Grid.prototype.set = function (vec, value) {
        if (vec instanceof Vector) {
            this.space[vec.x + vec.y * this.width] = value;
            return this.space[vec.x + vec.y * this.width];
        }
        throw new TypeError("Grid.set requires Vector type.");
    };
    Grid.prototype.forEach = function (func, context) {
        var x = 0, y = 0;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                func.call(context || this || null, this.space[x + y * this.width], new Vector(x, y), this.space);
            }
        }
    };
    Grid.prototype.width = function () {
        return this.width;
    };
    Grid.prototype.height = function () {
        return this.height;
    };
    Grid.prototype.reverse = function () {
        this.space.reverse();
    };

    // IMG 
    function Img(srcId, destRect) {
        this.img = document.createElement("IMG");
        this.img.src = srcId;
        this.sRect = new Rect(0, 0, this.img.width, this.img.height);
        if (destRect) {
            if (destRect instanceof Rect) {
                this.dRect = destRect.clone();
            } else if (destRect instanceof Vector) {
                this.dRect = new Rect(destRect.x, destRect.y, this.img.width, this.img.height);
            } else if (destRect instanceof Size) {
                this.dRect = new Rect(0, 0, destRect.w, destRect.h);
            }
        } else {
            this.dRect = new Rect(0, 0, this.img.width, this.img.height);
        }
    }
    Img.prototype.clone = function () {
        var result = new Img(this.img.src, this.dRect.clone());
        result.destRect(this.img.destRect().clone());
        return result;
    };
    Img.prototype.srcRect = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Rect || args[0] instanceof Vector || args[0] instanceof Size) {
                this.sRect.equals(args[0]);
            } else {
                throw new Error("Img.srcRect setter requires Rect, Vector, Size.");
            }
            return this;
        }
        return this.sRect;
    };
    Img.prototype.destRect = function () {
        var args = arguments;
        if (args.length > 0) {
            if (args[0] instanceof Rect || args[0] instanceof Vector || args[0] instanceof Size) {
                this.dRect.equals(args[0]);
            } else {
                throw new Error("Img.destRect setter requires Rect, Vector, or Size");
            }
            return this;
        }
        return this.dRect;
    };
    Img.prototype.draw = function (ctx) {
        if (new Rect(0, 0, this.img.width, this.img.height).contains(this.sRect) && !this.sRect.isInverted()) {
            ctx.drawImage(this.img, this.sRect.x, this.sRect.y, this.sRect.w, this.sRect.h, this.dRect.x, this.dRect.y, this.dRect.w, this.dRect.h);
        }
        return this;
    };

    // Timer
    function Timer(milliseconds) {
        this.past = window.performance.now();
        this.now = window.performance.now();
        this.speed = milliseconds;
    }
    Timer.prototype.speed = function () {
        var args = arguments;
        if (args.length > 0) {
            this.speed = args[0];
            return this;
        }
        return this.speed;
    };
    Timer.prototype.timedOut = function () {
        if (this.now - this.past > this.speed) {
            this.past = window.performance.now();
            return true;
        }
        this.now = window.performance.now();
        return false;
    };

    // SPRITESHEET
    function SpriteSheet(srcId, srcRect, frames, rows, animSpeed) {
        this.img = new Img(srcId);
        this.img.srcRect(new Rect(srcRect.x, srcRect.y, Math.floor(srcRect.w / frames), Math.floor(srcRect.h / rows)));
        this.srcX = srcRect.x;
        this.srcY = srcRect.y;
        this.img.destRect(new Size(srcRect.w / frames, srcRect.h / rows));
        this.numFrames = frames;
        this.numRows = rows;
        this.currentFrame = 0;
        this.currentRow = 0;
        this.animSpeed = animSpeed;
        this.timer = new Timer(animSpeed);
    }
    SpriteSheet.prototype.destRect = function () {
        var args = arguments;
        if (args.length > 0) {
            this.img.destRect(args[0]);
            return this;
        }
        return this.img.destRect();
    };
    SpriteSheet.prototype.update = function () {
        var x = 0, y = 0;
        if (this.timer.timedOut()) {
            this.currentFrame = (this.currentFrame + 1) % this.numFrames;
            if (this.currentFrame === 0) {
                this.img.srcRect().left(this.srcX);
            }
            x = this.currentFrame * this.img.srcRect().w + this.srcX;
            y = this.currentRow * this.img.srcRect().h + this.srcY;
            this.img.srcRect(new Vector(x, y));
        }
    };
    SpriteSheet.prototype.row = function () {
        var args = arguments;
        if (args.length > 0) {
            if (typeof args[0] === "number") {
                this.currentRow = args[0];
                return this;
            }
        }
        return this.currentRow;
    };
    SpriteSheet.prototype.draw = function (ctx) {
        this.img.draw(ctx);
    };

    // add functions to export object to interface with the module:
    exported.isVector = function (obj) {
        return (obj instanceof Vector);
    };
    exported.isSize = function (obj) {
        return (obj instanceof Size);
    };
    exported.isRect = function (obj) {
        return (obj instanceof Rect);
    };
    exported.isGrid = function (obj) {
        return (obj instanceof Grid);
    };
    exported.makeVector = function () {
        var args = arguments,
            x = (args.length > 0 ? args[0] : 0),
            y = (args.length > 1 ? args[1] : 0);
        return new Vector(x, y);
    };
    exported.makeSize = function () {
        var args = arguments,
            w = (args.length > 0 ? args[0] : 0),
            h = (args.length > 1 ? args[1] : 0);
        return new Size(w, h);
    };
    exported.makeRect = function () {
        var args = arguments,
            x = (args.length > 0 ? args[0] : 0),
            y = (args.length > 1 ? args[1] : 0),
            w = (args.length > 2 ? args[2] : 0),
            h = (args.length > 3 ? args[3] : 0);
        return new Rect(x, y, w, h);
    };
    exported.makeImage = function () {
        var args = arguments,
            srcId,
            destRect;
        if (args.length > 0 && typeof args[0] === "string" && args[0].length > 0) {
            srcId = args[0];
            destRect = (args.length > 1 ? args[1] : null);
            return new Img(srcId, destRect);
        }
    };
    exported.makeGrid = function () {
        var args = arguments,
            w = 0,
            h = 0;
        if (args.length > 0) {
            if (args[0] instanceof Size) {
                w = args[0].w;
                h = args[0].h;
            } else if (args.length > 1) {
                w = args[0];
                h = args[1];
            }
            return new Grid(w, h);
        }
        throw new TypeError("shapes.makeGrid requires Size or Number's.");
    };
    exported.makeSpriteSheet = function () {
        var args = arguments, speed = 133;
        if (args.length > 3 && typeof args[0] === "string" && args[0].length > 0 && args[1] instanceof Rect) {
            if (args.length > 4 && typeof args[4] === "number") {
                speed = args[4];
            }
            return new SpriteSheet(args[0], args[1], args[2], args[3], speed);
        }
        throw new TypeError("shapes.makeSpriteSheet takes String Id, SrcRect, frames, rows, and speed");
    };
    exported.makeTimer = function () {
        var args = arguments, speed = 10;
        if (args.length > 0 && typeof args[0] === "number") {
            speed = args[0];
        }
        return new Timer(speed);
    };

    return exported;
}({})));