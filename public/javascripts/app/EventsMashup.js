(function($, _) {
    $(document).ready(function(){
        $( ".techStack" ).html("jQuery - " + $().jquery + " | underscore - " + _.VERSION);
        
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
                console.log("Meetup names: %o", _.pluck(data.results, 'name'));
                var template = $("#eventList").html();
                $( ".errorNode" ).after( _.template(template, {events:data.results}) );
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("error - %o", { XMLHttpRequest: XMLHttpRequest, textStatus: textStatus, errorThrown: errorThrown });
                $( ".errorNode" ).html(errorThrown);
            }
        });
    }
})(jQuery, _);