var tiles = document.querySelectorAll("#districts g");

var cursorX;
var cursorY;
document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

var chart;
var currentData;
$dropdown = $("#dropdown");


var currentCount = 0;

    function count(num) {

        var options = {
            "useEasing": true,
            "useGrouping": true,
            "separator": ',',
            "decimal": '.'
        };
        var demo = new CountUp('count', currentCount, num, 0, 2.5, options).start();

        currentCount = num;
    }






function renderDropDown(crimes){

    $($dropdown).html("");
    $.each(crimes, function(i, crime) {
        if (i!="FIELD1" && i!="FIELD11" && i!= "FIELD12"){
            str = "<li data-field='"+i+"'><a href='javascript:void(0);'>"+crime+"</a></li>";
            $($dropdown).append(str);
        }

    });

    $($dropdown).children("li").on("click", function(){

        $('#list-heading').text($(this).text());
        $('.listholder').hide();
        updateChart($(this).data("field"));

    });


    $('.excerpt').text(crimes.FIELD12)



}




 function loadData(file) {

        $.ajax({
            url: file,
            cache: true,
            success: function (data) {
                if (data.length < 1) {
                    return;
                }

                renderDropDown(data[0]);
                loadChart(data);



            }
        });
    }






loadChart = function(blah){



    currentData = blah;


    data=[];
    var overallTotal = 0;

    $.each(blah, function(i, field) {


        if(i!=0){
            data.push([field.FIELD1, field.FIELD11])
            overallTotal+=parseInt(field.FIELD11.replace(",", ''))
        }


    });


    count(overallTotal);






    // Script
    chart = bb.generate({
        "data": {
            "columns": data,
            "type": "donut",
            "onclick": function (d, i) {},
            "onover": function (d, i) {},
            "onout": function (d, i) {},           
        },
        "legend": {
            "position": "right"
        },
        "donut": {
           
        },
        "labels": {
            "format": {
                "Outcome": function (x) {

                    console.log(x)
                    return d3.format('$')(x)
                }
            }
        },
        "bindto": "#DonutChart"
    });




};


fields = [
  "Outcome",
  "Dismiss",
  "Disqualification",
  "Fine",
  "Impr/Det Suspended",
  "Imprisonment/Detention",
  "Other",
  "Peace Bond",
  "Probation",
  "Strike Out",
  "Taken Into Consideration",
  ]

updateChart =  function(field){


    this.field = field;
    this.total=0;

    var self = this;



    $.each(currentData, function(i, item) {

        if(i!=0){
        
            

            val = item[self.field];

            if(val==""){
                val="0"
            }

            val = parseInt(val)
            self.total += val
            data.push([fields[i], val]);
        }
        
    });

    count(self.total);



    chart.load({
                columns:data
            });




};


for (var i = tiles.length; i--;) {

    me = tiles[i];

    me.addEventListener("click", function(el){

        cur = document.getElementsByClassName("selected");
        if (cur.length>0){
            cur[0].setAttribute("class", "");
        }
        this.setAttribute("class", "selected");


        id = this.getAttribute("id")

        loadData("data/"+id+".json");


        $('.list-title').show();
        $('#count').show();
        $('#list-heading').text("Offenses");

        $('#title').text(this.getAttribute("id").replace("district", "District "));
        $('.excerpt').text("We need to put the towns in here")


    });


    tooltip = document.getElementById("tooltip")

    me.addEventListener("mouseover", function(el){

        tooltip.style.display = "block";        
        tooltip.style.left = cursorX-50 + 'px';
        tooltip.style.top = cursorY-90 + 'px';

        tooltip.innerHTML = this.getAttribute("id")

    });

}




var map = document.querySelectorAll('svg')[0];

 map.addEventListener("mouseout", function(el){

        document.getElementById("tooltip").style.display = "none";
    

    });



$('.list-title').on("click", function(){
   $('.listholder').show();
});

