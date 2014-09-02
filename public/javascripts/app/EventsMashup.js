( function( $, _ ) {
    "use strict";
    
    console.log("User agent: %o", navigator.userAgent);
    
    var appMediator = {
        location: { lat: "37.7749295", lon: "-122.4194155" },
        eventlink: "",
        eventData: {},
        searchInProgress: false,
        
        setupListeners: function( ) {
            console.log( "setupListeners()" );
            
            $( "button.search" ).bind( "click", function( evt ) {
                if ( !appMediator.searchInProgress ) {
                    appMediator.searchInProgress = true;
                    
                    appMediator.eventlink = "";
                    appMediator.getEvents( appMediator.buildQueryParams() );
                }
            });
            
            $( "#content" ).bind( "click", function( evt ) {
                console.log( "setupListeners() - target: %o", evt.target );
                
                if ( $(evt.target).hasClass( "details" ) ) {
                    var eventId, event;
                    
                    evt.preventDefault();
                    
                    eventId = $( evt.target ).parent().data( "event-id" ).eventId;
                    event = _.first( _.where( appMediator.eventsData.results, { id: eventId } ) );
                    
                    $( "#eventDetailNode" ).html( _.template( $( "#eventDetail" ).html(), { event: event } ) );
                    $( ".eventDescription" ).html( event.description );
                    
                    $( ".eventDescription" ).find( "a" ).each( function( index, anchor ) {
                        if ( anchor.href.indexOf( "eventbrite.com" ) > -1 ) {
                            if ( appMediator.eventlink === "" ) {
                                console.log("Eventbrite anchor - %o %o", index, anchor.href);
                                appMediator.eventlink = anchor.href;
                            }
                        }
                    });
                    
                    $( ".hide" ).addClass( "show" ).removeClass( "hide" );
                    $( "#eventListPane" ).addClass( "hide" ).removeClass( "show" );
                    
                    if ( appMediator.eventlink === "" ) {
                        $( "#buy").addClass( "hide" ).removeClass( "show" );
                    }
                    
                    window.scrollTo( 0, 0 );
                } else if ( $( evt.target ).hasClass( "back" ) ) {
                    evt.preventDefault();
                    console.log( "setupListeners() - back button clicked " );
                    $( ".show" ).addClass( "hide" ).removeClass( "show" );
                    $( "#eventListPane" ).addClass( "show" ).removeClass( "hide" );
                    
                    window.scrollTo( 0, 0 );
                } else if ( $( evt.target ).hasClass( "buy" ) ) {
                    console.log( "setupListeners() - buy button clicked, eventLink: " + appMediator.eventlink);
                    window.location.href = appMediator.eventlink;
                }
            });
        },
        
        getEvents: function( queryParams ) {
            console.log("getEvents() - queryParams: %o", queryParams );
            
            $.ajax({
                type: "GET",
                url: "http://api.meetup.com/2/open_events",
                data: queryParams,
                dataType: "jsonp",
                context: this,
                success: function( data ) {
                    console.log( "getEvents() - data: %o", data );
                    appMediator.searchInProgress = false;
                    appMediator.eventsData = data;
                    $( "#eventListPane" ).html( _.template( $( "#eventList" ).html(), { events: appMediator.eventsData.results } ) );
                    
                    $( ".show" ).addClass( "hide" ).removeClass( "show" );
                    $( "#eventListPane" ).addClass( "show" ).removeClass( "hide" );
                    
                    console.log("search bar height: " + $( ".searchBar" ).height());
                    window.scrollTo( 0, 0 );
                },
                error: function( XMLHttpRequest, textStatus, errorThrown ) {
                    console.log("error - %o", { XMLHttpRequest: XMLHttpRequest, textStatus: textStatus, errorThrown: errorThrown });
                    appMediator.searchInProgress = false;
                    $( ".errorNode" ).html( errorThrown );
                }
            });
        },
        
        buildQueryParams: function() {
            console.log("getQueryParams()" );
            
            return $.extend( appMediator.getLocation( $('#location').val().trim() ),
                                { 
                                    key: "514554705c56201c2c681f2a44688055", 
                                    radius: $.isNumeric( $('#distance').val().trim() ) ? parseInt( $('#distance').val().trim() ) : "smart", 
                                    text: $('#keywords').val().trim().split( " " ).join( ","), 
                                    page: $.isNumeric( $('#numOfEvents').val().trim() ) ? parseInt( $('#numOfEvents').val().trim() ) : 20 
                                } );
        },
        
        getLocation: function( locationString ) {
            console.log("getLocation()" );
            
            if ( !locationString ) {
                return appMediator.location;
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
    };
    
    $(document).ready( function() {
        if ( window.innerWidth <= 600 ) { // mobile
            $( "label").addClass( "hide-label" );
        }
        
        $( ".has-search-header" ).css( "margin-top", $( ".searchBar" ).height() + 10 );
        
        if ( "geolocation" in navigator ) {
            console.log( "getLocation() - geolocation IS available" );
            navigator.geolocation.getCurrentPosition( function ( position ) {
                console.log( "Position - %o", position );
                appMediator.location = { lat: position.coords.latitude, lon: position.coords.longitude };
            },
            function ( errorCode ) {
                console.log( "getLocation() - unable to retrieve location, errorCode: " + errorCode );
            });
        } else {
            console.log( "getLocation() - geolocation IS NOT available" );
        }
        
        appMediator.setupListeners();
    });
})( jQuery, _ );