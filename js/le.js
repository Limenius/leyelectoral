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

        events: {
            "click #gonext":  "goNext"
        },

        initialize: function() {
            _.bindAll(this, "render", "remove", "initial", "setupPaper", "goNext");
            DataStore.bind('redraw', this.render);
            this.paper = Raphael("holder", 960, 800);
            this.cx = 200
            this.cy = 350;
        },

        goNext: function() {
            this.advance();
        },


        remove: function(id, callback) {
            that = this;
            this.pie.remove(id, callback);
        },

        setupPaper: function(values, ids, labels, colors) {
            this.paper.clear();
            this.paper.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
            this.pie = this.paper.g.piechart(this.cx, this.cy, 120, values, ids, {legend: labels, legendpos: "east", legendmark: "flower", legendothers: "Otros", colors: colors, stroke: '#eee', strokewidth: 1});
            this.pie.hover(function () {
                if (this.label) {
                    this.label[0].stop();
                    this.label[0].scale(1.5);
                    this.label[1].attr({"font-weight": 800});
                }
            },
            function () {
                this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
                if (this.label) {
                    this.label[0].animate({scale: 1}, 500, "bounce");
                    this.label[1].attr({"font-weight": 400});
                }
            });
        },

        initial: function() {
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
            ids.push('Nulos');

            values.push(DataStore.getBlank());
            labels.push('En blanco');
            colors.push('#eee');
            ids.push('Blanco');

            values.push(DataStore.getNonvote());
            labels.push('Abstención');
            colors.push('#000')
            ids.push('Abstencion');

            this.setupPaper(values, ids, labels, colors);

            var that = this;

            this.advance = function(){ return that.remove("Abstencion", function(){ return that.step2();});};
        },

        step2: function() {
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
            ids.push('Nulos');

            values.push(DataStore.getBlank());
            labels.push('En blanco');
            colors.push('#eee');
            ids.push('Blanco');

            this.setupPaper(values, ids, labels, colors);
            var that = this;

            this.advance = function(){ return that.remove("Blanco", function(){ return that.step2bis();});};
        },

        step2bis: function() {
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
            ids.push('Nulos');

            this.setupPaper(values, ids, labels, colors);
            this.remove("Nulos", function(){that.step3()});

            var that = this;
        },
        step3: function() {
            var values = [];
            var labels = [];
            var colors = [];
            var ids    = [];

            parvalues = [];

            DataStore.each(function (data){
                values.push(data.get('amount'));
                labels.push(data.get('label'));
                ids.push(data.get('oid'));
                if(data.get('color')){
                    colors.push(data.get('color'));
                }
                var val = Math.floor(data.get('amount')/5000);
                if (val !=0 ){
                    parvalues.push({ value: val, color: data.get('color')} );
                }
            });

            this.setupPaper(values, ids, labels, colors);
            parliament = this.paper.g.parliament(650, 450, 200, 70, parvalues, {});
            var that = this;

            this.advance = function(){ return that.remove("Blanco", function(){ return that.step2bis();});};
        },

        render: function() {
            this.initial();
        },
    });

    window.App = new DataListView;
});

