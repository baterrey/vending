"use strict";
//Use es5, for  cross-browser compatibility
var app = new Vue({
    el: '#app',
    data: {
        optimalChangeResult: '',
        changeResult: '',
        optimalChange: '',
        normalChange: ''
    },
    methods: {
        /**
         *
         * @param e
         * @param {int} mode - 0: optimal change mode; 1: normal change mode with limits
         */
        getChangeResult: function (e, mode) {
            var self = this;
            var amount = mode === 0 ? this.optimalChange : this.normalChange;
            if (!amount) {
                alert('Value must be provided');//todo think about text
                return;
            }

            var url = '/getChange' + '?amount='+ amount + "&mode=" + mode;

            fetch(url).then(function (data) {
                return data.json();
            }).then(function (json) {
                if (json.error) {
                    throw Error(json.error);
                }
                if(mode === 0) {
                    self.optimalChangeResult = json.answer;
                } else {
                    self.changeResult = json.answer;
                }

            }).catch(function(error) {
                return alert(error.message);
            });
        }
    }
});