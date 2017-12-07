var tiles = document.querySelectorAll("#districts g");



var chart;
var currentData;
$dropdown = $("#dropdown");


function renderDropDown(crimes){

    $($dropdown).html("");
    $.each(crimes, function(i, crime) {
        str = "<li data-field='"+i+"'><a href='javascript:void(0);'>"+crime+"</a></li>";
        $($dropdown).append(str);

    });

    $($dropdown).children("li").on("click", function(){


        $('.list-title').text($(this).text());
        $('.listholder').hide();
        updateChart($(this).data("field"));

    });

}




 function loadData(file) {

        $.ajax({
            url: file,
            cache: true,
            success: function (data) {
                if (data.length < 1) {
                    return;
                }

                renderDropDown(data.Outcome);
                loadChart(data);



            }
        });
    }












loadChart = function(blah){



    currentData = blah;


    data=[];

    $.each(blah, function(i, field) {


        if(i!="Outcome"){
            data.push([i, field.FIELD11])
        }


    });



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
            "title": "Outcome"
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


updateChart =  function(field){



    this.field = field;

    var self = this;

    $.each(currentData, function(i, item) {
        if(i!="Outcome") {
            data.push([i, item[self.field]]);
        }
    });



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

        loadData("district1.json");



        $('.list-title').show().text("Offenses");

        $('#title').text(this.getAttribute("id").replace("district", "District "));
        $('.excerpt').text("We need to put the towns in here")


    });

}



$('.list-title').on("click", function(){
   $('.listholder').show();
});

