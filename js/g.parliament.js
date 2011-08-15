Raphael.fn.g.parliament = function (cx, cy, rmax, rmin, values, opts) {
    var paper = this;
    var chart = this.set();
    var nrow = [];
    var dymin = 1.2;
    var dymax = 2;
    var dx = 1.7;
    var covers = [];
    var cover2legends = [];

    var nt = 0;
    var nf = 1;

    var rpmax = 26;
    var rpmin = 2;

    var lim = 0;

    var ntmin = 0;
    var ntmax = 0;

    var total = 0;

    for ( var i = 0; i < values.length; i++) {
        total += values[i]['value'];
    }

    while (ntmin > total || ntmax < total) {
        nt = 0;
        ntmin = 0;
        ntmax = 0;

        rp = ( rpmax + rpmin ) / 2;
        nf = Math.floor((rmax - rmin) / (2 * dx * rp));
        cdmin = 2 * dymin * rp;
        cdmax = 2 * dymax * rp;

        cu = 2 * dx * rp;

        for (i = 0; i < nf; i++) {
            ntmin += Math.floor( (Math.PI * (rmin + cu * i) )/ (cdmax) );
            ntmax += Math.floor( (Math.PI * (rmin + cu * i) )/ (cdmin) );
        }

        if ( ntmin > total ) {
            rpmin = rp;
        }else if ( ntmax < total ) {
            rpmax = rp;
        }
        lim ++;

        if (lim > 20) {
            alert(total);
            break;
        }

    }

    lim = 0;
    while (nt != total) {
        nt = 0;
        dy = ( dymax + dymin ) / 2;
        nf = Math.floor((rmax - rmin) / (2 * dx * rp));

        cd = 2 * dy * rp;
        cu = 2 * dx * rp;

        for (i = 0; i < nf; i++) {
            nt += Math.floor( (Math.PI * (rmin + cu * i) )/ cd );
        }

        if ( nt > total ) {
            dymin = dy;
        }else if ( nt < total ) {
            dymax = dy;
        }

        lim ++;

        if (lim > 20) {
            alert(total);
            break;
        }
    }

    nt = 0;
    for (i = 0; i < nf; i++) {
        nrow.push(Math.floor( (Math.PI * (rmin + cu * i) )/ (2 * dy * rp) ));
        nt += nrow[i];
    }

    var seat = [];

    for (var i = 0; i < nf; i++) {
        var diffang = Math.PI / (nrow[i] - 1);
        var rrow = rmin + i*2*dx*rp;
        for (var j = 0; j < nrow[i]; j++) {
            seat.push({
                posx : Math.cos(diffang * j),
                posy : Math.sin(diffang * j),
                rrow : rrow,
                ang : diffang * j,
            });

        }

    }

    seat.sort(function(a, b){
        return (b['ang'] - a['ang']);
    });

    coloridx = 0;
    var nextstop = values[coloridx]['value'];

    var color = values[coloridx]['color'];

    var legends = [];
    legends.push(values[coloridx]['label']);

    for (var i = 0; i < total; i++) {
        if (i === nextstop) {
            coloridx ++;
            nextstop += values[coloridx]['value'];
            color = values[coloridx]['color'];
            legends.push(values[coloridx]['label']);
        }
        var cir = paper.circle(seat[i]['posx'] * seat[i]['rrow']+ cx , -seat[i]['posy'] * seat[i]['rrow']+ cy , rp);
        cir.attr({fill: color});
        cir.attr({stroke: "#888"});
        var cir2cover = 
        covers.push(paper.circle(seat[i]['posx'] * seat[i]['rrow']+ cx , -seat[i]['posy'] * seat[i]['rrow']+ cy , rp * 2 ).attr(this.g.shim));
        cover2legends.push(coloridx);

    }

    var legend = function(labels, mark, dir){
        var x = cx + rmax + rmax / 3,
            y = cy,
            h = y + 10;
        labels = labels || [];
        dir = (dir && dir.toLowerCase && dir.toLowerCase()) || "east";
        mark = paper.g.markers[mark && mark.toLowerCase()] || "disc";
        chart.labels = paper.set(); 
        for (var i = 0; i < labels.length; i++) {
            var percent = values[i]['value'] * 100/total;
            var clr = values[i]['color'],
                txt;
            chart.labels.push(paper.set());
            chart.labels[i].push(paper.g[mark](x + 5, h, 5).attr({fill: clr, stroke: "none"}));
            chart.labels[i].push(txt = paper.text(x + 20, h, labels[i] + ": " + values[i]['value'] + " - " + percent.toFixed(2) +"%").attr(paper.g.txtattr).attr({fill: "#000", "text-anchor": "start"}));
            h += txt.getBBox().height * 1.2;
        }
        var bb = chart.labels.getBBox(),
            tr = [-50, -bb.height ];
        chart.labels.translate.apply(chart.labels, tr);
        chart.push(chart.labels);
    }

    legend(legends, 'flower', 'east');
    chart.covers = covers;
    chart.hover = function(fin, fout) {
        fout = fout || function () {};
        var that = this;
        for (var i = 0; i < covers.length; i++) {
            (function (cover, j) {
                var o = {
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    value: values[j],
                    label: that.labels && that.labels[cover2legends[j]],
                };
                cover.mouseover(function () {
                    fin.call(o);
                }).mouseout(function () {
                    fout.call(o);
                });
            })(covers[i], i);
        }
        return this;
    }

    return chart;

}
