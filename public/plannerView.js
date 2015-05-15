    // var all_hotels = {{ hotels | json }};
    // var all_restaurants = {{ restaurants | json }};
    // var all_things_to_do = {{ thingsToDo | json }};

var hotel, 
restaurants, 
todo, 
index, 
lat, 
lon, 
markerName, 
numDays = 1, 
currentDay = "#D1", 
// an array that holds data for particular day 
domViews = [];

// CLONER FUNCTION FOR SAVING DAY STATE 
function cloner(self){
	var clone = $(currentDay).parent().parent().next().clone();
	if(domViews[currentDay.slice(2) - 1] === undefined){
		domViews.push(clone); 
	} else {
		domViews[currentDay.slice(2) - 1] = clone; 
	}

	if (self.id === 'addDay'){
   			$('#hotelItinerary').html('');
   			$('#restaurantItinerary').html('');
   			$('#todoItinerary').html('');
		} else {
			var domViewsData = $(domViews[self.id.slice(1) - 1][0]);
			var panelHeadingBody = $(domViewsData).children();
   			var oldView = $((panelHeadingBody).children()).children();
   			console.log($(oldView[0]).html());
   			$('.panel-body ul:eq(0) div').html($(oldView[0]).html());
   			$('.panel-body ul:eq(1) div').html($(oldView[1]).html());
   			$('.panel-body ul:eq(3) div').html($(oldView[3]).html());
   			currentDay = "#" + self.id;
	}
}

//ADD DAY BUTTON HANDLER 
$(".day-buttons").on("click", ".day-btn", function(){
	cloner(this);
});

//add day click handler
$("#addDay").on("click", function(){
	numDays++;
	$("#addDay").before("<button id='D" + numDays +"' class='btn btn-circle day-btn'>" + numDays + "</button>");
	currentDay = "#D" + numDays; });

// INTIALIZE SELECTIONS WITH DATA 
function getNames(obj) {
	var toReturn = "";
	for(var i = 0; i < obj.length; i++){
		toReturn+= "<option value='"+i+"'>" + obj[i].name + "</option>";
	}
	return toReturn;
}

$("#hotels").html(getNames(all_hotels));
$("#restaurants").html(getNames(all_restaurants));
$("#toDos").html(getNames(all_things_to_do));

// REMOVE CLICK HANDLER 
var removeClick = function (){
		self = $(this);
		console.log(self.parent());
		self.parent().data(markerName).marker.setMap(null); 
		self.prev().remove();
		self.remove();
};

//ADDING SELECTIONS 
var delBtn = '<button class="btn btn-xs pull-right btn-danger remove btn-circle">x</button>';
$(".panel-body").on("click", ".remove", removeClick);

// hotel click handler; 
$("#hotels").next().click(function(){
	if($("#hotelItinerary").children().length !== 2){
		index = $("#hotels option:selected").val();
		lat = all_hotels[index].place[0].location[0];
		lon = all_hotels[index].place[0].location[1];
		var latlon = new google.maps.LatLng(lat, lon);
		var hotelLocation = new google.maps.Marker({
			position: latlon
		});
		hotelLocation.setMap(map);
		markerName = $("#day-title span").text();
		$("#hotelItinerary").data(markerName, {marker: hotelLocation});
		hotel = $("#hotels option:selected").text();
		$("#hotelItinerary").html("<span class='title'>" + hotel + "</span>" + delBtn);
	} 

});

//Restraunts click handler;
$("#restaurants").next().click(function(){
	if($("#restaurantItinerary").children().length < 6){
		restaurant = $("#restaurants option:selected").text();
		index = $("#restaurants option:selected").val();
		lat = all_restaurants[index].place[0].location[0];
		lon = all_restaurants[index].place[0].location[1];
		var latlon = new google.maps.LatLng(lat, lon);
		var restaurantLocation = new google.maps.Marker({
			position: latlon
		});
		restaurantLocation.setMap(map);
		markerName = $("#day-title span").text();
		$("#restaurantItinerary").data(markerName, {marker: restaurantLocation});
		$("#restaurantItinerary").html($("#restaurantItinerary").html() + "<span class='title'>" + restaurant + "</span>" + delBtn);
	}
});


//To do click handler; 
$("#toDos").next().click(function(){
	todo = $("#toDos option:selected").text();
	$("#todoItinerary").html($("#todoItinerary").html() + "<span class='title'>" + todo + "</span>" + delBtn);
});





