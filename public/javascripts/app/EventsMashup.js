(function($, _) {
    $(document).ready(function(){
        $( ".mainContent" ).html("jQuery is working!");
        
        if ("geolocation" in navigator) {
            console.log("geolocation IS available");
            navigator.geolocation.getCurrentPosition(function(position) {
                queryParams = { lat: position.coords.latitude, lon: position.coords.longitude, radius: "smart", key: "514554705c56201c2c681f2a44688055", page: "20" };
                getEvents(queryParams);
            });
        } else {
            console.log("geolocation IS NOT available");
            queryParams = { lat: "37.7749295", lon: "-122.4194155", radius: "smart", key: "514554705c56201c2c681f2a44688055", page: "20" };
            
            getEvents(queryParams);
        }
        
        console.log("underscore version - " + _.VERSION);
        
        var tpl = _.template("<h1>Some text: <%= foo %></h1>");
        $( "h1" ).after( tpl({foo: "blahblah"}) );
        
        /*
        // When rending an underscore template, we want top-level
        // variables to be referenced as part of an object. For
        // technical reasons (scope-chain search), this speeds up
        // rendering; however, more importantly, this also allows our
        // templates to look / feel more like our server-side
        // templates that use the rc (Request Context / Colletion) in
        // order to render their markup.
        _.templateSettings.variable = "rc";
        
        // Grab the HTML out of our template tag and pre-compile it.
        var template = _.template( $( "script.template" ).html() );
 
        // Define our render data (to be put into the "rc" variable).
        var templateData = {
                            listTitle: "Olympic Volleyball Players",
                            listItems: [
                                {
                                    name: "Misty May-Treanor",
                                    hasOlympicGold: true
                                },
                                {
                                    name: "Kerri Walsh Jennings",
                                    hasOlympicGold: true
                                },
                                {
                                    name: "Jennifer Kessy",
                                    hasOlympicGold: false
                                },
                                {
                                    name: "April Ross",
                                    hasOlympicGold: false
                                }
                            ]
                        };
         
        // Render the underscore template and inject it after the H1
        // in our current DOM.
        $( "h1" ).after( template( templateData ) );
        */
    }); 
    
    function getEvents(queryParams) {
        console.log("getEvents() - queryParams: %o", queryParams );
        $.ajax({
            type: "GET",
            url: "http://api.meetup.com/2/open_events",
            data: queryParams,
            dataType: "jsonp",
            success: function(data) {
                console.log("data: %o", data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("error - %o", { XMLHttpRequest: XMLHttpRequest, textStatus: textStatus, errorThrown: errorThrown });
                $( ".mainContent" ).html(errorThrown);
            }
        });
    }
})(jQuery, _);