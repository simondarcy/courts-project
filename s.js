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

function renderTable(data){

    $table = "";


     $.each(data, function(i, field) {

        if (i!=0){

            $row = "<tr>"


            
            $.each(field, function(i, col) {
                    if(col==""){
                        col = 0;
                    }
                  $row = $row + "<td>"+col+"</td>"
            })

            $row = $row + "</tr>"

            $table = $table + $row;
        }

    });


     $('#table').html($table);


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
                renderTable(data);



            }
        });
    }






loadChart = function(blah){



    currentData = blah;


    data=[];
    var overallTotal = 0;

    $.each(blah, function(i, field) {


        if(i!=0){
            data.push([field.FIELD1, field.FIELD11.replace(",", '')])
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
            
            // colors: {
            //   "Community Service Order":"#6CBAC4",
            //   "Dismiss": "#DF7F9F",
            //   "Disqualification":"#82C685",
            //   "Fine":"#DB9971",
            //   "Impr/Det Suspended":"#91A8B3",
            //     "Imprisonment/Detention":"#C9CF87",
            //     "Other":"#EFE567",
            //     "Peace Bond":"#C78282",
            //     "Probation":"#BAA6D3",
            //     "Strike Out":"blue",
            //     "Taken Into Consideration":"aqua"
            // }
        },
        "legend": {
            "position": "right"
        },
        "color": {
     pattern: ["#6CBAC4", "#DF7F9F", "#82C685", "#DB9971", "#91A8B3", "#C9CF87", "#EFE567", "#C78282", "#BAA6D3", "#ff0000", "#000000"]
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
  "Community Service Order",
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
    data = []



    $.each(currentData, function(i, item) {

        if(i!=0){
        
    
            val = item[self.field];

            if(val==""){
                val="0"
            }

            val = parseInt(val.replace(",", ''))
            self.total += val

            console.log( fields[i]+", " +val)
            console.log(item.FIELD1+", "+val)

            data.push([item.FIELD1, val]);
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
        $('#results-table').attr('style', 'display:table!important');
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

