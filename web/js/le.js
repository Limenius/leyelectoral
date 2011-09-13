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

    window.Router = Backbone.Router.extend({
        routes: {
            "":                     "inicial",
            "!abstencion":          "abstencion",
            "!nulos":               "nulos",
            "!enblanco":            "enblanco",
            "!votospartidos":       "votospartidos",
            "!sistemaactual":       "sistemaactual",
            "!congresodiputados":   "congresodiputados",
            "!votosescaño":         "votosescaño",
            "!propuestas":          "propuestas",
            "!reformaelectoral1":   "reforma1",
            "!reformaelectoral2":   "reforma2",
            "!reformaelectoral3":   "reforma3",
            "!reformaelectoral4":   "reforma4",
        },

        inicial: function() {
            App.initial();
        },
        abstencion: function() {
            App.step1();
        },
        nulos: function() {
            App.step2();
        },
        enblanco: function() {
            App.step2bis();
        },
        votospartidos: function() {
            App.step3();
        },
        sistemaactual: function() {
            App.step4();
        },
        congresodiputados: function() {
            App.step5();
        },
        votosescaño: function() {
            App.step6();
        },
        propuestas: function() {
            App.stepFin();
        },
        reforma1: function() {
            App.stepReform1();
        },
        reforma2: function() {
            App.stepReform2();
        },
        reforma3: function() {
            App.stepReform3();
        },
        reforma4: function() {
            App.stepReform4();
        },

    });

    window.AppRouter = new Router;

    window.Content = Backbone.Model.extend({
        initialize: function() {
            if (!this.get("key")) {
                this.set({title: "undefined"});
            }
            if (!this.get("value")) {
                this.set({title: "undefined"});
            }
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

    window.ContentList = Backbone.Collection.extend({
        model: Content,
        initialize: function() {
            _.bindAll(this, 'getByKey');
        },

        getByKey : function(key) {
            return this.detect(function(content) {
                return key === content.get('key');
            });
        }

    });

    window.ContentStore = new ContentList;

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
                    if(data.get("provincia") != "total") {
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
                    }
                });
            }
        }

    });

    window.DataStore = new DataList;

    window.DataListView = Backbone.View.extend({
        el: $("#holder"),

        events: {
            "click #gonext":  "goNext",
            "click #goprev":  "goPrev",
            "click #golast":  "goLast",
            "click #gofirst":  "goFirst",
        },

        parvalues: null,
        parvalues2: null,
        parvalues3: null,
        parvalues4: null,
        parliament: null,
        parliament2: null,
        parliament3: null,
        parliament4: null,

        initialize: function() {
            _.bindAll(this, "render", "remove", "initial", "setupPaper", "goNext", "goPrev", "goLast", "goFirst", "drawParties", "dhont", "dhont50");
            DataStore.bind('redraw', this.render);
            this.paper = Raphael("holder", "100%", "100%");
            this.cx = 150;
            this.cy = 350;
            this.parvalues  = this.valpar;
            this.parvalues2 = this.valpar2;
            this.parvalues3 = this.valpar3;
            this.parvalues4 = this.valpar4;
            this.parvalues5 = this.valpar5;
        },

        goNext: function() {
            this.advance();
        },

        goPrev: function() {
            this.goback();
        },

        goLast: function() {
            this.golast();
        },

        goFirst: function() {
            this.gofirst();
        },


        remove: function(id, callback) {
            that = this;
            this.pie.remove(id, callback);
        },

        setupPaper: function(drawable) {
            this.paper.clear();
            this.paper.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
            this.pie = this.paper.g.piechart(this.cx, this.cy, 110, drawable['values'], drawable['ids'], {legend: drawable['labels'], legendpos: "east", legendmark: "flower", legendothers: "Otros", colors: drawable['colors'], stroke: '#d4d4d4', strokewidth: 1});
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
                var thisvarpar = _.detect(varpar, function(party) {
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

        dhont50: function() {
            var electedseats = [];
            var uniqprov = [];
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
                        return row.get("amount") < 100 || row.get("statistical") === true;
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

                    var remainProv = [];

                    for (var i = circunscripciones[prov.get('provincia')]; i < possiblepar.length; i++) {
                        var oid = possiblepar[i]['oid'];
                        if(!_.include(remainProv,oid)){
                            remainProv.push(oid);
                            if(uniqprov[oid]){
                                uniqprov[oid]['value'] += possiblepar[i]['value'];
                            }else{
                                uniqprov[oid] = {
                                    'oid' : possiblepar[i]['oid'],
                                    'color': possiblepar[i]['color'],
                                    'value': possiblepar[i]['value'],
                                    'label': possiblepar[i]['label'],
                                }
                            }
                        }
                    }
                }
            });
            var possiblepar = [];
            for (var j = 1; j <= 50; j++) {
                for (var i in uniqprov) {
                    possiblepar.push({
                        value : uniqprov[i]["value"] / j,
                        color : uniqprov[i]["color"],
                        oid   : uniqprov[i]["oid"],
                        label : uniqprov[i]["label"],
                    });
                }
            };
            possiblepar = _.sortBy(possiblepar, function(res) {
                return res["value"];
            }).reverse();
            for (var i = 0; i < 50; i++) {
                electedseats.push({
                    value: possiblepar[i]['value'],
                    color: possiblepar[i]['color'],
                    oid  : possiblepar[i]['oid'],
                    label: possiblepar[i]['label'],
                });
            };
            var varpar = [];
            for (var i = 0; i < electedseats.length; i++) {
                var thisvarpar = _.detect(varpar, function(party) {
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

        hare: function() {
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
                    var quota = Math.floor(total/circunscripciones1[prov.get('provincia')]);
                    var possiblepar = [];
                    var assigned = 0;
                    _.each(parties, function(party){
                        if (!party.get("statistical")) {
                            var inquota = Math.floor(party.get("amount") / quota);
                            for (var i = 0; i < inquota; i++) {
                                electedseats.push({
                                    value: party.get('value'),
                                    color: party.get('color'),
                                    oid  : party.get('oid'),
                                    label: party.get('label'),
                                });
                                assigned = assigned + 1;
                            };

                            possiblepar.push({
                                value: party.get("amount") % quota,
                                color: party.get('color'),
                                oid  : party.get('oid'),
                                label: party.get('label'),
                            });

                        }
                    });
                    possiblepar = _.sortBy(possiblepar, function(res) {
                        return res["value"];
                    }).reverse();

                    for (var i = 0; i < circunscripciones1[prov.get('provincia')] -assigned; i++) {
                        electedseats.push({
                            value: possiblepar[i]['value'],
                            color: possiblepar[i]['color'],
                            oid  : possiblepar[i]['oid'],
                            label: possiblepar[i]['label'],
                        });
                    }
                }
            });

            var varpar = [];
            for (var i = 0; i < electedseats.length; i++) {
                var thisvarpar = _.detect(varpar, function(party) {
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

        dhontNacional: function() {
            var electedseats = [];
            var prov = DataStore.getTotal();
            var total = 0;
            _.each(prov.rows, function(row) {
                if(!row.get("statistical") || row.get('oid') === 'invalid' || row.get('oid') === 'blank') {
                    total += row.get("amount");
                }
            });
            var minval = 0;
            var parties = _.reject(prov.rows, function(row) {
                return row.get("amount") < minval || row.get("statistical") === true;
            });
            var possiblepar = [];
            _.each(parties, function(party){
                if (!party.get("statistical")) {
                    for (var i = 1; i <= circunscripcionUnica[prov.get('provincia')]; i++) {
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

            for (var i = 0; i < circunscripcionUnica[prov.get('provincia')]; i++) {
                electedseats.push({
                    value: possiblepar[i]['value'],
                    color: possiblepar[i]['color'],
                    oid  : possiblepar[i]['oid'],
                    label: possiblepar[i]['label'],
                });
            };

            var varpar = [];
            for (var i = 0; i < electedseats.length; i++) {
                var thisvarpar = _.detect(varpar, function(party) {
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


        dhontUG: function() {
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


            ////
            var prov = DataStore.getTotal();
            var total = 0;
            _.each(prov.rows, function(row) {
                if(!row.get("statistical") || row.get('oid') === 'invalid' || row.get('oid') === 'blank') {
                    total += row.get("amount");
                }
            });
            var minval = 0;
            var parties = _.reject(prov.rows, function(row) {
                return row.get("amount") < minval || row.get("statistical") === true;
            });
            var possiblepar = [];

            var varpar = [];
            for (var i = 0; i < electedseats.length; i++) {
                var thisvarpar = _.detect(varpar, function(party) {
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

            var possiblepar = [];
            _.each(parties, function(party){
                if (!party.get("statistical")) {
                    var thisvarpar = _.detect(varpar, function(tparty) {
                        return tparty['oid'] === party.get('oid');
                    });
                    var initialbox = thisvarpar ? thisvarpar['value'] +1  : 1;
                    for (var j = initialbox; j <= initialbox+20; j++) {
                        if(party.get("amount") > 1) {
                            var valtopush = party.get("amount") / j;
                            possiblepar.push({
                                value : valtopush,
                                color : party.get("color"),
                                oid   : party.get("oid"),
                                label : party.get("label"),
                            });
                        }
                    };
                }
            });
            var possiblepar = _.reject(possiblepar, function(part) {
                return (part["value"] == null || part["value"] == 0);
            });
            possiblepar = _.sortBy(possiblepar, function(res) {
                return res["value"];
            }).reverse();

            for (var i = 0; i < 20; i++) {
                electedseats.push({
                    value: possiblepar[i]['value'],
                    color: possiblepar[i]['color'],
                    oid  : possiblepar[i]['oid'],
                    label: possiblepar[i]['label'],
                });
            };

            for (var i = 350; i < electedseats.length; i++) {
                var thisvarpar = _.detect(varpar, function(party) {
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

            ////
            var possiblepar = [];
            _.each(parties, function(party){
                if (!party.get("statistical")) {
                    var thisvarpar = _.detect(varpar, function(tparty) {
                        return tparty['oid'] === party.get('oid');
                    });
                    var initialbox = thisvarpar ? thisvarpar['value'] +1  : 1;
                    for (var j = initialbox; j <= initialbox+30; j++) {
                        if(party.get("amount") > 0) {
                            var valtopush = party.get("amount") * party.get("amount") / j;
                            possiblepar.push({
                                value : valtopush,
                                color : party.get("color"),
                                oid   : party.get("oid"),
                                label : party.get("label"),
                            });
                        }
                    };
                }
            });
            var possiblepar = _.reject(possiblepar, function(part) {
                return (part["value"] == null || part["value"] == 0);
            });
            possiblepar = _.sortBy(possiblepar, function(res) {
                return res["value"];
            }).reverse();

            for (var i = 0; i < 30; i++) {
                electedseats.push({
                    value: possiblepar[i]['value'],
                    color: possiblepar[i]['color'],
                    oid  : possiblepar[i]['oid'],
                    label: possiblepar[i]['label'],
                });
            };


            for (var i = 370; i < electedseats.length; i++) {
                var thisvarpar = _.detect(varpar, function(party) {
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
            var drawable = this.drawStat(drawable, 'blank', '#fff', 'En blanco');
            var drawable = this.drawStat(drawable, 'nonvote', '#000', 'Abstención');
            this.setupPaper(drawable);
            
            $('#holder').css('height','500px');
            $('#notes').css('margin-top','-280px');

            $('html, body').animate({scrollTop: $(document).height()}, 4000);
            
            $('#floatingbuttons').hide();
            $('#notes2').html(ContentStore.getByKey("blank").get("value"));
            $('#notes3').html(ContentStore.getByKey("blank").get("value"));
            $('#reform1').html(ContentStore.getByKey("blank").get("value"));
            $('#reform2').html(ContentStore.getByKey("blank").get("value"));
            $('#reform3').html(ContentStore.getByKey("blank").get("value"));
            $('#reform4').html(ContentStore.getByKey("blank").get("value"));
            $('#notes2').hide();
            $('#notes3').hide();
            $('#reform1').hide();
            $('#reform2').hide();
            $('#reform3').hide();
            $('#reform4').hide();
            $('#notes').fadeOut(300, function(){
                $('#notes').html(ContentStore.getByKey("inicial").get("value")).fadeIn(2500);
                $('#floatingbuttons').fadeIn(1500);
            });
            var that = this;
            this.advance = function(){ return AppRouter.navigate("!abstencion", true);};
            this.goback = function(){ return  AppRouter.navigate("", true);};
            this.golast = function(){ return AppRouter.navigate("!reformaelectoral4", true);};
            this.gofirst = function(){ return AppRouter.navigate("", true);};
        },

        step1: function() {
            var drawable = this.drawParties();
            var drawable = this.drawStat(drawable, 'invalid', '#444', 'Nulos');
            var drawable = this.drawStat(drawable, 'blank', '#eee', 'En blanco');
            var drawable = this.drawStat(drawable, 'nonvote', '#000', 'Abstención');
            this.setupPaper(drawable);
            $('#notes').fadeOut(300, function(){
                $('#notes').html(ContentStore.getByKey("preabstencion").get("value")).fadeIn(1500);
            });
            var that = this;
            this.advance = function(){ return that.remove("Abstención", function(){ return AppRouter.navigate("!nulos", true);});};
            this.goback = function(){ return AppRouter.navigate("", true);};
        },

        step2: function() {
            var drawable = this.drawParties();
            var drawable = this.drawStat(drawable, 'invalid', '#444', 'Nulos');
            var drawable = this.drawStat(drawable, 'blank', '#eee', 'En blanco');
            this.setupPaper(drawable);
            $('#notes').fadeOut(300, function(){
                $('#notes').html(ContentStore.getByKey("abstencion").get("value")).fadeIn(1500);
            });
            var that = this;

            this.advance = function(){ return that.remove("Nulos", function(){ return AppRouter.navigate("!enblanco", true);});};
            this.goback = function(){ return AppRouter.navigate("!abstencion", true);};
        },

        step2bis: function() {
            var drawable = this.drawParties();
            var drawable = this.drawStat(drawable, 'blank', '#eee', 'En blanco');
            this.setupPaper(drawable);
            $('#notes').fadeOut(300, function(){
                $('#notes').html(ContentStore.getByKey("nulos").get("value")).fadeIn(1500);
            });
            var that = this;

            this.advance = function(){ return that.remove("En blanco", function(){ return AppRouter.navigate("!sistemaactual", true);});};
            this.goback = function(){ return AppRouter.navigate("!nulos", true);};
        },

        step3: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);
            $('#notes').fadeOut(300, function(){
                $('#notes').html(ContentStore.getByKey("enblanco").get("value")).fadeIn(1500);
            });
            var that = this;

            this.advance = function(){ return AppRouter.navigate("!sistemaactual", true);};
            this.goback = function(){ return AppRouter.navigate("!enblanco", true);};
        },
        step4: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);
            
            $('#holder').css('height','500px');
            $('#notes').css('margin-top','-280px');
            
            $('#notes2').html(ContentStore.getByKey("blank").get("value"));
            $('#notes').fadeOut(300, function(){
                $('#notes').html(ContentStore.getByKey("preparliament").get("value")).fadeIn(1500);
            });
            var that = this;

            this.advance = function(){ return AppRouter.navigate("!congresodiputados", true);};
            this.goback = function(){ return AppRouter.navigate("!votospartidos", true);};
        },
        step5: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);
            var that = this;

            this.parvalues = this.parvalues || this.dhont();
            $('#holder').css('height','805px');
            $('#notes').css('margin-top','-585px');

            $('html, body').animate({scrollTop: $(document).height()}, 4000);
            $('#notes').html(ContentStore.getByKey("preparliament").get("value"));
            $('#notes2').hide('fast', function(){
                $('#notes2').html(ContentStore.getByKey("postparliament1").get("value")).fadeIn(1500);
                $('#notes2').fadeIn(1500);

            });
            this.parliament = this.paper.g.parliament(630, 660, 180, 40, this.parvalues, {}, 1.3796875000000002, 3.5);
            this.hoverParliament(this.parliament);
            var that = this;

            this.advance = function(){ return AppRouter.navigate("!votosescaño", true);};
            this.goback = function(){ return AppRouter.navigate("!votospartidos", true);};
        },
        hoverParliament: function(parliament) {
            parliament.hover(
                function () {
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
                }
            );
        },
        step6: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);

            this.parvalues = this.parvalues || this.dhont();
            
            $('#notes').html(ContentStore.getByKey("preparliament").get("value"));
            $('#notes3').html(ContentStore.getByKey("blank").get("value"));
            $('#notes2').fadeOut(300, function(){
                $('#notes2').html(ContentStore.getByKey("conclusiones").get("value")).fadeIn(1500);
            });
            this.parliament = this.paper.g.parliament(630, 660, 180, 40, this.parvalues, {}, 1.3796875000000002, 3.5);
            this.hoverParliament(this.parliament);
            var that = this;

            this.advance = function(){ return AppRouter.navigate("!propuestas", true);};
            this.goback = function(){ return AppRouter.navigate("!sistemaactual", true);};
        },
        stepFin: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);
            this.parvalues = this.parvalues || this.dhont();
            
            $('#holder').css('height','805px');
            $('#notes').css('margin-top','-585px');
            $('#notes2').css('margin-top','-35px');
            
            $('html, body').animate({scrollTop: $(document).height()}, 4000);
            
            $('#reform1').html(ContentStore.getByKey("blank").get("value"));
            $('#notes').html(ContentStore.getByKey("preparliament").get("value"));
            $('#reform1').hide();
            
            $('#notes2').html(ContentStore.getByKey("conclusiones").get("value"));
            $('#reform1').html(ContentStore.getByKey("blank").get("value"));
            $('#notes3').hide('fast', function(){
                $('#notes3').html(ContentStore.getByKey("fin").get("value")).fadeIn(1500);
            });
            this.parliament = this.paper.g.parliament(630, 660, 180, 40, this.parvalues, {}, 1.3796875000000002, 3.5);
            this.hoverParliament(this.parliament);
            var that = this;

            this.advance = function(){ return AppRouter.navigate("!reformaelectoral1", true);};
            this.goback = function(){ return AppRouter.navigate("!votosescaño", true);};
        },
        stepReform1: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);
            this.parvalues = this.parvalues || this.dhont();
            this.parvalues2 = this.parvalues2 || this.hare();
            
            $('#holder').css('height','1120px');
            $('#notes').css('margin-top','-900px');
            
            $('#reform2').hide();
            
            $('#reform2').html(ContentStore.getByKey("blank").get("value"));
            $('#notes').html(ContentStore.getByKey("preparliament").get("value"));
            $('#notes2').html(ContentStore.getByKey("conclusiones").get("value"));
            $('#notes3').html(ContentStore.getByKey("fin").get("value"));
            $('#reform1').hide('fast', function(){
                $('#reform1').html(ContentStore.getByKey("reforma1").get("value")).fadeIn(1500);
            });
            $('html, body').animate({scrollTop: $(document).height()}, 4000);
            this.parliament = this.paper.g.parliament(630, 660, 180, 40, this.parvalues, {}, 1.3796875000000002, 3.5);
            this.hoverParliament(this.parliament);
            this.parliament2 = this.paper.g.parliament(630, 1055, 180, 40, this.parvalues2, {});
            this.hoverParliament(this.parliament2);

            var that = this;

            this.advance = function(){ return AppRouter.navigate("!reformaelectoral2", true);};
            this.goback = function(){ return AppRouter.navigate("!propuestas", true);};
        },
        stepReform2: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);
            this.parvalues = this.parvalues || this.dhont();
            this.parvalues2 = this.parvalues2 || this.hare();
            this.parvalues3 = this.parvalues3 || this.dhont50();
            
            $('#holder').css('height','1465px');
            $('#notes').css('margin-top','-1245px');
            
            $('#reform3').hide();
            
            $('#reform3').html(ContentStore.getByKey("blank").get("value"));
            $('#notes').html(ContentStore.getByKey("preparliament").get("value"));
            $('#notes2').html(ContentStore.getByKey("conclusiones").get("value"));
            $('#notes3').html(ContentStore.getByKey("fin").get("value"));
            $('#reform1').html(ContentStore.getByKey("reforma1").get("value"));
            $('#reform2').hide('fast', function(){
                $('#reform2').html(ContentStore.getByKey("reforma2").get("value")).fadeIn(1500);
            });
            $('html, body').animate({scrollTop: $(document).height()}, 4000);
            this.parliament = this.paper.g.parliament(630, 660, 180, 40, this.parvalues, {});
            this.hoverParliament(this.parliament);
            this.parliament2 = this.paper.g.parliament(630, 1055, 180, 40, this.parvalues2, {});
            this.hoverParliament(this.parliament2);
            this.parliament3 = this.paper.g.parliament(630, 1400, 180, 40, this.parvalues3, {});
            this.hoverParliament(this.parliament3);

            var that = this;

            this.advance = function(){ return AppRouter.navigate("!reformaelectoral3", true);};
            this.goback = function(){ return AppRouter.navigate("!reformaelectoral1", true);};
        },

        render: function() {
            this.initial();

        },

        stepReform3: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);
            this.parvalues = this.parvalues || this.dhont();
            this.parvalues2 = this.parvalues2 || this.hare();
            this.parvalues3 = this.parvalues3 || this.dhont50();
            this.parvalues4 = this.parvalues4 || this.dhontUG();
            
            $('#holder').css('height','1830px');
            $('#notes').css('margin-top','-1610px');
            
            $('#reform4').hide();
            
            $('#reform4').html(ContentStore.getByKey("blank").get("value"));
            $('#notes').html(ContentStore.getByKey("preparliament").get("value"));
            $('#notes2').html(ContentStore.getByKey("conclusiones").get("value"));
            $('#notes3').html(ContentStore.getByKey("fin").get("value"));
            $('#reform1').html(ContentStore.getByKey("reforma1").get("value"));
            $('#reform2').html(ContentStore.getByKey("reforma2").get("value"));
            $('#reform3').hide('fast', function(){
                $('#reform3').html(ContentStore.getByKey("reforma3").get("value")).fadeIn(1500);
            });
            $('html, body').animate({scrollTop: $(document).height()}, 4000);
            this.parliament = this.paper.g.parliament(630, 660, 180, 40, this.parvalues, {}, 1.3796875000000002, 3.5);
            this.hoverParliament(this.parliament);
            this.parliament2 =  this.paper.g.parliament(630, 1055, 180, 40, this.parvalues2, {}, 1.2125, 3.5);
            this.hoverParliamen;
            this.parliament3 = this.paper.g.parliament(630, 1400, 180, 40, this.parvalues3, {}, 1.2125, 3.5);
            this.hoverParliamen;
            this.parliament4 = this.paper.g.parliament(630, 1775, 180, 40, this.parvalues4, {}, 1.2125, 3.5);
            this.hoverParliament(this.parliament4);

            var that = this;

            this.advance = function(){ return AppRouter.navigate("!reformaelectoral4", true);};
            this.goback = function(){ return AppRouter.navigate("!reformaelectoral2", true);};
        },

        stepReform4: function() {
            var drawable = this.drawParties();
            this.setupPaper(drawable);
            this.parvalues = this.parvalues || this.dhont();
            this.parvalues2 = this.parvalues2 || this.hare();
            this.parvalues3 = this.parvalues3 || this.dhont50();
            this.parvalues4 = this.parvalues4 || this.dhontUG();
            this.parvalues5 = this.parvalues5 || this.dhontNacional();
            
            $('#holder').css('height','2155px');
            $('#notes').css('margin-top','-1935px');
            
            $('#notes').html(ContentStore.getByKey("preparliament").get("value"));
            $('#notes2').html(ContentStore.getByKey("conclusiones").get("value"));
            $('#notes3').html(ContentStore.getByKey("fin").get("value"));
            $('#notes1').show();
            $('#notes2').show();
            $('#notes3').show();
            $('#reform1').show();
            $('#reform2').show();
            $('#reform3').show();
            $('#reform1').html(ContentStore.getByKey("reforma1").get("value"));
            $('#reform2').html(ContentStore.getByKey("reforma2").get("value"));
            $('#reform3').html(ContentStore.getByKey("reforma3").get("value"));
            $('#reform4').hide('fast', function(){
                $('#reform4').html(ContentStore.getByKey("reforma4").get("value")).fadeIn(1500);
            });
            $('html, body').animate({scrollTop: $(document).height()}, 4000);
            this.parliament =  this.paper.g.parliament(630, 660, 180, 40, this.parvalues, {}, 1.3796875000000002, 3.5);
            this.hoverParliament(this.parliament);
            this.parliament2 =  this.paper.g.parliament(630, 1055, 180, 40, this.parvalues2, {}, 1.2125, 3.5);
            this.hoverParliamen;
            this.parliament3 = this.paper.g.parliament(630, 1400, 180, 40, this.parvalues3, {}, 1.2125, 3.5);
            this.hoverParliamen;
            this.parliament4 = this.paper.g.parliament(630, 1775, 180, 40, this.parvalues4, {}, 1.2125, 3.5);
            this.hoverParliamen;
            this.parliament5 = this.paper.g.parliament(630, 2100, 180, 40, this.parvalues5, {}, 1.2125, 3.5);
            this.hoverParliament(this.parliament5);

            var that = this;

            this.advance = function(){ return AppRouter.navigate("!reformaelectoral4", true);};
            this.goback = function(){ return AppRouter.navigate("!reformaelectoral3", true);};
        },

        render: function() {
            this.initial();

        },

        render: function() {
            this.initial();

        },
    });

    window.App = new DataListView;

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
    };
    var circunscripciones1 = {
        "Burgos": 4,
        "León": 5,
        "Palencia": 2,
        "Salamanca": 4,
        "Segovia": 2,
        "Soria": 2,
        "Valladolid": 5,
        "Zamora": 2,
        "Girona": 6,
        "Lleida": 4,
        "Tarragona": 7,
        "Badajoz": 6,
        "Cáceres": 4,
        "A Coruña": 10,
        "Ourense": 4,
        "Pontevedra": 8,
        "Madrid": 48,
        "Navarra": 6,
        "Álava": 3,
        "Guipúzcoa": 6,
        "Vizcaya": 10,
        "Murcia": 12,
        "La Rioja": 3,
        "Alicante / Alacant": 15,
        "Castellón / Castelló": 5,
        "Valencia / València": 20,
        "Ceuta": 2,
        "Melilla": 2,
        "Almería": 6,
        "Cádiz": 10,
        "Córdoba": 7,
        "Granada": 8,
        "Huelva": 5,
        "Jaén": 6,
        "Málaga": 13,
        "Sevilla": 15,
        "Huesca": 3,
        "Teruel": 2,
        "Zaragoza": 8,
        "Asturias": 9,
        "Illes Balears": 9,
        "Las Palmas": 9,
        "Santa Cruz de Tenerife": 9,
        "Cantabria": 5,
        "Albacete": 4,
        "Ciudad Real": 5,
        "Cuenca": 3,
        "Guadalajara": 3,
        "Toledo": 6,
        "Ávila": 2,
        "Barcelona": 42,
        "Lugo": 4,
    };
    var circunscripcionesUG = {
        "Burgos": 4,
        "León": 5,
        "Palencia": 2,
        "Salamanca": 4,
        "Segovia": 2,
        "Soria": 2,
        "Valladolid": 5,
        "Zamora": 3,
        "Girona": 7,
        "Lleida": 4,
        "Tarragona": 7,
        "Badajoz": 6,
        "Cáceres": 4,
        "A Coruña": 10,
        "Ourense": 4,
        "Pontevedra": 8,
        "Madrid": 48,
        "Navarra": 6,
        "Álava": 3,
        "Guipúzcoa": 6,
        "Vizcaya": 10,
        "Murcia": 12,
        "La Rioja": 3,
        "Alicante / Alacant": 15,
        "Castellón / Castelló": 5,
        "Valencia / València": 20,
        "Ceuta": 1,
        "Melilla": 1,
        "Almería": 6,
        "Cádiz": 10,
        "Córdoba": 7,
        "Granada": 8,
        "Huelva": 5,
        "Jaén": 6,
        "Málaga": 13,
        "Sevilla": 15,
        "Huesca": 3,
        "Teruel": 2,
        "Zaragoza": 8,
        "Asturias": 9,
        "Illes Balears": 9,
        "Las Palmas": 9,
        "Santa Cruz de Tenerife": 9,
        "Cantabria": 5,
        "Albacete": 4,
        "Ciudad Real": 5,
        "Cuenca": 3,
        "Guadalajara": 3,
        "Toledo": 6,
        "Ávila": 2,
        "Barcelona": 42,
        "Lugo": 4,
    };
    var circunscripcionUnica = {
        "total": 400,
    };

    var valpar = [{"oid":"p-s-o-e","value":169,"color":"#d41d05","label":"PSOE"},{"oid":"p-p","value":154,"color":"#019ee5","label":"PP"},{"oid":"ciu","value":10,"color":"#000e62","label":"CiU"},{"oid":"eaj-pnv","value":6,"color":"#b2bb1e","label":"PNV"},{"oid":"esquerra","value":3,"color":"#e5aa01","label":"ERC"},{"oid":"cc-pnc","value":2,"color":"#ffec01","label":"CC"},{"oid":"i-u","value":2,"color":"#016e52","label":"IU"},{"oid":"b-n-g","value":2,"color":"#b4d0e7","label":"BNG."},{"oid":"na-bai","value":1,"color":"#8c4d97","label":"Na-Bai"},{"oid":"upyd","value":1,"color":"#e4007b","label":"UPyD"}];

    var valpar2 = [{"oid":"p-s-o-e","value":179,"color":"#d41d05","label":"PSOE"},{"oid":"p-p","value":170,"color":"#019ee5","label":"PP"},{"oid":"ciu","value":14,"color":"#000e62","label":"CiU"},{"oid":"i-u","value":13,"color":"#016e52","label":"IU"},{"oid":"eaj-pnv","value":6,"color":"#b2bb1e","label":"PNV"},{"oid":"esquerra","value":6,"color":"#e5aa01","label":"ERC"},{"oid":"cc-pnc","value":3,"color":"#ffec01","label":"CC"},{"oid":"upyd","value":2,"color":"#e4007b","label":"UPyD"},{"oid":"b-n-g","value":2,"color":"#b4d0e7","label":"BNG."},{"oid":"nc-ccn","value":1,"color":"#9d5e08","label":"NC-CCN"},{"oid":"unitat-per-les-illes","value":1,"color":"#f51111","label":"U. per les Illes"},{"oid":"cha","value":1,"color":"#a8021a","label":"CHA"},{"oid":"ea","value":1,"color":"#6db23e","label":"EA"},{"oid":"na-bai","value":1,"color":"#8c4d97","label":"Na-Bai"}];

    var valpar3 = [{"oid":"p-s-o-e","value":188,"color":"#d41d05","label":"PSOE"},{"oid":"p-p","value":173,"color":"#019ee5","label":"PP"},{"oid":"ciu","value":11,"color":"#000e62","label":"CiU"},{"oid":"i-u","value":9,"color":"#016e52","label":"IU"},{"oid":"eaj-pnv","value":6,"color":"#b2bb1e","label":"PNV"},{"oid":"esquerra","value":4,"color":"#e5aa01","label":"ERC"},{"oid":"upyd","value":3,"color":"#e4007b","label":"UPyD"},{"oid":"b-n-g","value":3,"color":"#b4d0e7","label":"BNG."},{"oid":"cc-pnc","value":2,"color":"#ffec01","label":"CC"},{"oid":"na-bai","value":1,"color":"#8c4d97","label":"Na-Bai"}];

    var valpar4 = [{"oid":"p-s-o-e","value":192,"color":"#d41d05","label":"PSOE"},{"oid":"p-p","value":162,"color":"#019ee5","label":"PP"},{"oid":"i-u","value":14,"color":"#016e52","label":"IU"},{"oid":"ciu","value":11,"color":"#000e62","label":"CiU"},{"oid":"eaj-pnv","value":6,"color":"#b2bb1e","label":"PNV"},{"oid":"upyd","value":4,"color":"#e4007b","label":"UPyD"},{"oid":"esquerra","value":4,"color":"#e5aa01","label":"ERC"},{"oid":"b-n-g","value":3,"color":"#b4d0e7","label":"BNG."},{"oid":"cc-pnc","value":2,"color":"#ffec01","label":"CC"},{"oid":"ca","value":1,"color":"#70814d","label":"CA"},{"oid":"na-bai","value":1,"color":"#8c4d97","label":"Na-Bai"}];

    var valpar5 = [{"oid":"ciu","value":12,"color":"#000e62","label":"CiU"},{"oid":"eaj-pnv","value":5,"color":"#b2bb1e","label":"PNV"},{"oid":"upyd","value":5,"color":"#e4007b","label":"UPyD"},{"oid":"esquerra","value":4,"color":"#e5aa01","label":"ERC"},{"oid":"b-n-g","value":3,"color":"#b4d0e7","label":"BNG."},{"oid":"cc-pnc","value":2,"color":"#ffec01","label":"CC"},{"oid":"na-bai","value":1,"color":"#8c4d97","label":"Na-Bai"},{"oid":"ca","value":1,"color":"#70814d","label":"CA"}];
});

