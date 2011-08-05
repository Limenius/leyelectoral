Raphael.fn.g.piechart = function (cx, cy, r, rvalues, ids, opts) {
    opts = opts || {};
    var paper = this,
        sectors = [],
        covers = this.set(),
        chart = this.set(),
        series = this.set(),
        accessor = new Array(),
        values = new Array(),
        order = [],
        len = rvalues.length,
        angle = 0,
        total = 0,
        others = 0,
        cut = 1000,
        defcut = true;
    chart.covers = covers;
    if (len == 1) {
        series.push(this.circle(cx, cy, r).attr({fill: this.g.colors[0], stroke: opts.stroke || "#fff", "stroke-width": opts.strokewidth == null ? 1 : opts.strokewidth}));
        covers.push(this.circle(cx, cy, r).attr(this.g.shim));
        total = rvalues[0];
        values[0] = {value: rvalues[0], order: 0, valueOf: function () { return this.value; }};
        series[0].middle = {x: cx, y: cy};
        series[0].mangle = 180;
    } else {
        function sector(cx, cy, r, startAngle, endAngle, fill) {
            var rad = Math.PI / 180,
                x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad),
                ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
                diffangle = Math.abs((-360 + endAngle - startAngle)%360),
                res = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(diffangle > 180), 1, x2, y2, "z"];

            res.middle = {x: xm, y: ym};
            return res;
        }
        for (var i = 0; i < len; i++) {
            total += rvalues[i];
            values[i] = {value: rvalues[i], id: ids[i], color: opts.colors[i], order: i, valueOf: function () { return this.value; }};
        }
        values.sort(function (a, b) {
            return b.value - a.value;
        });
        rvalues.sort(function (a,b) {
            return b - a;
        });

        for (i = 0; i < len; i++) {
            if (defcut && values[i] * 360 / total <= 1.5) {
                cut = i;
                defcut = false;
            }
            if (i > cut) {
                defcut = false;
                values[cut].value += values[i];
                values[cut].others = true;
                others = values[cut].value;
            }
        }
        len = Math.min(cut + 1, values.length);
        others && values.splice(len) && (values[cut].others = true);
        for (i = 0; i < len; i++) {
            var mangle = angle - 360 * values[i] / total / 2;
            if (!i) {
                angle = 90 - mangle;
                mangle = angle - 360 * values[i] / total / 2;
            }
            if (opts.init) {
                var ipath = sector(cx, cy, 1, angle, angle - 360 * values[i] / total).join(",");
            }
            var path = sector(cx, cy, r, angle, angle -= 360 * values[i] / total);
            var p = this.path(opts.init ? ipath : path).attr({fill: values[i].color || this.g.colors[i] || "#666", stroke: opts.stroke || "#fff", "stroke-width": (opts.strokewidth == null ? 1 : opts.strokewidth), "stroke-linejoin": "round"});
            p.node.id = values[i].id;
            p.value = values[i];
            p.middle = path.middle;
            p.mangle = mangle;
            sectors.push(p);
            series.push(p);
            opts.init && p.animate({path: path.join(",")}, (+opts.init - 1) || 1000, ">");
            accessor[values[i].id] = i;
        }
        for (i = 0; i < len; i++) {
            p = paper.path(sectors[i].attr("path")).attr(this.g.shim);
            p.node.id = values[i].id+"cover";
            opts.href && opts.href[i] && p.attr({href: opts.href[i]});
            covers.push(p);
        }
    }

    chart.hover = function (fin, fout) {
        fout = fout || function () {};
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (sector, cover, j) {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: sector.middle.x,
                    my: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                };
                cover.mouseover(function () {
                    fin.call(o);
                }).mouseout(function () {
                    fout.call(o);
                });
            })(series[i], covers[i], i);
        }
        return this;
    };

    chart.animationElements = [];
    chart.animateSector = function(index, newPath, ms, callback){
        var that = this;
        var sectorangle = function(x0,y0){
            if (x0 > cx && y0 < cy) {
                var angle = - Math.asin((y0-cy)/r) * (180/Math.PI);
            }else if(x0 > cx && y0 > cy){
                var angle = - Math.asin((y0-cy)/r) * (180/Math.PI);
            }else if(x0 < cx && y0 < cy){
                var angle = 180 + Math.asin((y0-cy)/r) * (180/Math.PI);
            }else{
                var angle = -180 + Math.asin((y0-cy)/r) * (180/Math.PI);
            }
            return angle;
        }
        var animationElements = chart.animationElements;
        animation = function () {
            var Now = +new Date;
            for (var l = 0; l < animationElements.length; l++) {
                var e = animationElements[l];
                if (e.stop || e.el.removed) {
                    continue;
                }
                var time = Now - e.start,
                    ms = e.ms,
                    easing = e.easing,
                    from = e.from,
                    diff = e.diff,
                    to = e.to,
                    t = e.t,
                    that = e.el,
                    set = {},
                    now;
                var initangle0 = sectorangle(from['path'][1][1],from['path'][1][2]);
                var finalangle0 = sectorangle(from['path'][2][6],from['path'][2][7]);
                var initangle1 = sectorangle(to['path'][1][1],to['path'][1][2]);
                var finalangle1 = sectorangle(to['path'][2][6],to['path'][2][7]);

                var diffinitangle = ((initangle1 - initangle0));
                if(diffinitangle>180){diffinitangle = diffinitangle - 360}
                else if(diffinitangle<-180){diffinitangle = diffinitangle + 360}
                var difffinalangle = ((finalangle1 - finalangle0));
                if(difffinalangle>180){difffinalangle = difffinalangle - 360}
                else if(difffinalangle<-180){difffinalangle = difffinalangle + 360}
                var nowinitangle0 = 0;
                var nowfinalangle0 = 0;


                if (time < ms) {
                    var pos = time / ms;
                    nowinitangle = (diffinitangle * pos + initangle0);
                    if(nowinitangle>180){nowinitangle = nowinitangle - 360}
                    else if(nowinitangle<-180){nowinitangle = nowinitangle + 360}
                    nowfinalangle = (difffinalangle * pos + finalangle0) % 360;
                    if(nowfinalangle>180){nowfinalangle = nowfinalangle - 360}
                    else if(nowfinalangle<-180){nowfinalangle = nowfinalangle + 360}
                    nowSector = sector(cx, cy, r, nowinitangle, nowfinalangle).join(" ");
                    //console.log(from['path'][1][2] + " " + initangle0 + " " + finalangle0 + " " + initangle1 + " " + finalangle1 + " " + nowinitangle + " " + nowfinalangle);
                    //console.log(from['path'] + " " + to['path']);
                    set['path'] = nowSector;
                    that.attr(set);
                    that._run && that._run.call(that);
                }else{
                    that.attr(to);
                    animationElements.splice(l--,1);
                    if (animationElements.length === 0 && callback){
                        callback();
                    }
                }
            }
            this.svg && that && that.paper && that.paper.safari();
            animationElements[length] && setTimeout(animation);
        },


        from = {};
        to = {};
        el = this.series[index];
        from['path'] = el.attr("path");
        newPath = [["M",newPath[1],newPath[2]],["L",newPath[4],newPath[5]],["A",newPath[7],newPath[8],newPath[9],newPath[10],newPath[11],newPath[12],newPath[13]],["Z"]];
        to["path"] = newPath;
        diff = {};
        diff["path"] = [];
        for (var i = 0, ii = from["path"].length; i < ii; i++) {
            diff["path"][i] = [0];
            for (var j = 1, jj = from["path"][i].length; j < jj; j++) {
                diff["path"][i][j] = (newPath[i][j] - from["path"][i][j]) / ms;
            }
        }
        animationElements.push({
            start: +new Date,
            ms: ms,
            easing: ">",
            from: from,
            diff: diff,
            to: to,
            el: this.series[index],
            t: {x: 0, y: 0},
            callback: callback
        });
        setTimeout(animation);

    };

    chart.remove = function (id, callback){
        var that = this;
        var nSector = accessor[id];
        var rSector = this.series[nSector];
        var reorder = function(){
            that.series[nSector].remove();
            that.covers[nSector].remove();
            that.series.items.splice(nSector,1);
            that.covers.items.splice(nSector,1);
            values.splice(nSector,1);
            total = 0;
            len--;
            for (var i = 0; i < len; i++) {
                total += values[i];
            }
            //values.sort(function (a, b) {
            //    return b.value - a.value;
            //});
            angle = 0;
            for (var i = 0; i < len; i++) {
                var mangle = angle - 360 * values[i] / total / 2;
                if (!i) {
                    angle = 90 - mangle;
                    mangle = angle - 360 * values[i] / total / 2;
                }
                newSector = sector(cx, cy, r, angle, angle -= 360 * values[i] / total);
                if(i>=nSector){
                    var j = i+1;
                }else{
                    var j = i;
                }
                that.covers[j].attr('path', newSector);
                that.animateSector(j, newSector, 1000, callback);
            }
        };
        rSector.animate({"80%":{translation: ((rSector.middle.x-cx)/1.5)+","+((rSector.middle.y-cy)/1.5), easing: ">"}, "100%":{fill: "#eee", opacity: "0", easing: ">", callback: reorder}} ,1000);

    };

    // x: where label could be put
    // y: where label could be put
    // value: value to show
    // total: total number to count %
    chart.each = function (f) {
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (sector, cover, j) {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    x: sector.middle.x,
                    y: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                };
                f.call(o);
            })(series[i], covers[i], i);
        }
        return this;
    };
    chart.click = function (f) {
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (sector, cover, j) {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: sector.middle.x,
                    my: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                };
                cover.click(function () { f.call(o); });
            })(series[i], covers[i], i);
        }
        return this;
    };
    chart.inject = function (element) {
        element.insertBefore(covers[0]);
    };
    var legend = function (labels, otherslabel, mark, dir) {
        var x = cx + r + r / 5,
            y = cy,
            h = y + 10;
        labels = labels || [];
        dir = (dir && dir.toLowerCase && dir.toLowerCase()) || "east";
        mark = paper.g.markers[mark && mark.toLowerCase()] || "disc";
        chart.labels = paper.set();
        for (var i = 0; i < len; i++) {
            var clr = series[i].attr("fill"),
                j = values[i].order,
                txt;
            values[i].others && (labels[j] = otherslabel || "Others");
            labels[j] = paper.g.labelise(labels[j], values[i], total);
            chart.labels.push(paper.set());
            chart.labels[i].push(paper.g[mark](x + 5, h, 5).attr({fill: clr, stroke: "none"}));
            chart.labels[i].push(txt = paper.text(x + 20, h, labels[j] || values[j]).attr(paper.g.txtattr).attr({fill: opts.legendcolor || "#000", "text-anchor": "start"}));
            covers[i].label = chart.labels[i];
            h += txt.getBBox().height * 1.2;
        }
        var bb = chart.labels.getBBox(),
            tr = {
                east: [0, -bb.height / 2],
                west: [-bb.width - 2 * r - 20, -bb.height / 2],
                north: [-r - bb.width / 2, -r - bb.height - 10],
                south: [-r - bb.width / 2, r + 10]
            }[dir];
        chart.labels.translate.apply(chart.labels, tr);
        chart.push(chart.labels);
    };
    if (opts.legend) {
        legend(opts.legend, opts.legendothers, opts.legendmark, opts.legendpos);
    }
    chart.push(series, covers);
    chart.series = series;
    chart.covers = covers;
    chart.accessor = accessor;
    return chart;
};
