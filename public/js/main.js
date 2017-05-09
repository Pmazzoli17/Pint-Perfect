"use strict";

$(document).ready(function() {

	// initialize select box
    $('select').material_select();
    // initialize nav bar
    $('.button-collapse').sideNav();
    // initialize headline image
    $('.parallax').parallax();
    //popout list-group
    $('.collapsible').collapsible();

      //events part of search //sort objects alphabetically
  var eventNames = Object.keys(events).sort();

    //append all events into option form
  for (var i = 0; i < eventNames.length; i++) {
      $('#eventName').append($('<option>' + eventNames[i] + '</option>').val(eventNames[i]));
  }

    ///////////////find beers for event
  $('#eventName').on('change', function() {
      var eName = $(this).val();

      $('.recommend').addClass('hidden');
      $('.recommend').removeClass('hidden');

      clearResults();

      $('html, body').animate({
        scrollTop: $('#result').offset().top}, 3000);

      var beerArr = events[eName];

      for (var i = 0; i < beerArr.length; i++) {

          var $btn = $('<button>')
              .addClass('getStyle')
              .addClass('btn-large waves-effect green darken-3')
              .val(beerArr[i].value)
              .text(beerArr[i].name);

          $btn.click(function(e) {
              findBeer($(this).val());
          });

          $('.buttonDiv').append($btn);

      } //end loop
  }); // end eventName

    ///////////////find beers function used by event
  var findBeer = function(styleId) {

      $.ajax({
        url: 'https://api.brewerydb.com/v2/beers/?key= c55a5013e5a80a7820219511604675a9&availableId=1&styleId=' + styleId + '&withBreweries=Y',

        type: 'GET',
        crossDomain : true,
        data: {
            format: 'json'
        },
        error: function() {
            alert('An error has occurred');
        },
        success: function(beerData) {
            $('.recommend').addClass('hidden');
            $('.beerResult').html('');
            $('.localBreweries').addClass('hidden');

            for (var i = 0; i < 3; i++) {
                  if(beerData.data[i].breweries[0].name !== " " && beerData.data[i].name !== " " && beerData.data[i].description !== " "){

                    $('.beerResult').append('<li><div class="collapsible-header grey-text text-darken-3">' + beerData.data[i].name + '</div><div class="collapsible-body white grey-text text-darken-3 left-align"><p>' + beerData.data[i].description + '<br><strong>Brewery: ' + beerData.data[i].breweries[0].name + '</strong></p></div></li>');
                  }
            }
        } // end success
      }); //end ajax

  }; //end findBeer function

  ///////////find breweries // input is 5 digit number
  $('#find-nearby').on('click', function(e) {
      e.preventDefault();
      var userZipNear = parseInt($('.userNearZip').val());
      $('.userNearZip').val('');
      $('.recommend').addClass('hidden');

      clearResults();

      if (userZipNear > 500 && userZipNear < 99999) {

        $.ajax({
           url: 'https://api.brewerydb.com/v2/locations/?key=c55a5013e5a80a7820219511604675a9&postalCode=' + userZipNear,

          type: 'GET',
          crossDomain : true,
          data: {
              format: 'json'
          },
          error: function() {
              alert('An error has occurred');
          },
          success: function(results) {
            $('.localBreweries').removeClass('hidden');

              if ('data' in results) {
                $('html, body').animate({
                  scrollTop: $('#result').offset().top}, 3000);

                $('.localBreweries').html('<h6 class="black-text"><strong>Breweries found in zip code <em>'+ userZipNear + '</em>.</h6>');

                  for (var i = 0; i < 10; i++) {
                      $('.beerResult2').append("<tr><td><a class='bLinks' href='" + results.data[i].brewery.website + "'target='_blank'>" + results.data[i].brewery.name + "</a></td><td>" + results.data[i].streetAddress + "</td><td>" + results.data[i].locality + ", " + results.data[i].region + "</td></tr>");
                  }
              } else {
                  Materialize.toast('No breweries were found in zip code ' + userZipNear + ' . Try another five digit zip code in the U.S.', 5000);
              }
          } //end success
        }); //end ajax
      } else {
          Materialize.toast('Zip code was not recognized, please enter a five digit zip code in the U.S.', 5000);
      }
  }); //end brewery finder

  //clear previous results
  var clearResults = function(){
    $('.beerResult').html('');
    $('.beerResult2').html('');
    $('.buttonDiv').html('');
    $('.localBreweries').html('');
  };

})
