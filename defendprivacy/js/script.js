(function($){

    var sortObject = function(obj) {
        var sorted = {},
            arr = [];
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                arr.push(key);
            }
        }
        arr.sort();
        for (var key = 0; key < arr.length; key++){
            sorted[arr[key]] = obj[arr[key]];
        }
        return sorted;
    };


    var getParameterByName = function(name)
    {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(window.location.search);
      if(results == null)
        return "";
      else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    
    window.DP = {};
    DP.senators = {};

    DP.Senator = function(obj){
        this.firstName = obj.firstname;
        this.lastName = obj.lastname;
        this.fullName = this.firstName + ' ' + this.lastName;
        this.phone = obj.phone;
        this.website = obj.website;
        this.twitter = obj.twitter_id;
        this.facebook = obj.facebook_id;
        this.email = obj.email;
        this.party = obj.party;
        this.state = obj.state;
    };

    DP.loadSenators = function(json){
        $.each(json.response.legislators, function(index, element){
            var sen = new DP.Senator(element.legislator);
            if(!DP.senators.hasOwnProperty(sen.state)){
                DP.senators[sen.state] = [];
            }
            DP.senators[sen.state].push(sen);
        });

        $.each(sortObject(DP.senators), function(state, senators){
            $('<option />', {
                'value': state,
                'text': 'Select your state: ' +state,
            }).appendTo(DP.$state);
        });

        DP.$state.attr('disabled', false);
        DP.$state.children(':first-child').text('Select your state');
        // Select the state, if we've got it
	if (getParameterByName("state")) {
		$('#state').val(getParameterByName("state"));
		$(window).load(function(evt){ DP.$state.change(); });
	}
    };

    DP.prefetchSenators = function(){
        $.ajax({
            'url': 'http://services.sunlightlabs.com/api/legislators.getList',
            'data': {
                'apikey': 'feb76d9a130c433c87ad35c88a76dc1a',
                'title': 'Sen',
                'in_office': 1
            },
            'cache': true,
            'dataType': 'jsonp',
            'jsonp': 'jsonp',
            'jsonpCallback': 'DP.loadSenators',
        });
    };

    $(document).bind('ready', function(){
        
        DP.$state = $('[name="state"]');
        DP.$senators = $('#senators');
        DP.prefetchSenators();
        DP.template = Handlebars.compile($("#senator-template").html());

        DP.$state.bind('change', function(evt){
            var state = $(evt.target).children(':selected').val();
            DP.$senators.html('');
            $.each(DP.senators[state], function(index, senator){
                var $sen = $(DP.template(senator));
                $sen.appendTo(DP.$senators);
            });
        
        });

    });

})(jQuery);
