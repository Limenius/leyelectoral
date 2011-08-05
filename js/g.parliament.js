Raphael.fn.g.parliament = function (cx, cy, rmax, rmin, values, opts) {
    var paper = this;
    var chart = this.set();
    var nrow = [];
    var dymin = 1.2;
    var dymax = 2;
    var dx = 1.7;

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

    for (var i = 0; i < total; i++) {
        if (i > nextstop) {
            coloridx ++;
            nextstop += values[coloridx]['value'];
            color = values[coloridx]['color'];
        }
        var cir = paper.circle(seat[i]['posx'] * seat[i]['rrow']+ cx , -seat[i]['posy'] * seat[i]['rrow']+ cy , rp);
        cir.attr({fill: color});
        cir.attr({stroke: "#888"});

    }

}
