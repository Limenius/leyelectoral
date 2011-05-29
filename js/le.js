$(document).ready(function(){
    window.Data = Backbone.Model.extend({

        initialize: function() {
            if (!this.get("label")) {
                this.set({title: "undefined"});
            }
            if (!this.get("amount")) {
                this.set({amount: 0});
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
        comparator: function(data) {
            return data.get("amount");
        },
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
            var values = [];
            var labels = [];
            DataStore.each(function (data){
                values.push(data.get('amount'));
                labels.push(data.get('label'));
            });
            this.paper.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
            this.paper.g.text(320, 100, "Interactive Pie Chart").attr({"font-size": 20});
            this.paper.g.piechart(350, 350, 200, values, {legend: labels, legendpos: "west", legendothers: "Otros"});

        }
    });

    window.App = new DataListView;
});

