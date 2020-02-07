"use strict";
(function(){
    let data = ""
    let svgContainer = ""
    // dimensions for svg
    const measurements = {
        width: 800,
        height: 500,
        marginAll: 50
    }

    // load data and append svg to body
    svgContainer = d3.select('body').append("svg")
        .attr('width', measurements.width)
        .attr('height', measurements.height);
    d3.csv("pokemon.csv")
        .then((csvData) => data = csvData)
        .then(() => makeScatterPlot())




    function makeScatterPlot() {
        // get arrays of GRE Score and Chance of Admit
        let sp = data.map((row) => parseInt(row["Sp. Def"]))
        let total = data.map((row) =>  parseFloat(row["Total"]))
        // find range of data
        const limits = findMinMax(sp, total)
        // create a function to scale x coordinates
        let scaleX = d3.scaleLinear()
            .domain([limits.greMin - 5, limits.greMax])
            .range([0 + measurements.marginAll, measurements.width - measurements.marginAll])
        // create a function to scale y coordinates
        let scaleY = d3.scaleLinear()
            .domain([limits.admitMax, limits.admitMin - 0.05])
            .range([0 + measurements.marginAll, measurements.height - measurements.marginAll])

        drawAxes(scaleX, scaleY)

        plotData(scaleX, scaleY)

        svgContainer.append('text')
          .attr('x', 200)
          .attr('y', 490)
          //.attr('transform', 'rotate(-90,0)')
          .attr('fill', 'black')
          .text("Sp. Def")

          svgContainer.append('text')
          .attr('x', -200)
          .attr('y', 15)
          .attr('transform', 'rotate(-90)')
          .attr('fill', 'black')
          .text("Total")

          
              
    }

    function findMinMax(sp, total) {
        return {
            greMin: d3.min(sp),
            greMax: d3.max(sp),
            admitMin: d3.min(total),
            admitMax: d3.max(total)
        }
    }

    function drawAxes(scaleX, scaleY) {
        // these are not HTML elements. They're functions!
        let xAxis = d3.axisBottom()
            .scale(scaleX)

        let yAxis = d3.axisLeft()
            .scale(scaleY)

        // append x and y axes to svg
        svgContainer.append('g')
            .attr('transform', 'translate(0,450)')
            .call(xAxis)

        svgContainer.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis)
    }

    function plotData(scaleX, scaleY) {





        const colors = {

            "Bug": "#4E79A7",
        
            "Dark": "#A0CBE8",
        
            "Electric": "#F28E2B",
        
            "Fairy": "#FFBE7D",
        
            "Fighting": "#59A14F",
        
            "Fire": "#8CD17D",
        
            "Ghost": "#B6992D",
        
            "Grass": "#499894",
        
            "Ground": "#86BCB6",
        
            "Ice": "#FABFD2",
        
            "Normal": "#E15759",
        
            "Poison": "#FF9D9A",
        
            "Psychic": "#79706E",
        
            "Steel": "#BAB0AC",
        
            "Water": "#D37295"
        
     }

        // setup fill color for legend
        const cValue = function(d) { return d["Type 1"];}
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const xMap = function(d) { return scaleX(+d["Sp. Def"]) }
        const yMap = function(d) { return scaleY(+d["Total"]) }

        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const circles = svgContainer.selectAll(".circle")
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', xMap)
                .attr('cy', yMap)
                .attr('r', 5)
                .attr('fill', function(d) { return color(cValue(d));})
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div	.html(d["Name"] + "<br/>"+ d["Type 1"] + "<br/>"+ d["Type 2"])
                        .style("left", (d3.event.pageX + 3) + "px") 
                        .style("top", (d3.event.pageY - 30) + "px");
                    })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });




            const generations = ["all",1,2,3,4,5,6]

            const legendary = ["all", 'True', 'False']

            let filter1 = d3.select('#filterL')
                .append('select')
                .attr("id", "filter1")
                .selectAll('option')    
                .data(legendary)
                .enter()
                    .append('option')
                    .attr('value', function(d) {
                        return d 
                    })
                    .html(function(d) { 
                        return d 
                    })
            filter1 = d3.select("#filter1")

            let filter2 = d3.select('#filterGen')
                .append('select')
                .attr("id", "filter2")   
                .selectAll('option')
                .data(generations)
                .enter()
                    .append('option')
                    .html(function(d) { return d })
                    .attr('value', function(d) { return d })
            filter2 = d3.select("#filter2")


            // filter2.on("change", function() {
            //     var selected = this.value;
            //     displayOthers =  ? "inline" : "none";
            //     display = this.checked ? "none" : "inline";
            //     console.log(selected)
            
            //     svgContainer.selectAll(".circle")
            //         .filter(function(d) {return selected != d.Legendary;})
            //         .attr("display", displayOthers);
                    
            //     svgContainer.selectAll(".circle")
            //         .filter(function(d) {return selected == d.Legendary;})
            //         .attr("display", display);
            // });



            // a funcion that update the chart
            function update() {
                let filter1 = document.getElementById("filter1")
                let filter1Value = filter1.options[filter1.selectedIndex].value
                let filter2 = document.getElementById("filter2")
                let filter2Value = filter2.options[filter2.selectedIndex].value
                console.log(filter1Value)
                console.log(filter2Value)
                // debugger
                d3.selectAll("circle")
                    .attr("display", "inline")
                if (filter1Value == "all" && filter2Value == "all") {
                    // show everything
                } else if (filter1Value == "all") {
                    // only filter on filter2
                    d3.selectAll("circle") 
                    .filter(function(d) {
                        console.log(d.Legendary)
                        return !(filter2Value == (d.Generation))}
                    )
                    .attr("display", "none")
                    
                } else if (filter2Value == "all") {
                    // only filter on filter1
                    d3.selectAll("circle") 
                    .filter(function(d) {
                        console.log(d.Legendary)
                        return !(filter1Value == (d.Legendary))}
                    )
                    .attr("display", "none")
                } else {
                    d3.selectAll("circle") 
                                .filter(function(d) {
                                    console.log(d.Legendary)
                                    return !(filter1Value == (d.Legendary + "") && filter2Value == (d.Generation))}
                                )
                                .attr("display", "none")
                }
                
            }

            filter2.on("change", update)
            filter1.on("change",update)


            // filter2.on("change", function(){
            //     var selected = this.value;
            //     update(selected)
            //     console.log(selected)
            // })




        // draw legend

        let svgLegend = ""
        svgLegend = d3.select('body').append("svg")
        .attr('width', 300)
        .attr('height', measurements.height);

        var legend = svgLegend.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
        .attr("x", 70)
        .attr("y", 90)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

        // draw legend text
        legend.append("text")
        .attr("x", 140)
        .attr("y", 100)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})
                
    }


    

})()
