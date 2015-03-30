define(["scripts/shapes.js"], function (shapes) {
    "use strict";
    return (function (exported) {

        /***********************************************************************************************\
        ****************************************** CHEAT SHEET ******************************************
        
        ----imageMap-------------------------------------------------------------------------------------
            Object that maintains HTMLImageElement's associated with a name.
            
            Data:
            
                imgMap (private Object) - holds the name: HTMLImageElement pairing.
                
            Methods:
            
                get(key);
                
                    Retrieve the HTMLImageElement associated with key.
                    
                    key - The name of a stored HTMLImageElement to retrieve.
                    returns - Returns the HTMLImageElement associated with the passed key.
                    Throws - Throws ReferenceError if no property with that name exists.
                    
                set(key, imgSrc);
                
                    Creates an HTMLImageElement from the passed imgSrc, stores it as
                    value of property with name of passed key.
                    
                    key - The name to associate with a new HTMLImageElement.
                    imgSrc - The source URL of the image to store, must be string type.
                    returns - Returns the imageMap object.
                    
                contains(key);
                
                    Checks whether an entry for the passed key exists within the private 
                    imageMap object.
                    
                    key - The name of a property to check.
                    returns - Returns true if the property exists, else returns false.
                    
                getImgRect(key);
                
                    Returns a shapes::Rect object representing the width and height of the HTMLImageElement
                    associated with 'key', with (x,y) position of (0,0).
                    
                    key - The property name associated with the HTMLImageElement to get the rectangle of.
                    Throws - Throws reference error if property associated with 'key' does not exist.
                    
                draw(ctx, key, srcRect, destRect);
                
                    Draws the HTMLImageElement using the passed CanvasRenderingContext2D and source
                    and destination rectangles.
                    
                    ctx - A valid CanvasRenderingContext2D to use for drawing.
                    key - The key associated with an HTMLImageElement.
                    srcRect - The source rectangle to use in drawing operations.
                    destRect - The destination rectangle to use in drawing operations.
                    returns - Returns the imageMap object.
                    Throws - Throws a ReferenceError if the key property does not exist.
        -------------------------------------------------------------------------------------------------
        
        ----inputHandler---------------------------------------------------------------------------------
        
            Object with methods for binding callback functions to HTMLElement's, with private members
            for collection of data associated with events.
            
            Data:
            
                keys (Private Object) - Associates a boolean true/false value with string value of event.key
                cursorPos (Private Vector) - Stores the current offset of the cursor from the HTMLElement 
                                             bound to the mousemove event.
                mouseButtons (Private Array) - Associates a boolean true/false value with the numbers that
                                               represent mouse buttons (key.button).
            
            Methods:
            
                keyEvent(event); // private
                    The callback that is bound to both onkeyup and onkeydown event listener for elements.
                    Stores true value in keys object for property with the name of event.key if the event
                    type is 'keydown' otherwise stores false.
                    event - The event object.
                mouseButtonEvent(event); // private
                    The callback that is bound to both mouseup and mousedown events for elements passed to
                    the 'bind' function with "mousebutton" as second argument.
                    event - The event object.
                mouseMoveEvent(event); // private
                    The callback that is bound to the mousemove event for elements pass to the bind function
                    with "mousemove" as second argument.
                    
                bind(htmlElement, eventType);
                
                    Binds the private inputHandler function associated with the passed 'eventType' to the 
                    HTMLElement represented by the first argument.
                    
                    htmlElement - The HTMLElement to bind to the passed eventType.
                    eventType - The type of events to bind to the passed element.  Possible values are:
                        1. "key" - Bind both 'keyup' and 'keydown' listeners to the passed element.
                        2. "mousemove" - Bind 'mousemove' listeners to the passed element.
                        3. "mousebutton" - Bind both 'mouseup' and 'mousedown' listeners to the passed element.
                    returns - Returns the inputHandler object.
                    throws - Throws a TypeError if the first argument is undefined, or if the passed
                             eventType string does not contain a valid event type.
                    
                mousePosition();
                
                    Returns a shapes::Vector object representing the (x,y) value of the current offset of
                    the cursor from the top left of the element bound to "mousemove" event types.
                
                mouseButtonDown(button);
                    
                    Returns the true/false state of the passed button.  With true representing a pressed button,
                    and false representing a released one.
                    
                    button - A string that may contain any of the following values (case insensitive):
                             1. "left"
                             2. "middle"
                             3. "right"
                             
                keyDown(key);
                
                    Returns a true/false value indicating whether the passed 'key' is pressed or not.
                    The key is case insensitive, and is one of the values possible in the event objects
                    'key' property (ie "a", "spacebar", "up").
               
                getKeys();
                
                    Returns an array object, containing names of all the keys currently pressed.
        -------------------------------------------------------------------------------------------------
        
        ----ImageObject----------------------------------------------------------------------------------
        
            A class representing all the information needed to draw in HTMLImageElement that is stored
            in the imageMap, using a CanvasRenderingContext2D.
            
            Data:
                name (string public) - The name associated with an HTMLImageElement stored in the imageMap.
                srcRect (Rect public) - A shapes::Rect object representing the source rectangle of the 
                                        image to use while drawing.
                destRect (Rect public) - A Shapes::Rect object representing where the image should be
                                         drawn to.
                                         
        *************************************************************************************************
        \***********************************************************************************************/

        // IMAGEMAP -- Store images in object as associative map
        // imageMap.get(name); - Returns the HTMLImageElement stored as value of 'name' property.
        // imageMap.set(name, imgSrc); - Creates an HTMLImageElement from the source string, stores it in property 'name'.
        // imageMap.contains(name); - Returns true if the passed name exists in the imageMap.
        // imageMap.getImgRect(name); - Returns a shapes::Rect object representing the dimensions of the HTMLImageElement stored as value of property with name.
        // imageMap.draw(context, name, srcRect, destRect); - Draws the HTMLImageElement associated with 'name' using the passed source and destination Rect objects.
        var imageMap = (function () {
            var imgMap = {},
                get = function (key) {
                    if (imgMap.hasOwnProperty(key)) {
                        return imgMap[key];
                    }
                    throw new ReferenceError("imageMap does not contain property: " + key);
                },
                set = function (key, imgSrc) {
                    var ele;
                    if (typeof imgSrc === "string") {
                        if (!imgMap.hasOwnProperty(key)) {
                            ele = document.createElement("IMG");
                            ele.src = imgSrc;
                            imgMap[key] = ele;
                            return this;
                        }
                    }
                    throw new TypeError("imageMap.set requires string type, recieved: " + (typeof imgSrc));
                },
                contains = function (name) {
                    return (imgMap.hasOwnProperty(name) ? true : false);
                },
                getImgRect = function (name) {
                    if (contains(name)) {
                        return shapes.makeRect(0, 0, imgMap[name].width, imgMap[name].height);
                    }
                    throw new ReferenceError("imageMap.getImgRect called for non existing image: " + name);
                },
                draw = function (ctx, name, srcRect, destRect) {
                    if (ctx) {
                        if (contains(name)) {
                            ctx.drawImage(imgMap[name], srcRect.x, srcRect.y, srcRect.w, srcRect.h, destRect.x, destRect.y, destRect.w, destRect.h);
                            return this;
                        }
                    } else {
                        throw new ReferenceError("imageMap (draw) was passed invalid CanvasRenderingContext2D");
                    }
                };
            return {
                get : get,
                set : set,
                contains: contains,
                getImgRect : getImgRect,
                draw : draw
            };
        }()),
            // inputHandler - Establishes collection of input events into private memory.  Three types of input are handled:
            // "key" - Stores true and false values for the associated keys for the element attached.
            // "mousemove" - Stores cursor position as Shapes::Vector object, based on the offest of the cursor from the element attached.
            // "mousebutton" - Stores true and false values for mouse buttons for events fired for the attached element.
            // Methods- 
            // private:
            // keyEvent(event); - Callback established on passed element for both 'keydown' and 'keyup' events.
            // mouseButtonEvent(event); - Callback established on passed element for both 'mousedown' and 'mouseup' events.
            // mouseMoveEvent(event); - Callback established on passed element for 'mousemove' events.
            // public:
            // bind(HTMLElement, eventType); - Establishes the collection of event data of the type passed and second argument for the passed element.
            // mousePosition(); - Returns a copy of the shapes::Vector object that stores cursor position (relative to element).
            // mouseButtonDown(string); Returns true or false value indicating whether the passed button is pressed.  Values to pass are: 'left', 'middle', 'right'.
            // keyDown(string); Returns true of false value indicating whether the passed key is pressed.
            // getKeys(); Returns an array with the names of all keys currently pressed. (eg ['left', 'up', 'spacebar']).
            inputHandler = (function () {
                var keys = Object.create(null),
                    cursorPos = shapes.makeVector(0, 0),
                    mouseButtons = [],
                    keyEvent = function (event) {
                        event = event || window.event;
                        keys[event.key.toLowerCase()] = (event.type === "keydown");
                        event.stopPropagation();
                    },
                    mouseButtonEvent = function (event) {
                        event = event || window.event;
                        mouseButtons[event.button] = (event.type === "mousedown");
                        event.stopPropagation();
                    },
                    mouseMoveEvent = function (event) {
                        var offX = 0,
                            offY = 0;
                        event = event || window.event;
                        offX = event.offsetX || event.layerX;
                        offY = event.offsetY || event.layerY;
                        cursorPos.equals(shapes.makeVector(offX, offY));
                        event.stopPropagation();
                    },
                    bind = function (element, eventType) {
                        var success = true;
                        if (element) {
                            switch (eventType.toLowerCase()) {
                            case "key":
                                element.onkeydown = keyEvent;
                                element.onkeyup = keyEvent;
                                break;
                            case "mousemove":
                                element.onmousemove = mouseMoveEvent;
                                break;
                            case "mousebutton":
                                element.onmousedown = mouseButtonEvent;
                                element.onmouseup = mouseButtonEvent;
                                break;
                            default:
                                success = false;
                                break;
                            }
                            if (success) {
                                return this;
                            }
                        }
                        throw new TypeError("Error: inputHandler.bind accepts events types: 'key', 'mousemove' 'mousebutton', and was passed: " + eventType);
                    },
                    mousePosition = function () {
                        return cursorPos.clone();
                    },
                    mouseButtonDown = (function () {
                        var buttons = {
                            left: 0,
                            middle: 1,
                            right: 2
                        };
                        return function (buttonStr) {
                            return mouseButtons[buttons[buttonStr.toLowerCase()]];
                        };
                    }()),
                    keyDown = function (keyStr) {
                        return keys[keyStr.toLowerCase()];
                    },
                    getKeys = function () {
                        var result = [],
                            name;
                        for (name in keys) {
                            if (keys[name] === true) {
                                result.push(name);
                            }
                        }
                        return result;
                    };

                return {
                    bind: bind,
                    mousePosition: mousePosition,
                    mouseButtonDown: mouseButtonDown,
                    keyDown: keyDown,
                    getKeys: getKeys
                };
            }()),
            parser = (function () {
                var getXML = function (url) {
                        var req = new XMLHttpRequest(),
                            result = "";
                        req.open("GET", url, false);
                        req.addEventListener("load", function onXMLLoad() {
                            if (req.status < 400) {
                                result = req.responseText;
                            } else {
                                console.log("Error retrieving XML, HTTP status: " + req.status + ", " + req.statusText);
                            }
                        });
                        req.send();
                        return result;
                    },
                    parseXML = function (xml) {
                        var parse, result;
                        if (window.DOMParser) {
                            parse = new DOMParser();
                            result = parse.parseFromString(xml, "text/xml");
                        } else {
                            result = new ActiveXObject("Microsoft.XMLDOM");
                            result.async = false;
                            result.loadXML(xml);
                        }
                        return result;
                    };

                return {
                    getXML: getXML,
                    parseXML: parseXML
                };
            }()),
            factory = (function () {
                var player = function (playerEle) {
                        var getProperties = function (playerEle) {
                                var props = playerEle.getElementsByTagName("property"),
                                    result = {},
                                    i = 0;
                                for (i = 0; i < props.length; i++) {
                                    result[props[i].getAttribute("name")] = props[i].getAttribute("value");
                                }
                                return result;
                            },
                            destRect = shapes.makeRect(parseInt(playerEle.getAttribute("x"), 10), parseInt(playerEle.getAttribute("y"), 10), parseInt(playerEle.getAttribute("width"), 10), parseInt(playerEle.getAttribute("height"), 10)),
                            name = playerEle.getAttribute("name"),
                            props = getProperties(playerEle),
                            sr = JSON.parse(props.srcRect),
                            srcRect = shapes.makeRect(parseInt(sr.x, 10), parseInt(sr.y, 10), parseInt(sr.w, 10), parseInt(sr.h, 10)),
                            moveSpeed = parseInt(props.movespeed, 10),
                            animSpeed = parseInt(props.animspeed, 10),
                            numRows = parseInt(props.numrows, 10),
                            numFrames = parseInt(props.numframes, 10),
                            am = JSON.parse(props.animmaps),
                            animMaps = [],
                            i = 0;
                        for (i = 0; i < am.length; i++) {
                            animMaps.push(new AnimMap(am[i].name, parseInt(am[i].row, 10), parseInt(am[i].first, 10), parseInt(am[i].length, 10), am[i].type, am[i].triggers));
                        }
                        return new Player(new ControlledSpriteObject(new SpriteObject(new ImageObject(name, srcRect, destRect), numFrames, numRows, animSpeed), animMaps), moveSpeed);
                    },
                    methods = {
                        player: player
                    },
                    createObjects = function (objLayer) {
                        var i = 0,
                            objs = objLayer.getElementsByTagName("object"),
                            result = [],
                            type;
                        for (i = 0; i < objs.length; i++) {
                            type = objs[i].getAttribute("type");
                            if (methods.hasOwnProperty(type.toLowerCase())) {
                                result.push(methods[type.toLowerCase()](objs[i]));
                            }
                        }
                        return result;
                    };
                return {
                    createObjects: createObjects,
                    player: player
                };
            }());
        //---------------------------------------------------------------------------------------------------------//
        function ImageObject(name, srcRect, destRect) {
            this.name = name;
            this.srcRect = srcRect.clone();
            this.destRect = destRect.clone();
        }
        ImageObject.prototype.clone = function () {
            return new ImageObject(this.name, this.srcRect.clone(), this.destRect.clone());
        };
        ImageObject.prototype.draw = function (ctx) {
            imageMap.draw(ctx, this.name, this.srcRect, this.destRect);
        };
        ImageObject.prototype.update = function () {
            return;
        };
        ImageObject.prototype.dRect = function () {
            var args = arguments;
            if (args.length > 0) {
                this.destRect.equals(args[0]);
                return this;
            }
            return this.destRect;
        };
        ImageObject.prototype.sRect = function () {
            var args = arguments;
            if (args.length > 0) {
                this.srcRect.equals(args[0]);
                return this;
            }
            return this.srcRect;
        };
        //---------------------------------------------------------------------------------------------------------//
        function SpriteObject(imgObj, numFrames, numColumns, animSpeed) {
            this.imgObj = imgObj.clone();
            this.offsetVec = this.imgObj.sRect().topLeft();
            this.numFrames = numFrames;
            this.numColumns = numColumns;
            this.currentFrame = 0;
            this.currentRow = 0;
            this.updating = true;
            this.timer = shapes.makeTimer(animSpeed);
        }
        SpriteObject.prototype.clone = function () {
            return new SpriteObject(this.imgObj.clone(), this.numFrames, this.numColumns, this.timer.speed);
        };
        SpriteObject.prototype.row = function () {
            var args = arguments;
            if (args.length > 0) {
                this.currentRow = args[0];
                return this;
            }
            return this.currentRow;
        };
        SpriteObject.prototype.dRect = function () {
            return this.imgObj.dRect.apply(this.imgObj, arguments);
        };
        SpriteObject.prototype.sRect = function () {
            return this.imgObj.sRect.apply(this.imgObj, arguments);
        };
        SpriteObject.prototype.update = function () {
            var sRect;
            // When the timer signals, we advance the frame and adjust the source rectangle, if we are updating.
            if (this.updating && this.timer.timedOut()) {
                sRect = this.imgObj.sRect();
                this.currentFrame = (this.currentFrame + 1) % this.numFrames;
                sRect.equals(shapes.makeVector(this.offsetVec.x + this.currentFrame * sRect.w, this.offsetVec.y + this.currentRow * sRect.h));
            }
        };
        SpriteObject.prototype.draw = function (ctx) {
            this.imgObj.draw(ctx);
        };
        //---------------------------------------------------------------------------------------------------------//
        // A ButtonObject is an ImageObject with 3 frames, and 1 row.
        // Animation takes place on 2 events,
        // 1: The mouse is over the button (frame 2).
        // 2: The left mouse button is held down over the button.
        // The passed callback is executed when the left mouse is released, after having been pressed, while over
        // the image.  The callback is passed the name associated with the buttons image:
        // function (name) {...};
        function ButtonObject(imgObj, callback) {
            this.imgObj = imgObj.clone();
            // The callback is called when clicked, and passed the imgObj.name of the button that was clicked.
            this.currentFrame = 0;
            this.callback = callback;
            this.srcX = imgObj.sRect().x;
            this.click = false;
        }
        ButtonObject.prototype.update = function () {
            var sRect = this.imgObj.sRect();
            this.currentFrame = 0;
            // Mouse is inside image
            if (inputHandler.mousePosition().inside(this.imgObj.dRect())) {
                this.currentFrame = 1;
                // Mouse Button is down
                if (inputHandler.mouseButtonDown("left")) {
                    this.click = true;
                    this.currentFrame = 2;
                } else if (this.click === true) {
                    // Mouse Button was down inside the image, then was released.
                    this.click = false;
                    this.callback(this.imgObj.name);
                }
            }
            if (!inputHandler.mouseButtonDown("left")) {
                this.click = false;
            }
            // Update the source rectangle of the button, with srcX standing in for sRect.x 
            // so we don't fly off to the right through consecutive dRect.x values.
            sRect.equals(shapes.makeVector(this.srcX + sRect.w * this.currentFrame, sRect.y));
        };
        ButtonObject.prototype.draw = function (ctx) {
            this.imgObj.draw(ctx);
        };
        //---------------------------------------------------------------------------------------------------------//
        // AnimationMap - Stores the information necessary to perform special animations with sprite-sheets.
        // -Arguments-
        // imageName - The name of an image stored in 'imageMap' which has the animation.
        // animRow - The row of the spritesheet that the animation is on.
        // animBegin - The first frame of the animation (beginning from 0)
        // animLength - The total length, in frames, of the animation.
        // eventType - The type of event that triggers the animation (key, mousebutton, mousemove);
        // tiggerValues - The values specific to the event that trigger the animation (eg. eventType == 'key' && triggerValues == ['e'])
        function AnimMap(imageName, animRow, animBegin, animLength, eventType, triggerValues) {
            this.imageName = imageName;
            this.animRow = animRow;
            this.animBegin = animBegin;
            this.animLength = animLength;
            this.eventType = eventType;
            this.triggerValues = triggerValues;
        }
        AnimMap.prototype.clone = function () {
            return new AnimMap(this.imageName, this.animRow, this.animBegin, this.animLength, this.eventType, this.triggerValues);
        };
        AnimMap.prototype.checkForEvent = function (sprite) {
            var keys,
                mousePos,
                result = false;
            switch (this.eventType) {
            case "key":
                keys = inputHandler.getKeys();
                this.triggerValues.forEach(function (trigger) {
                    if (keys.indexOf(trigger) !== -1) {
                        result = true;
                    }
                });
                break;
            case "mousebutton":
                this.triggerValues.forEach(function (trigger) {
                    if (inputHandler.mouseButtonDown(trigger)) {
                        result = true;
                    }
                });
                break;
            case "mousemove":
                mousePos = inputHandler.mousePosition();
                this.triggerValues.forEach(function (trigger) {
                    if (shapes.isRect(trigger) && mousePos.inside(trigger)) {
                        result = true;
                    } else if (typeof trigger === "function") {
                        result = trigger.call(sprite, mousePos);
                    }
                });
                break;
            }
            return result;
        };
        //---------------------------------------------------------------------------------------------------------//
        function ControlledSpriteObject(spriteObj, arrayAnimMaps) {
            this.sprite = spriteObj.clone();
            this.animMaps = (arrayAnimMaps && Object.prototype.toString.call(arrayAnimMaps) === "[object Array]" ? arrayAnimMaps : []);
            this.currentAnimation = -1;
            this.updating = true;
        }
        ControlledSpriteObject.prototype.clone = function () {
            return new ControlledSpriteObject(this.sprite.clone(), this.animMaps, this.currentAnimation, this.updating);
        };
        ControlledSpriteObject.prototype.update = function () {
            var animation = false,
                i = 0;
            if (this.updating) {
                for (i = 0; i < this.animMaps.length; i++) {
                    if (!this.animMaps[i] instanceof AnimMap) {
                        continue;
                    }
                    if (this.animMaps[i].checkForEvent(this.sprite)) {
                        animation = this.animMaps[i];
                        break;
                    }
                }
                if (animation && this.currentAnimation !== i) {
                    this.currentAnimation = i;
                    this.sprite.imgObj.name = animation.imageName;
                    this.sprite.currentFrame = animation.animBegin;
                    this.sprite.currentRow = animation.animRow;
                    this.sprite.numFrames = animation.animLength;
                }
                this.sprite.update();
            }
        };
        ControlledSpriteObject.prototype.dRect = function () {
            return this.sprite.dRect.apply(this.sprite, arguments);
        };
        ControlledSpriteObject.prototype.sRect = function () {
            return this.sprite.sRect.apply(this.sprite, arguments);
        };
        ControlledSpriteObject.prototype.draw = function (ctx) {
            this.sprite.draw(ctx);
        };
        //---------------------------------------------------------------------------------------------------------//
        function Directions(left, up, right, down) {
            this.left = left;
            this.up = up;
            this.right = right;
            this.down = down;
        }
        //---------------------------------------------------------------------------------------------------------//
        function Player(controlledSprite, moveSpeed) {
            this.conSprite = controlledSprite.clone();
            this.moveSpeed = moveSpeed;
            this.directions = new Directions(shapes.makeVector(-1, 0), shapes.makeVector(0, -1), shapes.makeVector(1, 0), shapes.makeVector(0, 1));
            this.velocity = new shapes.makeVector(0, 0);
            this.acceleration = new shapes.makeVector(0, 0);
        }
        Player.prototype.dRect = function () {
            return this.conSprite.dRect.apply(this.conSprite, arguments);
        };
        Player.prototype.sRect = function () {
            return this.conSprite.sRect.apply(this.conSprite, arguments);
        };
        Player.prototype.update = function () {
            inputHandler.getKeys().forEach(function (key) {
                if (this.directions.hasOwnProperty(key)) {
                    this.velocity.equals(this.velocity.plus(this.directions[key]));
                }
            }, this);
            this.velocity.equals(this.velocity.multiply(this.moveSpeed));
            this.velocity.equals(this.velocity.plus(this.acceleration));
            this.dRect().equals(this.dRect().topLeft().plus(this.velocity));
            this.conSprite.update();
            this.velocity.equals(shapes.makeVector(0, 0));
        };
        Player.prototype.draw = function (ctx) {
            this.conSprite.draw(ctx);
        };
        //---------------------------------------------------------------------------------------------------------//
        // firstGid: The first tile rectangle relative to all the rectangles on a given map.
        // tileWidth: The width in pixels of each tile in the tileset.
        // tileHeight: The height in pixels of each tile in the tileset.
        // spacing: The spacing between individual tiles.
        // margin: The spacing between the outer tiles and the maps edge.
        // source: The source URL of the tileset.
        // width: The width of the source picture in pixels.
        // height: The height of the source picture in pixels.
        function TileSet(tileEle) {
            var spacing = tileEle.getAttribute("spacing"),
                margin = tileEle.getAttribute("margin"),
                image = tileEle.querySelector("image");
            this.firstGid = parseInt(tileEle.getAttribute("firstgid"), 10);
            this.name = tileEle.getAttribute("name");
            this.tileWidth = parseInt(tileEle.getAttribute("tilewidth"), 10);
            this.tileHeight = parseInt(tileEle.getAttribute("tileheight"), 10);
            this.spacing = (spacing ? parseInt(spacing, 10) : 0);
            this.margin = (margin ? parseInt(margin, 10) : 0);
            this.source = image.getAttribute("source");
            this.width = parseInt(image.getAttribute("width"), 10);
            this.height = parseInt(image.getAttribute("height"), 10);
            this.numColumns = Math.floor(this.width / this.tileWidth);
            this.numRows = Math.floor(this.height / this.tileHeight);
            imageMap.set(this.name, this.source);
        }
        //---------------------------------------------------------------------------------------------------------//
        // Todo: I want an array of layers to include objects in their appropriate places.
        //---------------------------------------------------------------------------------------------------------//
        function Layer(layerEle, tilesets) {
            var width = parseInt(layerEle.getAttribute("width"), 10),
                height = parseInt(layerEle.getAttribute("height"), 10),
                data = layerEle.getElementsByTagName("tile"),
                gridGid = shapes.makeGrid(width, height),
                getTileSet = function (gid) {
                    var i = 0;
                    for (i = 1; i < tilesets.length; i++) {
                        if (gid >= tilesets[i - 1].firstGid && gid < tilesets[i].firstGid) {
                            return tilesets[i - 1];
                        }
                    }
                    if (gid >= tilesets[i - 1].firstGid) {
                        return tilesets[i - 1];
                    }
                    throw new ReferenceError("Error: tileset not found for gid: " + gid);
                };
            gridGid.forEach(function (ele, vec, array) {
                this.set(vec, parseInt(data[vec.x + vec.y * width].getAttribute("gid"), 10));
            }, gridGid);
            this.grid = shapes.makeGrid(width, height);
            this.grid.forEach(function (nul, vec, array) {
                var gid = gridGid.get(vec),
                    tileset;
                if (gid) {
                    tileset = getTileSet(gid);
                    this.set(vec, new ImageObject(tileset.name,
                                                  shapes.makeRect(tileset.margin + Math.floor((gid - tileset.firstGid) % tileset.numColumns) * (tileset.tileWidth + tileset.spacing),
                                                                  tileset.margin + Math.floor((gid - tileset.firstGid) / tileset.numColumns) * (tileset.tileHeight + tileset.spacing),
                                                                  tileset.tileWidth,
                                                                  tileset.tileHeight),
                                                  shapes.makeRect(vec.x * tileset.tileWidth,
                                                                  vec.y * tileset.tileHeight,
                                                                  tileset.tileWidth,
                                                                  tileset.tileHeight)));
                }
            }, this.grid);
        }
        Layer.prototype.draw = function (ctx) {
            this.grid.forEach(function (ele) {
                if (ele && ele.draw) {
                    ele.draw(ctx);
                }
            });
        };
        Layer.prototype.update = function () {
            return;
        };
        //---------------------------------------------------------------------------------------------------------//
        function Map(url) {
            var map = parser.parseXML(parser.getXML(url)).querySelector("map"),
                mapChildren = map.childNodes,
                i = 0;
            this.version = map.getAttribute("version");
            this.orientation = map.getAttribute("orientation");
            this.renderOrder = map.getAttribute("renderorder");
            this.width = parseInt(map.getAttribute("width"), 10);
            this.height = parseInt(map.getAttribute("height"), 10);
            this.nextObjectId = parseInt(map.getAttribute("nextobjectid"), 10);
            this.tilesets = [];
            this.layers = [];
            for (i = 0; i < mapChildren.length; i++) {
                switch (mapChildren[i].tagName) {
                case "tileset": this.tilesets.push(new TileSet(mapChildren[i])); break;
                case "layer": this.layers.push(new Layer(mapChildren[i], this.tilesets)); break;
                case "objectgroup": this.layers.push(factory.createObjects(mapChildren[i])); break;
                default: break;
                }
            }
        }
        Map.prototype.update = function () {
            this.layers.forEach(function (layer) {
                if (layer.update) {
                    layer.update();
                } else if (Object.prototype.toString.call(layer) === "[object Array]") {
                    layer.forEach(function (obj) {
                        obj.update();
                    });
                }
            });
        };
        Map.prototype.draw = function (ctx) {
            this.layers.forEach(function (layer) {
                if (layer.draw) {
                    layer.draw(ctx);
                } else if (Object.prototype.toString.call(layer) === "[object Array]") {
                    layer.forEach(function (obj) {
                        if (obj.draw) {
                            obj.draw(ctx);
                        }
                    });
                }
            });
        };
        //---------------------------------------------------------------------------------------------------------//
        exported.imageMap = function () {
            return imageMap;
        };
        exported.inputHandler = function () {
            return inputHandler;
        };
        exported.makeImage = function (name) {
            var args = arguments,
                // The source and destination rectangles are cloned in the ImageObject constructor, so we don't need to here.
                srcRect = (args.length > 1 && shapes.isRect(args[1]) ? args[1] : imageMap.getImgRect(name)),
                destRect = (args.length > 2 && shapes.isRect(args[2]) ? args[2] : imageMap.getImgRect(name));
            return new ImageObject(name, srcRect, destRect);
        };
        exported.makeSprite = function (name, srcRect, destRect, numColumns, numRows, animSpeed) {
            return new SpriteObject(exported.makeImage(name, srcRect, destRect), numColumns, numRows, animSpeed);
        };
        exported.makeButton = function (name, srcRect, destRect, callback) {
            return new ButtonObject(exported.makeImage(name, srcRect, destRect), callback);
        };
        exported.makeAnimMap = function (imageName, animRow, animBegin, animLength, eventType, triggerValues) {
            return new AnimMap(imageName, animRow, animBegin, animLength, eventType, triggerValues);
        };
        exported.makeControlledSprite = function (sprite, arrayAnimMaps) {
            if (sprite instanceof SpriteObject) {
                return new ControlledSpriteObject(sprite, arrayAnimMaps);
            }
            throw new TypeError("game.makeControlledSprite was passed bad value for SpriteObject");
        };
        exported.makePlayer = function (conSprite, moveSpeed) {
            if (conSprite instanceof ControlledSpriteObject && typeof moveSpeed === "number") {
                return new Player(conSprite, moveSpeed);
            }
            throw new TypeError("game.makePlayer requires ControlledSpriteObject and number");
        };
        exported.makeMap = function (url) {
            if (url && typeof url === "string") {
                return new Map(url);
            }
            throw new TypeError("Invalid URL passed to game.makeMap");
        };
        return exported;

    // End of 'game' module.
    }({}));
// End of define function
});
