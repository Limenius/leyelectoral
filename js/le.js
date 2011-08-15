$(document).ready(function(){
    var circunscripciones = {
        "Burgos": 4,
        "León": 5,
        "Palencia": 3,
        "Salamanca": 4,
        "Segovia": 3,
        "Soria": 2,
        "Valladolid": 5,
        "Zamora": 3,
        "Girona": 6,
        "Lleida": 4,
        "Tarragona": 6,
        "Badajoz": 6,
        "Cáceres": 4,
        "A Coruña": 8,
        "Ourense": 4,
        "Pontevedra": 7,
        "Madrid": 35,
        "Navarra": 5,
        "Álava": 4,
        "Guipúzcoa": 6,
        "Vizcaya": 8,
        "Murcia": 10,
        "La Rioja": 4,
        "Alicante / Alacant": 12,
        "Castellón / Castelló": 5,
        "Valencia / València": 16,
        "Ceuta": 1,
        "Melilla": 1,
        "Almería": 6,
        "Cádiz": 9,
        "Córdoba": 6,
        "Granada": 7,
        "Huelva": 5,
        "Jaén": 6,
        "Málaga": 10,
        "Sevilla": 12,
        "Huesca": 3,
        "Teruel": 3,
        "Zaragoza": 7,
        "Asturias": 8,
        "Illes Balears": 8,
        "Las Palmas": 8,
        "Santa Cruz de Tenerife": 7,
        "Cantabria": 5,
        "Albacete": 4,
        "Ciudad Real": 5,
        "Cuenca": 3,
        "Guadalajara": 3,
        "Toledo": 6,
        "Ávila": 3,
        "Barcelona": 31,
        "Lugo": 4,
    }

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
            _.bindAll(this, "render", "remove", "initial", "setupPaper", "goNext", "drawParties", "dhont");
            DataStore.bind('redraw', this.render);
            this.paper = Raphael("holder", 1000, 800);
            this.cx = 150
            this.cy = 350;
        },

        goNext: function() {
            this.advance();
        },


        remove: function(id, callback) {
            that = this;
            this.pie.remove(id, callback);
        },

        setupPaper: function(drawable) {
            this.paper.clear();
            this.paper.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
            this.pie = this.paper.g.piechart(this.cx, this.cy, 120, drawable['values'], drawable['ids'], {legend: drawable['labels'], legendpos: "east", legendmark: "flower", legendothers: "Otros", colors: drawable['colors'], stroke: '#eee', strokewidth: 1});
            this.pie.hover(function () {
                if (this.label) {
                    this.label[0].stop();
                    this.label[0].scale(1.5);
                    this.label[1].attr({"font-weight": 800});
                }
            },
            function () {
                if (this.label) {
                    this.label[0].animate({scale: 1}, 500, "bounce");
                    this.label[1].attr({"font-weight": 400});
                }
            });
        },

        dhont: function() {
            var electedseats = [];
            DataStore.each(function(prov){
                if(prov.get('provincia') !== 'total') {
                    var total = 0;
                    _.each(prov.rows, function(row) {
                        if(!row.get("statistical") || row.get('oid') === 'invalid' || row.get('oid') === 'blank') {
                            total += row.get("amount");
                        }
                    });
                    var minval = total*0.03;
                    var parties = _.reject(prov.rows, function(row) {
                        return row.get("amount") < minval || row.get("statistical") === true;
                    });
                    var possiblepar = [];
                    _.each(parties, function(party){
                        if (!party.get("statistical")) {
                            for (var i = 1; i <= circunscripciones[prov.get('provincia')]; i++) {
                                possiblepar.push({
                                    value : party.get("amount") / i,
                                    color : party.get("color"),
                                    oid   : party.get("oid"),
                                    label : party.get("label"),
                                });
                            };
                        }
                    });
                    possiblepar = _.sortBy(possiblepar, function(res) {
                        return res["value"];
                    }).reverse();

                    for (var i = 0; i < circunscripciones[prov.get('provincia')]; i++) {
                        electedseats.push({
                            value: possiblepar[i]['value'],
                            color: possiblepar[i]['color'],
                            oid  : possiblepar[i]['oid'],
                            label: possiblepar[i]['label'],
                        });
                    };
                }
            });

            var varpar = [];
            for (var i = 0; i < electedseats.length; i++) {
                thisvarpar = _.detect(varpar, function(party) {
                    return party['oid'] === electedseats[i]['oid'];
                });
                if (thisvarpar){
                    thisvarpar['value'] ++;
                } else {
                    varpar.push({
                        'oid' :electedseats[i]['oid'],
                        'value' : 1,
                        'color': electedseats[i]['color'],
                        'label': electedseats[i]['label']
                    });
                }
            };

            return _.sortBy(varpar,function (party) { return party['value']; }).reverse();

        },


        drawParties: function() {
            var drawable = {
                values : [],
                labels : [],
                colors : [],
                ids    : []
            }
            DataStore.calculateTotal();
            var total = DataStore.getTotal();
            var parties = _.select(total.rows, function (row){
                return row.get('statistical') == false;
            });
            _.each(parties, function(party) {
                drawable['values'].push(party.get('amount'));
                drawable['labels'].push(party.get('label'));
                drawable['ids'].push(party.get('oid'));
                if(party.get('color')){
                    drawable['colors'].push(party.get('color'));
                }
            });
            return drawable;
        },

        drawStat: function(drawable, oid, color, label) {
            var total = DataStore.getTotal();
            drawable['values'].push(total.getRow(oid).get('amount'));
            drawable['labels'].push(label);
            drawable['colors'].push(color);
            drawable['ids'].push(label);
            return drawable;
        },

        initial: function() {
            var drawable = this.drawParties();
            var drawable = this.drawStat(drawable, 'invalid', '#444', 'Nulos');
            var drawable = this.drawStat(drawable, 'blank', '#eee', 'En blanco');
            var drawable = this.drawStat(drawable, 'nonvote', '#000', 'Abstención');
            this.setupPaper(drawable);
            var that = this;
            this.advance = function(){ return that.remove("Abstención", function(){ return that.step2();});};
        },

        step2: function() {
            var drawable = this.drawParties();
            var drawable = this.drawStat(drawable, 'invalid', '#444', 'Nulos');
            var drawable = this.drawStat(drawable, 'blank', '#eee', 'En blanco');
            this.setupPaper(drawable);
            var that = this;

            this.advance = function(){ return that.remove("En blanco", function(){ return that.step2bis();});};
        },

        step2bis: function() {
            var drawable = this.drawParties();
            var drawable = this.drawStat(drawable, 'invalid', '#444', 'Nulos');
            this.setupPaper(drawable);
            var that = this;

            this.remove("Nulos", function(){that.step3()});
        },

        step3: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);
            var that = this;

            parvalues = this.dhont();

            this.setupPaper(drawable);
            var that = this;

            this.advance = function(){ return that.step4();};
        },
        step4: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);
            var that = this;

            parvalues = this.dhont();

            this.setupPaper(drawable);
            parliament = this.paper.g.parliament(650, 450, 200, 70, parvalues, {});
            parliament.hover(function () {
                if (this.label) {
                    this.label[0].stop();
                    this.label[0].scale(1.5);
                    this.label[1].attr({"font-weight": 800});
                }
            },
            function () {
                if (this.label) {
                    this.label[0].animate({scale: 1}, 500, "bounce");
                    this.label[1].attr({"font-weight": 400});
                }
            });
            var that = this;

            this.advance = function(){ return that.step4s();};
        },

        render: function() {
            this.initial();
        },
    });

    window.App = new DataListView;
});

