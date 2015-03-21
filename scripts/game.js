define(["scripts/shapes.js"], function (shapes) {
    "use strict";
    return (function (exported) {

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
                        ele = document.createElement("IMG");
                        ele.src = imgSrc;
                        imgMap[key] = ele;
                        return;
                    }
                    throw new TypeError("imageMap.set requires string type, recieved: " + imgSrc.toString());
                },
                draw = function (ctx, name, srcRect, destRect) {
                    if (ctx) {
                        if (imgMap.hasOwnProperty(name)) {
                            ctx.drawImage(imgMap[name], srcRect.x, srcRect.y, srcRect.w, srcRect.h, destRect.x, destRect.y, destRect.w, destRect.h);
                        } else {
                            throw new ReferenceError("imageMap (draw) does not contain property: " + name);
                        }
                    } else {
                        throw new ReferenceError("imageMap (draw) was passed invalid CanvasRenderingContext2D");
                    }
                };
            return {
                get : get,
                set : set,
                draw : draw
            };
        }()),
            parser;

        function MapTile(name, srcRect, destRect) {
            this.name = name;
            this.srcRect = srcRect.clone();
            this.destRect = destRect.clone();
        }
        MapTile.prototype.draw = function (ctx) {
            var args = arguments,
                offset = (args.length > 1 ? args[1] : shapes.makeVector(0, 0));
            imageMap.draw(ctx, this.name, this.srcRect, this.destRect.topLeft(offset));
        };

        parser = (function () {
            var getXML = function (url) {
                var req = new XMLHttpRequest(),
                    result = "";
                req.onload = function () {
                    if (this.status === 200) {
                        result = this.responseText;
                    } else {
                        throw new Error("getXML failure, status:" + this.status + ". Error: " + this.statusText);
                    }
                };
                req.open("get", url, false);
                req.send();
                return result;
            },
                parseXML = function (xml) {
                    var parse, result;
                    if (window.DOMParser) {
                        parse = new DOMParser();
                        result = parse.parseFromString(xml, "text/xml");
                    } else {
                        // Internet Explorer
                        result = new ActiveXObject("Microsoft.XMLDOM");
                        result.async = false;
                        result.loadXML(xml);
                    }
                    return result;
                },
                // Check from presence of integer in passed string, returns the value as Number type,
                // pass the value 'true' as second argument to throw an exception when the parseInt call
                // fails to produce a number
                checkInt = function (str) {
                    var result,
                        args = arguments;
                    if (typeof str === "string" && /^\d+$/.test(str)) {
                        result = parseInt(str, 10);
                        if (!isNaN(result)) {
                            return result;
                        }
                        if (args.length > 1 && args[1] === true) {
                            throw new TypeError("parser.checkInt encountered value not convertible to int: " + result);
                        }
                    }
                    return str;
                },
                parseTiles = function (xml) {
                    var result = [],
                        data = xml.getElementsByTagName("tileset"),
                        i = 0,
                        temp,
                        img;
                    for (i = 0; i < data.length; i++) {
                        // Collect the properties into an object
                        temp = {};
                        img = data[i].getElementsByTagName("image")[0];
                        temp.firstGid = parseInt(data[i].getAttribute("firstgid"), 10);
                        temp.name = data[i].getAttribute("name");
                        temp.tileWidth = parseInt(data[i].getAttribute("tilewidth"), 10);
                        temp.tileHeight = parseInt(data[i].getAttribute("tileheight"), 10);
                        temp.spacing = (data[i].hasAttribute("spacing") ? data[i].getAttribute("spacing") : 0);
                        temp.margin = (data[i].hasAttribute("margin") ? data[i].getAttribute("margin") : 0);
                        temp.source = img.getAttribute("source");
                        temp.width = parseInt(img.getAttribute("width"), 10);
                        temp.height = parseInt(img.getAttribute("height"), 10);
                        temp.columns = Math.floor(temp.width / temp.tileWidth);
                        temp.rows = Math.floor(temp.height / temp.tileHeight);
                        // Push the object into an array for return.
                        result.push({firstGid: temp.firstGid, name: temp.name, source: temp.source, tileWidth: temp.tileWidth, tileHeight: temp.tileHeight, spacing: temp.spacing, margin: temp.margin, width: temp.width, height: temp.height, numColumns: temp.columns, numRows: temp.rows});
                        // Create and store the needed image elements in imageMap.
                        imageMap.set(temp.name, temp.source);
                    }
                    return result;
                },
                parseLayers = function (xml) {
                    var result = [],
                        data = xml.getElementsByTagName("layer"),
                        tiles,
                        temp,
                        i = 0,
                        gridSet = function (ele, vec) {
                            this.grid.set(vec, parseInt(tiles[vec.x + vec.y * this.width].getAttribute("gid"), 10));
                        };
                    for (i = 0; i < data.length; i++) {
                        temp = {};
                        temp.name = data[i].getAttribute("name");
                        temp.width = parseInt(data[i].getAttribute("width"), 10);
                        temp.height = parseInt(data[i].getAttribute("height"), 10);
                        temp.grid = shapes.makeGrid(temp.width, temp.height);
                        tiles = data[i].getElementsByTagName("tile");
                        temp.grid.forEach(gridSet, temp);
                        result.push({name: temp.name, width: temp.width, height: temp.height, grid: temp.grid});
                    }
                    return result;
                },
                parseObjects = function (xml) {
                    var result = [],
                        data = xml.getElementsByTagName("objectgroup"),
                        objGroup,
                        objs,
                        obj,
                        props,
                        prop,
                        i = 0,
                        j = 0,
                        k = 0;
                    for (i = 0; i < data.length; i++) {
                        objGroup = {};
                        objGroup.name = data[i].getAttribute("name");
                        objs = data[i].getElementsByTagName("object");
                        objGroup.objects = [];
                        for (j = 0; j < objs.length; j++) {
                            obj = {};
                            obj.id = checkInt(objs[j].getAttribute("id"), true);
                            obj.name = objs[j].getAttribute("name");
                            obj.type = objs[j].getAttribute("type");
                            obj.x = checkInt(objs[j].getAttribute("x"), true);
                            obj.y = checkInt(objs[j].getAttribute("y"), true);
                            obj.w = checkInt(objs[j].getAttribute("width"), true);
                            obj.h = checkInt(objs[j].getAttribute("height"), true);
                            props = objs[j].getElementsByTagName("property");
                            prop = {};
                            for (k = 0; k < props.length; k++) {
                                prop[props[k].getAttribute("name")] = checkInt(props[k].getAttribute("value"), true);
                            }
                            objGroup.objects.push({id: obj.id, name: obj.name, type: obj.type, x: obj.x, y: obj.y, w: obj.w, h: obj.h, properties: prop});
                        }
                        result.push({group: objGroup.name, objects: objGroup.objects});
                    }
                    return result;
                },
                // Turn map.layers into an array of grids containing Image name, source rectangle, and destination rectangle
                mapMap = function (map) {
                    var i = 0,
                        layers = map.layers,
                        tiles = map.tilesets,
                        tempGrid,
                        result = [],
                        tile,
                        gid,
                        getTileFromGid = function (gid, tiles) {
                            var j = 0;
                            for (j = 1; j < tiles.length; j++) {
                                if (gid >= tiles[j - 1].firstGid && gid < tiles[j].firstGid) {
                                    return tiles[j - 1];
                                }
                            }
                            if (tiles[j - 1]) {
                                return tiles[j - 1];
                            }
                            throw new ReferenceError("createInfo encountered unrecognized gid: " + gid);
                        },
                        getSrcRect = function (gid, tile) {
                            var num = gid - tile.firstGid,
                                x = 0,
                                y = 0;
                            if (num < 0) {
                                throw new TypeError("createInfo encountered negative indexed gid: " + gid);
                            }
                            x = tile.margin + (num % tile.numColumns) * (tile.tileWidth + tile.spacing);
                            y = tile.margin + Math.floor(num / tile.numColumns) * (tile.tileHeight + tile.spacing);
                            return shapes.makeRect(x, y, tile.tileWidth, tile.tileHeight);
                        },
                        getDestRect = function (vec, tile) {
                            return shapes.makeRect(vec.x * tile.tileWidth, vec.y * tile.tileHeight, tile.tileWidth, tile.tileHeight);
                        },
                        gridSet = function (ele, vec) {
                            gid = layers[i].grid.get(vec);
                            if (gid > 0) {
                                tile = getTileFromGid(gid, tiles);
                                this.set(vec, new MapTile(tile.name, getSrcRect(gid, tile), getDestRect(vec, tile)));
                            } else {
                                this.set(vec, null);
                            }
                        };
                    for (i = 0; i < layers.length; i++) {
                        tempGrid = shapes.makeGrid(layers[i].grid.width, layers[i].grid.height);
                        tempGrid.forEach(gridSet, tempGrid);
                        result.push(tempGrid);
                    }
                    return result;
                },
                parseMap = function (url) {
                    var xml = parseXML(getXML(url)),
                        mapEle = xml.getElementsByTagName("map")[0],
                        result = {};
                    result.version = mapEle.getAttribute("version");
                    result.orientation = mapEle.getAttribute("orientation");
                    result.width = mapEle.getAttribute("width");
                    result.height = mapEle.getAttribute("height");
                    result.tileWidth = mapEle.getAttribute("tilewidth");
                    result.tileHeight = mapEle.getAttribute("tileheight");
                    result.layers = parseLayers(xml);
                    result.tilesets = parseTiles(xml);
                    result.objectGroups = parseObjects(xml);
                    return result;
                };

            return {
                parseMap: parseMap,
                mapMap : mapMap
            };
        }());

        function Map(url, cnvsRect) {
            this.info = parser.parseMap(url);
            this.mapTiles = parser.mapMap(this.info);
            this.tilesRect = shapes.makeRect(Math.round(cnvsRect.x / this.info.tileWidth), Math.round(cnvsRect.y / this.info.tileHeight), Math.floor(cnvsRect.w / this.info.tileWidth), Math.floor(cnvsRect.h / this.info.tileWidth));
            this.destRect = cnvsRect.clone();
        }
        Map.prototype.draw = function (ctx) {
            var offsetX = 0, offsetY = 0;
            this.mapTiles.forEach(function (grid) {
                grid.forEach(function (mapTile, vec) {
                    offsetX = (vec.x * this.info.tileWidth) - (this.tilesRect.x * this.info.tileWidth) - (this.destRect.x % this.info.tileWidth);
                    offsetY = (vec.y * this.info.tileHeight) - (this.tilesRect.y * this.info.tileHeight) - (this.destRect.y % this.info.tileHeight);
                    if (mapTile instanceof MapTile && vec.inside(this.tilesRect)) {
                        mapTile.draw(ctx, shapes.makeVector(offsetX, offsetY));
                        mapTile.destRect.stroke(ctx);
                    }
                }, this);
            }, this);
        };
        Map.prototype.position = function () {
            var args = arguments;
            if (args.length > 0) {
                if (args[0].hasOwnProperty("x") && args[0].hasOwnProperty("y")) {
                    this.tilesRect.equals(shapes.makeVector(Math.ceil(args[0].x / this.info.tileWidth), Math.ceil(args[0].y / this.info.tileHeight)));
                    this.destRect.equals(args[0].clone());
                    return this;
                }
                throw new TypeError("Map.position setter requires Vector argument");
            }
            return shapes.makeVector(this.destRect.x, this.destRect.y);
        }

        exported.makeMap = function (url, cnvsRect) {
            if (typeof url === "string") {
                return new Map(url, cnvsRect);

            }
            throw new TypeError("game.makeMap requires valid url string");
        };
        exported.imageMap = function () {
            return imageMap;
        };

        return exported;
    }({}));
});
