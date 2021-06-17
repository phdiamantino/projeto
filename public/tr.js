
//<script src="https://d3js.org/d3-array.v2.min.js"></script>
const MARGIN3 = {LEFT:30, RIGHT:40, TOP:20, BOTTOM:30}
const WIDTH3 = 700 - MARGIN3.LEFT - MARGIN3.RIGHT
const HEIGHT3 = 270 - MARGIN3.TOP - MARGIN3.BOTTOM


// Add SVG
var svgTR = d3.select("#themeRiver").append("svg")
        .attr("width", WIDTH3 + MARGIN3.LEFT + MARGIN3.RIGHT)
        .attr("height", HEIGHT3 + MARGIN3.TOP + MARGIN3.BOTTOM)
    .append("g")
        .attr("transform", "translate(" + MARGIN3.LEFT + "," + MARGIN3.TOP + ")");

        var tooltipTR = d3.select("#themeRiver")
        .style("font-family", "Verdana" )
        .append("div").attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "20")
            .style("opacity", 0)
            .style("font-size", 10)
            .style("visibility", "hidden")
            .style("width", "300px")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            //.style("border", "solid")
            //.style("background-color", "red")
        

var format = d3.timeParse("%Y-%m-%d")    
var datearray = [];
function version(s) {if (s >=(new Date("Mon Dec 27 2004 22:00:00 GMT-0200 (Horário de Verão de Brasília)")) && (s <(new Date("Mon Apr 13 2009 21:00:00 GMT-0300 (Horário Padrão de Brasília)")))) {
    return "r3.8.2";
  } else if (s >=(new Date("Mon Apr 13 2009 21:00:00 GMT-0300 (Horário Padrão de Brasília)")) && (s <(new Date("Mon Jul 27 2009 21:00:00 GMT-0300 (Horário Padrão de Brasília)")))) {
    return "r4.6"
  } else if (s >=(new Date("Mon Jul 27 2009 21:00:00 GMT-0300 (Horário Padrão de Brasília)")) && (s <(new Date("Mon Nov 30 2009 22:00:00 GMT-0200 (Horário de Verão de Brasília)")))) {
    return "r4.7"
  }else if (s >=(new Date("Mon Nov 30 2009 22:00:00 GMT-0200 (Horário de Verão de Brasília)")) && (s <(new Date("Sun Aug 21 2011 21:00:00 GMT-0300 (Horário Padrão de Brasília)")))) {
    return "r4.8"
  }else if (s >=(new Date("Sun Aug 21 2011 21:00:00 GMT-0300 (Horário Padrão de Brasília)")) && (s <(new Date("Wed Sep 28 2011 21:00:00 GMT-0300 (Horário Padrão de Brasília)")))) {
    return "r4.9"
  }else if (s >=(new Date("Wed Sep 28 2011 21:00:00 GMT-0300 (Horário Padrão de Brasília)")) && (s <(new Date("Mon Nov 12 2012 22:00:00 GMT-0200 (Horário de Verão de Brasília)")))) {
    return "r4.10"
  }else if (s >=(new Date("Mon Nov 12 2012 22:00:00 GMT-0200 (Horário de Verão de Brasília)")) && (s <(new Date("Wed Dec 03 2014 22:00:00 GMT-0200 (Horário de Verão de Brasília)")))) {
    return "r4.11"
  }else if (s >=(new Date("Wed Dec 03 2014 22:00:00 GMT-0200 (Horário de Verão de Brasília)")) && (s <(new Date("Tue Feb 20 2017 21:00:00 GMT-0300 (Horário Padrão de Brasília)")))) {
    return "r4.12"
  }else {
    return "master"
  }}
  

