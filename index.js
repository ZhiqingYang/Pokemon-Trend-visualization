"use strict";
(function(){
    let data = ""
    let svgContainer = ""
    // dimensions for svg
    const measurements = {
        width: 1000,
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
                    div	.html(d["Name"] + "<br/>"+ d["Type 1"])
                        .style("left", (d3.event.pageX) + "px") 
                        .style("top", (d3.event.pageY - 28) + "px");
                    })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });




            const generations = [1,2,3,4,5,6]

            const legendary = ['TRUE', 'FALSE']

            let filter1 = d3.select('#filterL')
                .append('select')
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

            let filter2 = d3.select('#filterGen')
                .append('select')   
                .selectAll('option')
                .data(generations)
                .enter()
                    .append('option')
                    .html(function(d) { return d })
                    .attr('value', function(d) { return d })


            filter2.on("change", function() {
                var selected = this.value;
                displayOthers = this.checked ? "inline" : "none";
                display = this.checked ? "none" : "inline";
            
            
                svgContainer.selectAll(".circle")
                    .filter(function(d) {return selected != d.Legendary;})
                    .attr("display", displayOthers);
                    
                svgContainer.selectAll(".circle")
                    .filter(function(d) {return selected == d.Legendary;})
                    .attr("display", display);
            });




        // draw legend
        var legend = svgContainer.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
        .attr("x", measurements.width - 20)
        .attr("y", 80)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

        // draw legend text
        legend.append("text")
        .attr("x", measurements.width - 50)
        .attr("y", 100)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})
                
    }


    

})()
