Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    var angle = 0,
        total = 0,
        start = 0,
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total,
                popangle = angle + (angleplus / 2),
                color = "hsb(" + start + ", 1, .5)",
                ms = 500,
                delta = 30,
                bcolor = "hsb(" + start + ", 1, 1)",
                p = sector(cx, cy, r, angle, angle + angleplus, {gradient: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 2}),
                txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-family": 'Fontin-Sans, Arial', "font-size": "20px"});
            p.mouseover(function () {
                p.animate({scale: [1.1, 1.1, cx, cy]}, ms, "elastic");
                txt.animate({opacity: 1}, ms, "elastic");
            }).mouseout(function () {
                p.animate({scale: [1, 1, cx, cy]}, ms, "elastic");
                txt.animate({opacity: 0}, ms);
            });
            angle += angleplus;
            chart.push(p);
            chart.push(txt);
            start += .1;
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (var i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};


$(function(){
    window.Data = Backbone.Model.extend({

        initialize: function() {
            if (!this.get("people")) {
                this.set({"people": 0});
            }
            if (!this.get("votes")) {
                this.set({"votes": 0});
            }
            if (!this.get("blank")) {
                this.set({"blank": 0});
            }
            if (!this.get("invalid")) {
                this.set({"invalid": 0});
            }
            if (!this.get("parties")) {
                this.set({parties:{}});
            }
        },

    });

    window.DataView = Backbone.View.extend({
        events: {
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.model.view = this;

        },
        render: function() {
            return this;
        },
    });

    window.DataList = Backbone.Collection.extend({
        model: Data,
        url: "/data",
    });

    window.DataListView = Backbone.View.extend({
        el: $("#holder"),

        initialize: function() {
            _.bindAll(this);
        },
    });

    window.DataStore = new DataList;
    window.App = new DataListView;
});

