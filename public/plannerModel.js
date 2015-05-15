//INITIALIZE DATA 
var getNames = function(obj) {
	var toReturn = "";
	for(var i = 0; i < obj.length; i++){
		toReturn+= "<option value='"+i+"'>" + obj[i].name + "</option>";
	}
	return toReturn;
};
$("#hotels").html(getNames(all_hotels));
$("#restaurants").html(getNames(all_restaurants));
$("#toDos").html(getNames(all_things_to_do));

/*----------------------------------------------------------
DATA STRUCTURE 
----------------------------------------------------------*/

var dayStates = [];
var numberDays = 1;
var viewDay = 1; 
var latlon;

//Object Constructor
var dayConstructor = function(hotel, restaurants, things){
	this.hotel = {};
	this.restaurant = [];
	this.things = [];
	this.setRestaurant(restaurants);
	this.setThing(things);
};
//Object Methods
dayConstructor.prototype.setHotel = function(hotel){
	this.hotel = hotel;
};
dayConstructor.prototype.setRestaurant = function(restaurant){
	if(this.restaurant[0] === undefined){
		this.restaurant[0] = restaurant;
	} else if(this.restaurant.length <= 3){
		this.restaurant.push(restaurant);
	}
};
dayConstructor.prototype.setThing = function(thing){
		if(this.things[0] === undefined){
			this.things[0] = thing;
		} else {
			this.things.push(thing);
		}
};
dayConstructor.prototype.getHotel = function(){
	return this.hotel; 
};
dayConstructor.prototype.getRestaurants = function(){
	return this.restaurant; 
};
dayConstructor.prototype.getThings = function(){
	return this.things; 
};

//DAY SETTER FUNCTION TO dayStates
function daySetter(whichDay, hotel, restaurant, thing){
	if(whichDay === numberDays){
		dayStates.push(new dayConstructor());
		numberDays++;
	} else {
		if(hotel !== null){
			dayStates[whichDay].setHotel(hotel);
		}
		if(restaurant !== null){
			dayStates[whichDay].setRestaurant(restaurant);
		}
		if(thing !== null){	
			dayStates[whichDay].setThing(thing);
		}
	}
}
//INITIALIZE FOR DAY 1
daySetter(1); 



/*----------------------------------------------------------
ADD TO ITINERARY 
----------------------------------------------------------*/
//Delete button
var removeClick = function (){
		self = $(this);
		parent = self.parent()[0].id;
		var index = (self.index() - 1) / 2;
		if(parent === "hotelItinerary"){
			dayStates[viewDay - 1].hotel.marker.setMap(null);
			dayStates[viewDay - 1].hotel = {};
		} else if (parent === "restaurantItinerary"){
			dayStates[viewDay - 1].restaurant[index].marker.setMap(null);
			dayStates[viewDay - 1].restaurant.splice(index, 1);
		} else if (parent === "todoItinerary"){
			dayStates[viewDay - 1].things[index].marker.setMap(null);
			dayStates[viewDay - 1].things.splice(index, 1);
		}
		
		self.prev().remove();
		self.remove();
};
var delBtn = '<button class="btn btn-xs pull-right btn-danger remove btn-circle">x</button>';
$(".panel-body").on("click", ".remove", removeClick);

//Add Item click handler 
$("#options").on("click", "button", function(){
	var previousDomEl = $(this).prev()[0];
	var selectedIndex = $(previousDomEl)[0].options.selectedIndex;
	var thisOption = $(previousDomEl)[0].options;
	var selectedName = thisOption[selectedIndex].text;
	var selectedType = previousDomEl.id;
	var itHTML = "<span class='title'>" + selectedName + "</span>" + delBtn;
	

	if(selectedType === "hotels"){
		if($("#hotelItinerary").html() !== itHTML){
			if (!jQuery.isEmptyObject(dayStates[viewDay - 1].hotel)){
				dayStates[viewDay - 1].hotel.marker.setMap(null);
				$("#hotelItinerary").html(itHTML);
			var location = all_hotels[selectedIndex].place[0].location;
			latlon = new google.maps.LatLng(location[0], location[1]);
			var hotelLocation = new google.maps.Marker({
				position: latlon
			});
			hotelLocation.setMap(map);
			//Updating data structure 
			dayStates[viewDay - 1].hotel = {html: itHTML,
				marker: hotelLocation}
			} else {
				$("#hotelItinerary").html(itHTML);
			var location = all_hotels[selectedIndex].place[0].location;
			latlon = new google.maps.LatLng(location[0], location[1]);
			var hotelLocation = new google.maps.Marker({
				position: latlon
			});
			hotelLocation.setMap(map);
			//Updating data structure 
			daySetter(viewDay - 1, {
				html: itHTML,
				marker: hotelLocation
				 },null,null);
			
			}
		
		console.log(dayStates);
		}
	} else if (selectedType === "restaurants"){
		if($("#restaurantItinerary").children().length <= 4){
			$("#restaurantItinerary").html($("#restaurantItinerary").html()+itHTML);
			var location = all_restaurants[selectedIndex].place[0].location;
			latlon = new google.maps.LatLng(location[0], location[1]);
			var restaurantLocation = new google.maps.Marker({
				position: latlon
			});
			restaurantLocation.setMap(map);
			//Updating data structure
			daySetter(viewDay - 1, null, {
			html: itHTML,
			marker: restaurantLocation
			 },null);
			console.log(dayStates);
		}
	} else if (selectedType === "toDos"){
		$("#todoItinerary").html($("#todoItinerary").html()+itHTML);
		var location = all_things_to_do[selectedIndex].place[0].location;
		latlon = new google.maps.LatLng(location[0], location[1]);
		var thingsLocation = new google.maps.Marker({
			position: latlon
		});
		thingsLocation.setMap(map);
		//Updating data structure 
		daySetter(viewDay - 1, null, null, {
		html: itHTML,
		marker: thingsLocation
		 });
		console.log(dayStates);		
	}
	

});










