//////////////////stores table after selection
$(function(){
  // append this attribute to the element you want the html stored of.
  $("#table2").attr("contenteditable", "true")
  var content = document.getElementById('table2');
  // save the page's state after user selects and clicks "select"
  $(".get-started-btn").click(function() {
    localStorage.setItem('page_html2', JSON.stringify(content.innerHTML));
  });
  // retrieve local storage data
  var arr = JSON.parse( localStorage.getItem('page_html2') );
  if (arr) {
    content.innerHTML = arr;
  }
});
/////Retrieve user selections
$(function() {
  /////Retrieve Strain
  document.getElementById("strain").innerHTML = localStorage.plant2Strain;
  /////Retrieve Plant Height
  document.getElementById("Grow").innerHTML = localStorage.plant2Height;
  /////Retrieve Plant Logo
  var plantLogo = localStorage.getItem('plant2Logo');
  $("#image").attr("src" , plantLogo).show();
  /////Retrieve Grow Time
  var vegWeeks;
  vegWeeks = "";
  if(localStorage.plant2Height === "1-2 feet") {
    vegWeeks = "4";
  }
    if(localStorage.plant2Height === "3-4 feet") {
      vegWeeks = "8";
    }
      if(localStorage.plant2Height === "5+ feet") {
        vegWeeks = "8";
      }
        
        document.getElementById("info").innerHTML = (localStorage.plant2Grow*7)+(vegWeeks*7)+18+" days";
       
        //add Inches to LightDistance column _125W _250W _400W _600W _1000W
        if (localStorage.plant2watts === '125W')  {
          $(".lightInches").text("12 Inches");
        }
        if (localStorage.plant2watts === '250W')  {
          $(".lightInches").text("16 Inches");
        }
        if (localStorage.plant2watts === '400W')  {
          $(".lightInches").text("20 Inches");
        }
        if (localStorage.plant2watts === '600W')  {
          $(".lightInches").text("30 Inches");
        }
        if (localStorage.plant2watts === '1000W')  {
          $(".lightInches").text("36 Inches");
        }
        /////Filter table by user selection////////////////////////////
        // filter vegetative days by class in weeks
        if(localStorage.plant2Height === "1-2 feet") {
          $(".eightWeeks").remove();
          $(".twelveWeeks").remove();
          $(".sixteenWeeks").remove();
        }
        if(localStorage.plant2Height === "3-4 feet") {
          $(".twelveWeeks").remove();
          $(".sixteenWeeks").remove();
        }
        if(localStorage.plant2Height === " 5-6 feet") {
          $(".sixteenWeeks").remove();
        }
        // filter flowering days by class in weeks
        if (localStorage.plant2Grow === '4')  {
          $(".fiveFlowering").remove();
          $(".sixFlowering").remove();
          $(".sevenFlowering").remove();
          $(".eightFlowering").remove();
          $(".nineFlowering").remove();
          $(".tenFlowering").remove();
          $(".elevenFlowering").remove();
          $(".twelveFlowering").remove();
          $(".thirteenFlowering").remove();
          $(".fourteenFlowering").remove();
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '5')  {
          $(".sixFlowering").remove();
          $(".sevenFlowering").remove();
          $(".eightFlowering").remove();
          $(".nineFlowering").remove();
          $(".tenFlowering").remove();
          $(".elevenFlowering").remove();
          $(".twelveFlowering").remove();
          $(".thirteenFlowering").remove();
          $(".fourteenFlowering").remove();
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '6')  {
          $(".sevenFlowering").remove();
          $(".eightFlowering").remove();
          $(".nineFlowering").remove();
          $(".tenFlowering").remove();
          $(".elevenFlowering").remove();
          $(".twelveFlowering").remove();
          $(".thirteenFlowering").remove();
          $(".fourteenFlowering").remove();
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '7')  {
          $(".eightFlowering").remove();
          $(".nineFlowering").remove();
          $(".tenFlowering").remove();
          $(".elevenFlowering").remove();
          $(".twelveFlowering").remove();
          $(".thirteenFlowering").remove();
          $(".fourteenFlowering").remove();
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '8')  {
          $(".nineFlowering").remove();
          $(".tenFlowering").remove();
          $(".elevenFlowering").remove();
          $(".twelveFlowering").remove();
          $(".thirteenFlowering").remove();
          $(".fourteenFlowering").remove();
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '9')  {
          $(".tenFlowering").remove();
          $(".elevenFlowering").remove();
          $(".twelveFlowering").remove();
          $(".thirteenFlowering").remove();
          $(".fourteenFlowering").remove();
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '10')  {
          $(".elevenFlowering").remove();
          $(".twelveFlowering").remove();
          $(".thirteenFlowering").remove();
          $(".fourteenFlowering").remove();
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '11')  {
          $(".twelveFlowering").remove();
          $(".thirteenFlowering").remove();
          $(".fourteenFlowering").remove();
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '12')  {
          $(".thirteenFlowering").remove();
          $(".fourteenFlowering").remove();
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '13')  {
          $(".fourteenFlowering").remove();
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '14')  {
          $(".fifteenFlowering").remove();
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '15')  {
          $(".sixteenFlowering").remove();
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '16')  {
          $(".seventeenFlowering").remove();
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '17')  {
          $(".eighteenFlowering").remove();
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '18')  {
          $(".nineteenFlowering").remove();
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '19')  {
          $(".twentyFlowering").remove();
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '20')  {
          $(".twentyoneFlowering").remove();
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '21')  {
          $(".twentytwoFlowering").remove();
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '22')  {
          $(".twentythreeFlowering").remove();
          $(".twentyfourFlowering").remove();
        }
        if (localStorage.plant2Grow === '23')  {
          $(".twentyfourFlowering").remove();
        }

});
////////////task button show////////
$("#start").click(function() {
  $("#taskButton").show();
});
///////////input dates on table//////////////////////
$('.get-started-btn').on('click', function() {
  var startDate = new Date($('#start').val());
  $('.datetime').each(function () {
    var date=startDate;
    date.setDate(date.getDate() + 1);
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    // action to perform.  Use $(this) for changing each cell
    $(this).text(month+"/"+day+"/"+year);
  });
});       

$('.get-started-btn').on('click', function() {
  var startDate = new Date($('#start').val());
  $('.datetime2').each(function () {
    var date=startDate;
    date.setDate(date.getDate() + 1);
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    // action to perform.  Use $(this) for changing each cell
    $(this).text(month+"/"+day+"/"+year);
  });
});       

console.log(localStorage);