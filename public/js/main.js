var app = new Vue({
    el: '#app',
    data: {
        optimalChangeResult: [],
        optimalChange: ''
    },
    methods: {
        getOptimalChangeResult: function () {
            var self = this;
            if (!this.optimalChange) {
                alert('Value must be provided');//todo think about text
            }

            var url = '/getOptimalChangeFor' + '?amount='+this.optimalChange;
            fetch(url).then(function (data) {
                return data.json();
            }).then(function (json) {
                if (json.error) {
                    return alert(json.error);
                }
                self.optimalChangeResult = json.result;
            }).catch(function(error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
            });
        }
    }
});