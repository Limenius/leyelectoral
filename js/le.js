$(document).ready(function(){
    Backbone.Partyres = function(attributes, options) {
        attributes || (attributes = {});
        this.attributes = {};
        this.set(attributes);
        if (!this.get("label")) {
            this.set({title: "undefined"});
        }
        if (!this.get("amount")) {
            this.set({amount: 0});
        }
        if (!this.get("statistical")) {
            this.set({statistical: false});
        }
        if (!this.get("oid")) {
            this.set({oid: ""});
        }

    };

    _.extend(Backbone.Partyres.prototype, {

        get : function(attr) {
            return this.attributes[attr];
        },

        set : function(attrs, options) {
            for (var attr in attrs) {
                this.attributes[attr] = attrs[attr];
            }

            return this;
        },

    });

    window.Data = Backbone.Model.extend({
        initialize: function() {
            if (!this.get("provincia")) {
                this.set({title: "undefined"});
            }
            this.rows = [];
        },

        addRow : function(attributes) {
            this.rows.push(new Backbone.Partyres(attributes));

        },
        getRow: function(oid) {
            return _.detect(this.rows, function(data){
                var dat = data.get('oid');
                return data.get('oid') === oid;
            });
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
            _.bindAll(this,"getTotal", "getExceptTotal", "calculateTotal", "getProv");
        },

        getProv: function(name) {
            return this.detect(function(data){
                return data.get('provincia') === name;
            });
        },

        getTotal: function() {
            return this.detect(function(data){
                return data.get('provincia') === 'total';
            });
        },

        getExceptTotal: function() {
            return this.reject(function(data){ return data.get('provincia') === 'total' });
        },

        calculateTotal: function() {
            if (!this.getTotal()) {
                var total = {};
                this.add({
                    provincia : "total"
                });
                var total = this.getTotal();
                this.each(function(data) {
                    for (var i = 0; i < data.rows.length; i++) {

                        var result = _.detect(total.rows, function(row) {return row.get('oid') === data.rows[i].get("oid");})
                        if (result) {
                            result.set({"amount": result.get("amount") + data.rows[i].get("amount")});
                        } else {
                            total.addRow({
                                label: data.rows[i].get("label"),
                                color: data.rows[i].get("color"),
                                amount: data.rows[i].get("amount"),
                                oid: data.rows[i].get("oid"),
                                statistical: data.rows[i].get("statistical"),
                            });
                        }
                    };
                });
            }
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
            DataStore.calculateTotal();
            var total = DataStore.getTotal();
            var parties = _.select(total.rows, function (row){
                return row.get('statistical') == false;
            });
            _.each(parties, function(party) {
                values.push(party.get('amount'));
                labels.push(party.get('label'));
                ids.push(party.get('oid'));
                if(party.get('color')){
                    colors.push(party.get('color'));
                }
            });

            values.push(total.getRow('invalid').get('amount'));
            labels.push('Nulos');
            colors.push('#444');
            ids.push('Nulos');

            values.push(total.getRow('blank').get('amount'));
            labels.push('En blanco');
            colors.push('#eee');
            ids.push('Blanco');

            values.push(total.getRow('nonvote').get('amount'));
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

