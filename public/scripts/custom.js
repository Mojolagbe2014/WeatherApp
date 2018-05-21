$(document).ready(function(){
    var thisPet = $('#temp-details');
    var messageBox = $('.message-box');
    var responseBox = $('#weather-response');
    var thisURL = window.location.href;
    var addForm = $("form");
    
    
    
    if (thisURL.indexOf("/add") < 0){
        checkWeather(thisPet, messageBox, responseBox);
    }
    
    if (thisURL.indexOf("/add") >= 0){
        getLocation(addForm);
    }
    
    $('#latitude, #longitude').on('change paste keyup', function() {
        var latit = $('#latitude').val();
        var longit = $('#longitude').val();
        reverseGeoLocation(latit, longit, addForm);
    });
    
    $("form#AddPet").submit(function(e){ 
        e.stopPropagation();
        e.preventDefault();
        
        var formData = {};
        $('#AddPet :input').each(function() {
            if(this.name !="") formData[this.name] = $(this).val();
        });
        //console.log(formData);
        //var testData = {name: 'name', type: 'type', breed: 'breed', location:'location', latitude:90, longitude:-90};
        
        $.ajax({
            url: $(this).attr("action"),
            type: 'POST',
            dataType: 'json',
            data: formData,
            beforeSend: function() {
                messageBox.empty().html(('<img src="public/images/loading.gif" width="50" height="50" alt="Loading..."/>'));
            },
            success : function(data, status) {
                var contents = data.message ? data.message : data;
                if(data.status ===1) { 
                    messageBox.empty().html($('<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>'+contents+'  </div>')); 
                }
                else messageBox.empty().html($('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>'+contents +'</div>'));
            },
            error : function(xhr, status) {
                erroMsg = '';
                if(xhr.status===0){ erroMsg = 'There is a problem connecting to internet. Please review your internet connection.'; }
                else if(xhr.status===404){ erroMsg = 'Requested page not found.'; }
                else if(xhr.status===500){ erroMsg = 'Internal Server Error.';}
                else if(status==='parsererror'){ erroMsg = 'Error. Parsing JSON Request failed.'; }
                else if(status==='timeout'){  erroMsg = 'Request Time out.';}
                else { erroMsg = 'Unknow Error.\n'+xhr.responseText;}          
                messageBox.empty().html($('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>Pet not added.\n '+erroMsg+'</div>'));
            }
        });
        
    });
});

function checkWeather(pet, messageBox, responseBox){
    const apiKey = '752ca7ee5d3924bfb68660d1ad417709';
    const api_url = 'https://api.darksky.net/forecast/'+apiKey+'/'+pet.attr('data-latitude')+','+pet.attr('data-longitude');
    
    $.ajax(api_url, {
        type:"GET",
        dataType:"jsonp",
        data:{}, 
        beforeSend: function() {
            responseBox.addClass('hidden').hide(); 
            messageBox.show().html('<img src="public/images/loading.gif" alt="Loading..."/>');
        },
        success:function(data, status, jqXHR) {
            messageBox.hide();
            responseBox.removeClass('hidden').show();
            console.log(data);
            
            var precipVal = 0;
            $.each(data.hourly.data, function(index, item) { 
                precipVal = item.precipProbability > precipVal ? item.precipProbability : precipVal; 
            });
           alert(precipVal);
            if(data.currently.icon === 'rain' || data.hourly.icon === 'rain' || precipVal > 0.02){
                responseBox.find('h3').text('It looks like '+pet.attr('data-name')+' is going to need one in '+pet.attr('data-location')+'.');
                responseBox.find('h2').text('Yup!');
                responseBox.find('img').attr('src', 'public/images/cat-holding-umbrella.png');
                responseBox.find('#alert-head').addClass('alert-warning');
            } else {
                responseBox.find('h3').text('It looks like '+pet.attr('data-name')+' does not need one in '+pet.attr('data-location')+'.');
                responseBox.find('h2').text('Nope!');
                responseBox.find('img').attr('src', 'public/images/cat-no-umbrella.png');
                responseBox.find('#alert-head').addClass('alert-info');
            }
        },
        error: function(xhr, status, error) {console.log(error);;}
    });
}

function getLocation(selector) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            var latitude = position.coords.latitude,
                longitude = position.coords.longitude;
                
            selector.find('#latitude').val(latitude);
            selector.find('#longitude').val(longitude);
            reverseGeoLocation(latitude, longitude, selector);
        });
    } else {
        selector.find('.message-box').html('Geolocation not supported!!!');
    }
}

function reverseGeoLocation(latitude, longitude, selector) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url:'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true&key=AIzaSyDQ27WgInDdmdUlbeM_-CsTmfY_Jx0LCyg',
        success: function(data)  {
            //console.log(data);
            var city = '';
            var province = '';
            
            for (var i = 0; i < data.results[4].address_components.length; i++) {
                for (var j = 0; j < data.results[4].address_components[i].types.length; j++) {
                    if(data.results[4].address_components[i].types[j] === 'locality') {
                        city = data.results[4].address_components[i].long_name;
                    }
                    if(data.results[4].address_components[i].types[j] === 'administrative_area_level_1') {
                        province = data.results[4].address_components[i].short_name;
                    }
                }
            }
            //selector.find('#location1').val(city+', '+province);
            selector.find('#location').val(city+', '+province);
        }
    });  
}