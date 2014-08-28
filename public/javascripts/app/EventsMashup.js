(function( $, _ ) {
    var eventsData;
    
    $(document).ready( function() {
        $( ".techStack" ).html( "jQuery - " + $().jquery + " | underscore - " + _.VERSION );
        
        setupListeners();
    }); 
    
    var setupListeners = function() {
        console.log( "setupListeners()" );
        $( "#content" ).bind( "click", { self: this }, function( evt ) {
            console.log( "setupListeners() - target: %o", evt.target );
            if ( $(evt.target).hasClass( "details" ) ) {
                console.log( "setupListeners() - details button clicked " );
                evt.preventDefault();
                $( ".hide" ).addClass( "show" ).removeClass( "hide" );
                $( "#eventListPane" ).addClass( "hide" ).removeClass( "show" );
            } else if ( $( evt.target ).hasClass( "back" ) ) {
                evt.preventDefault();
                console.log( "setupListeners() - back button clicked " );
                $( ".show" ).addClass( "hide" ).removeClass( "show" );
                $( "#eventListPane" ).addClass( "show" ).removeClass( "hide" );
            } else if ( $( evt.target ).hasClass( "buy" ) ) {
                evt.preventDefault();
                console.log( "setupListeners() - buy button clicked " );
            }
        });
        
        $( "button.submit" ).bind( "click", { self: this }, function( evt ) {
            getEvents( getQueryParams() );
        });
    };
    
    var getQueryParams = function() {
        console.log("getQueryParams()" );
        
        return $.extend( getLocation( $('#location').val().trim() ),
                            { 
                                key: "514554705c56201c2c681f2a44688055", 
                                radius: $.isNumeric( $('#radius').val().trim() ) ? parseInt( $('#radius').val().trim() ) : "smart", 
                                text: $('#keywords').val().trim().split( " " ).join( ","), 
                                page: $.isNumeric( $('#numOfEvents').val().trim() ) ? parseInt( $('#numOfEvents').val().trim() ) : 20 
                            } );
    };
    
    var getEvents = function( queryParams ) {
        console.log("getEvents() - queryParams: %o", queryParams );
        $.ajax({
            type: "GET",
            url: "http://api.meetup.com/2/open_events",
            data: queryParams,
            dataType: "jsonp",
            context: this,
            success: function( data ) {
                console.log( "getEvents() - data: %o", data );
                this.eventsData = data;
                $( "#eventListPane" ).html( _.template( $( "#eventList" ).html(), { events: data.results } ) );
            },
            error: function( XMLHttpRequest, textStatus, errorThrown ) {
                console.log("error - %o", { XMLHttpRequest: XMLHttpRequest, textStatus: textStatus, errorThrown: errorThrown });
                $( ".errorNode" ).html( errorThrown );
            }
        });
    };
    
    var getLocation = function( locationString ) {
        console.log("getLocation()" );
        
        if ( !locationString ) {
            if ( false && "geolocation" in navigator ) {
                console.log( "getLocation() - geolocation IS available" );
                navigator.geolocation.getCurrentPosition( function ( position ) {
                    return { lat: position.coords.latitude, lon: position.coords.longitude };
                },
                function ( errorCode ) {
                    console.log( "getLocation() - unable to retrieve location, errorCode: " + errorCode );
                    return { lat: "37.7749295", lon: "-122.4194155" };
                });
            } else {
                console.log( "getLocation() - geolocation IS NOT available" );
                return { lat: "37.7749295", lon: "-122.4194155" };
            }
        } else {
            if ($.isNumeric( locationString ) ) {
                var postalCode = parseInt( locationString );
                if ( postalCode < 99999 & postalCode > 11111) {
                    return { zip: postalCode };
                }
            } else {
                if ( $.inArray( locationString, [ "AL", "AK", "AZ", "AR", "CA", "FL", "HI", "NY", "MA", "NV", "TX", "VA", "PA" ] ) > -1 ) {
                    return { state: locationString };
                } else {
                    return { city: locationString };
                }
            }
        }
    }
})( jQuery, _ );