$(document).ready(function(){
    window.Data = Backbone.Model.extend({

        initialize: function() {
            if (!this.get("label")) {
                this.set({title: "undefined"});
            }
            if (!this.get("amount")) {
                this.set({amount: 0});
            }
            if (!this.get("oid")) {
                this.set({oid: ""});
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
        initialize: function() {
            _.bindAll(this, "setStats", "removeNull");
        },
        comparator: function(data) {
            return data.get("amount");
        },
        setStats: function(stats) {
            this.total = stats.total;
            this.invalid = stats.invalid;
            this.blank = stats.blank;
            this.nonvote = stats.nonvote;
        },
        getTotal: function() {
            return this.total;
        },
        getInvalid: function() {
            return this.invalid;
        },
        getBlank: function() {
            return this.blank;
        },
        getNonvote: function() {
            return this.nonvote;
        },

        removeNull: function(){
        }
    });

    window.DataStore = new DataList;

    window.DataListView = Backbone.View.extend({
        el: $("#holder"),

        initialize: function() {
            _.bindAll(this, "render");
            DataStore.bind('redraw', this.render);
            this.paper = Raphael("holder", 800, 800);
            this.render();
        },

        render: function() {
            this.paper.clear();
            var values = [];
            var labels = [];
            var colors = [];
            var ids    = [];
            DataStore.each(function (data){
                values.push(data.get('amount'));
                labels.push(data.get('label'));
                ids.push(data.get('oid'));
                if(data.get('color')){
                    colors.push(data.get('color'));
                }
            });

            values.push(DataStore.getInvalid());
            labels.push('Nulos');
            colors.push('#444');

            values.push(DataStore.getBlank());
            labels.push('En blanco');
            colors.push('#eee');

            values.push(DataStore.getNonvote());
            labels.push('Abstención');
            colors.push('#000')

            this.paper.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
            this.pie = this.paper.g.piechart(350, 350, 150, values, ids, {legend: labels, legendpos: "east", legendmark: "flower", legendothers: "Otros", colors: colors, stroke: '#ccc'});
            this.pie.hover(function () {
                this.sector.stop();
                this.sector.scale(1.1, 1.1, this.cx, this.cy);
                if (this.label) {
                    this.label[0].stop();
                    this.label[0].scale(1.5);
                    this.label[1].attr({"font-weight": 800});
                }
            }, function () {
                this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
                if (this.label) {
                    this.label[0].animate({scale: 1}, 500, "bounce");
                    this.label[1].attr({"font-weight": 400});
                }
            });
        }
    });

    window.App = new DataListView;
});