d3.csv("data/excomment_sentiments_junit_correto_quintil.csv",d3.autoType).then(function(data) {

        data.forEach(function(d) {
            d.score = +d.score;
            d.value = +d.value;
        });
        console.log(data);

        group = ['score_quintil','score_decil']

        var nest = d3.nest()
                .key(d=> d.date)
                .key(d=>d.score_quintil)
                .rollup(v=> d3.sum(v, d=>d.score))
            .entries(data)
        //console.log(nest) 
        var nest_decil = d3.nest()
                .key(d=> d.date)
                .key(d=>d.score_decil)
                .rollup(v=> d3.sum(v, d=>d.score))
            .entries(data)
        console.log(nest_decil)


        newData = [];
        nest_decil.forEach(d => {
        var tempObj = {}
        //console.log(d)
        d.values.forEach(e => {
                tempObj[e.key] = e.value,
                tempObj.date = d.key;
            })
            newData.push(tempObj)
        });
    

    var keys_score_quintil = ["0", "1", "2","3", "4", "5"]
    var keys_score_decil = ["0", "1", "2","3", "4", "5","6", "7", "8","9", "10"]

        // Paleta de cores
        var color_quintil = d3.scaleLinear()
                .domain(keys_score_quintil)   
                .range(d3.schemeYlOrBr[5])  
                // d3.schemeOranges[k] // d3.schemeGreens[k] d3.schemeYlGn[k]
              
        var color_decil= d3.scaleLinear()
                .domain(keys_score_decil)   
                .range(d3.schemeYlOrBr[7])
                //.range(d3.schemeYlGnBu[9])
    // Stack 
    var stackedData = d3.stack()
        .keys(keys_score_decil)
        .offset(d3.stackOffsetWiggle) //.offset(d3.stackOffsetSilhouette//stackOffsetWiggle)
        .value((d,key)=> d[key] ==  undefined?0:d[key])
        (newData)
    console.log(stackedData)

    
// Add X & Y axis      
    // X axis  
    var xScale =  d3.scaleTime()
            .domain(d3.extent(data, d=> d.date))
            .range([0, WIDTH3]);
        svgTR.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + HEIGHT3 + ")")
            .call(d3.axisBottom(xScale))
            .select(".domain").remove();
        svgTR.selectAll(".tick line").attr("stroke", "#b8b8b8")
            //Colocar nome TIME(YEAR)
            svgTR.append("text")
            .attr("text-anchor", "end")
            .attr("x", WIDTH3-520)
            .attr("y", HEIGHT3-10 )
            .text("Time (Year)");
    // Y axis 
    var yScale = d3.scaleLinear()
            .domain([d3.min(stackedData, l => d3.min(l, d => d[0])),
                     d3.max(stackedData, l => d3.max(l, d => d[1]))]).nice()
            .range([ HEIGHT3, 0 ]);
        svgTR.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale));
        //svgTR.append("g")
            //.attr("class", "y axis")
            //.attr("transform", "translate(" + WIDTH3 + ", 0)")
            //.call(d3.axisRight(yScale));

            
    var area = d3.area()
            .curve(d3.curveMonotoneX)
            .x((d,i)=> xScale(new Date(d.data.date)))
            .y0(d=> yScale(d[0]))
            .y1(d=> yScale(d[1]))

    // Elementos de interação
    svgTR.selectAll(".layer")
        .attr("opacity", 1)
        .on("mouseover", function(d, i) {
            svgTR.selectAll(".layer")
            .transition()
            .duration(250)
        })

        // Mouseover
        var mouseover = function(d) {
            tooltipTR.style("opacity", 1)
            d3.selectAll(".myArea").style("opacity", .3)
            d3.select(this)
                .style("stroke", "#121212") //black #121212
                .style("opacity", 1)
        }

        //Exibe informações ao passar o mouse
        var mousemove = function(d,i) {
            console.log(d)
            mousex = d3.mouse(this);
            mousex = mousex[0];
            console.log(xScale.invert(mousex))
            var invertedx = xScale.invert(mousex);
            var selected = (d)
            //console.log(new Date(selected[5].data.date))
            for (var k = 0; k < selected.length; k++) {
                datearray[k] = new Date(selected[k].data.date)
                //mid = datearray[k]
                //datearray[k] =  mid.getDate();
            }
            console.log(datearray[mousex]);
            mousedate = datearray.indexOf(invertedx);
            //console.log(mousedate)
            //console.log(d[mousedate])
            //comments = d[mousedate].data.comment_cleaned
            d3.select(this)
                .classed("hover", true)
                .attr("stroke-width", "0.5px"), 
            tooltipTR.html("<b>"+"Score: " +"</b>" + d.key
                                +"</br>"+"<b>"+"Version: " +"</b>" + version(invertedx)
                                +"</br>"+"<b>"+"Comments: " +"</b>" + "comments")
                .style("visibility", "visible")
                .style("top",  (d3.mouse(this)[1]) + "px")
                .style("left", (d3.mouse(this)[0]+50)+ "px")  
                 
        }


        //Retornar o gráfico de volta ao normal
        var mouseleave = function(d,i) {
            tooltipTR.style("opacity", 0)
            d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
                .transition().duration(250)
                .attr("opacity", "1");
            d3.select(this)
                .classed("hover", false)
                .attr("stroke-width", "0px"), 
            tooltipTR.html("<b>"+"Score: " +"</b>" + d.key
                +"</br>"+"<b>"+"Version: " +"</b>" + i
                +"</br>"+"<b>"+"Comments: " +"</b>" + "comments")
            .style("visibility", "hidden")
        }

        // Exbibe a área 
        svgTR.selectAll(".layer")
        .data(stackedData).enter()
        .append("path").attr("class", "myArea")
        .style("stroke-width",0.3)
        //.style("fill",d=> console.log(d))
        .style("fill", ((d,i)=> color_decil(d.key)))
        .attr("d", area)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            


    // Criar linha vertical - mouse
    var vertical = d3.select("#themeRiver")
        .append("div").attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "1.65px")
        .style("height", "220px")
        .style("top", "10px")
        .style("bottom", "20px")
        .style("left", "0px")
        .style("background", "#ff5")
    d3.select("#themeRiver")
        .on("mousemove", function(){  
            mousex = d3.mouse(this);
            mousex = mousex[0] + 5;
            vertical.style("left", mousex + "px" )})
        .on("mouseover", function(){  
            mousex = d3.mouse(this);
            mousex = mousex[0] + 5;
            vertical.style("left", mousex + "px")});


})

/*         <div id="custom-select-tr" >
          <select>
            <option value="1">Quintil</option>
            <option value="2">Decil</option>
          </select>*/