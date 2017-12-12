var tiles = document.querySelectorAll("#districts g");
var screenWidth = Math.max (document.documentElement.clientWidth, window.innerWidth || 0);
var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var cursorX;
var cursorY;
var chart;
var currentData;

document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
};
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


//Function to render the drop down 
function renderDropDown(crimes){

    $($dropdown).html("");
    $.each(crimes, function(i, crime) {
        if (i!="FIELD1" && i!="FIELD11" && i!= "FIELD12"){
            str = "<li data-field='"+i+"'><a href='javascript:void(0);'>"+crime.replace("OTHER", "Other Crimes")+"</a></li>";
            $($dropdown).append(str);
        }

    });

    $($dropdown).children("li").on("click", function(){

        $('#list-heading').text($(this).text());
        $('.listholder').hide();
        updateChart($(this).data("field"));
        $('td.highlight').removeClass('highlight');
        $('td.'+$(this).data("field")).addClass('highlight')

    });

    $('.excerpt').text(crimes.FIELD12)

}

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function renderTable(data){


    $('#mobile-table-container').html("");

    $table = "";

    $.each(data, function(i, field) {

        if (i!=0){
            //Create Row
            $row = "<tr class='"+slugify(field.FIELD1)+"'>"
            //Create Cells
            $.each(field, function(i, col) {
                    if(col==""){
                        col = 0;
                    }
                    if(typeof col === "string"){
                        col = col.replace('Other', 'Other *')
                        col = col.replace('Impr/Det Suspended', 'Jail/Detention Suspended')
                    }
                  $row = $row + "<td class='"+i+"'>"+col+"</td>"
            })
            $row = $row + "</tr>"
            //Append to table
            $table = $table + $row;
        }




    });

     //Update Table
     $('#table').html($table);

     if(screenWidth <= 500){
        $('#mobile-table-container').html( $('.full-results').clone().html() )
     }


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
                $('td.FIELD11').addClass('highlight');
            }
        });
    }

loadChart = function(blah){

    currentData = blah;

    // Generate Data
    data=[];
    var overallTotal = 0;
    $.each(blah, function(i, field) {
        if(i!=0){
            data.push([field.FIELD1, field.FIELD11.replace(",", '')])
            overallTotal+=parseInt(field.FIELD11.replace(",", ''))
        }
    });

    //Update Counter
    count(overallTotal);

    // Create the chart
    chart = bb.generate({
        "data": {
            "columns": data,
            "type": "donut",
            "onclick": function (d, i) {},
            "onover": function (d, i) {},
            "onout": function (d, i) {},  
        },
        "legend": {
            "position":(screenWidth>500)?"right":"bottom"
        },
        "color": {
     pattern: ["#6CBAC4", "#DF7F9F", "#82C685", "#DB9971", "#91A8B3", "#C9CF87", "#EFE567", "#C78282", "#BAA6D3", "#B0CFE9", "#9EDDCF"]
 },         
        
        "bindto": "#DonutChart"
    });

};

//Function to filter the exiting map by offence
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
            data.push([item.FIELD1, val]);
        }
        
    });
    count(self.total);
    chart.load({columns:data});
};


var action = (screenWidth>500)?"click":"touchend";

for (var i = tiles.length; i--;) {

    me = tiles[i];



    //Load data and update UI when user clicks on a district
    me.addEventListener(action, function(el){

        cur = document.getElementsByClassName("selected");
        if (cur.length>0){
            cur[0].setAttribute("class", "");
        }
        this.setAttribute("class", "selected");

        id = this.getAttribute("id")

        loadData("data/"+id+".json");

        $('#count, .right, .full-results, .list-title, .disclaimer').show();
        $('.essay').hide();
        $('#results-table').attr('style', 'display:table!important');
        $('#list-heading').text("Offenses");

        $('#title').text(this.getAttribute("id").replace("district", "District "));
        $('.excerpt').text("We need to put the towns in here")


    });

    //Create tooltip on rollover
    tooltip = document.getElementById("tooltip")
    me.addEventListener("mouseover", function(el){
        tooltip.style.display = "block";        
        tooltip.style.left = cursorX-30 + 'px';
        tooltip.style.top = cursorY-90 + 'px';
        tooltip.innerHTML = this.getAttribute("id").replace("district", "District ")

    });

}

//Remove tooltip after rolling out of SVG map
var map = document.querySelectorAll('svg')[0];
map.addEventListener("mouseout", function(el){
    document.getElementById("tooltip").style.display = "none";
});


//Mobile X button
document.getElementById('ex1').addEventListener("click", function(el){
$('.mobile-heading').hide();
});

document.getElementById('the-btn').addEventListener("touchend", function(el){
$('.mobile-heading').hide();
});

document.getElementById('ex2').addEventListener("click", function(el){
$('.right, .full-results').hide();
    cur = document.getElementsByClassName("selected");
    if (cur.length>0){
        cur[0].setAttribute("class", "");
    }

});

//Show list items on heading click
$('.list-title').on("click", function(){
   $('.listholder').show();
});

