
d3.csv("./ProjectData/bubble1718.csv").then(
     function(data) {
     // set the dimensions
     var dimensions = {
          width: 600,
          height: 300
      }

      var svgLegend = d3.select("#bubbleLegend")
                        .style("width", 70)
                        .style("height", dimensions.height)

     // append the svg object 
     var svg = d3.select("#bubble")
          .style("width", dimensions.width)
          .style("height", dimensions.height)
          
     //league
     var keys = ["Premier League", "Serie A", "Bundesliga", "La Liga", "Ligue 1"]


     // x scale
     var x = d3.scaleOrdinal()
     .domain(keys)
     .range([5, 105, 205, 305, 405])

     // Color palette 
     var color = d3.scaleOrdinal()
          .domain(keys)
          .range(d3.schemeSet2);   
     
     // Add one dot in the legend for each name.
     svg.selectAll("mylabels")
     .data(keys)
     .enter()
     .append("text")
     .attr("x", function(d,i){ return 75 + i*110})
     .attr("y", 12) 
     .style("fill", function(d){ return color(d)})
     .text(function(d){ return d})
     .attr("text-anchor", "middle")
     .style("alignment-baseline", "middle")

     
     // Size scale
     var size = d3.scaleLinear()
          .domain([0, 400])
          .range([1, 110])  // circle px wide
    
    var circle25 = svgLegend.append("circle")
          .attr("cx", 29)
          .attr("cy", 40)
          .attr("r", size(25))
          .attr("fill", "grey")
          .attr("stroke", "black")
          .style("stroke-width", 1)
    
    var text25 = svgLegend.append("text")
            .attr("x", 29)
            .attr("y", 25)
            .attr("text-anchor", "middle") 
            .attr("font-family", "sans-serif")
            .style("font", "17px times")
            .text("25%")
        
    var circle50 = svgLegend.append("circle")
          .attr("cx", 29)
          .attr("cy", 90)
          .attr("r", size(50))
          .attr("fill", "grey")
          .attr("stroke", "black")
          .style("stroke-width", 1)

    var text50 = svgLegend.append("text")
          .attr("x", 29)
          .attr("y", 70)
          .attr("text-anchor", "middle") 
          .attr("font-family", "sans-serif")
          .style("font", "17px times")
          .text("50%")

    var circle75 = svgLegend.append("circle")
          .attr("cx", 29)
          .attr("cy", 155)
          .attr("r", size(75))
          .attr("fill", "grey")
          .attr("stroke", "black")
          .style("stroke-width", 1)

    var text75 = svgLegend.append("text")
          .attr("x", 29)
          .attr("y", 125)
          .attr("text-anchor", "middle") 
          .attr("font-family", "sans-serif")
          .style("font", "17px times")
          .text("75%")
        
    var circle100 = svgLegend.append("circle")
          .attr("cx", 29)
          .attr("cy", 240)
          .attr("r", size(100))
          .attr("fill", "grey")
          .attr("stroke", "black")
          .style("stroke-width", 1)

    var text100 = svgLegend.append("text")
          .attr("x", 29)
          .attr("y", 205)
          .attr("text-anchor", "middle") 
          .attr("font-family", "sans-serif")
          .style("font", "17px times")
          .text("100%")

     // create a tooltip
     var Tooltip = d3.select("#bubble")
     .append("div")
     .style("opacity", 0)
     .attr("class", "tooltip")
     .style("background-color", "white")
     .style("border", "solid")
     .style("border-width", "2px")
     .style("border-radius", "5px")
     .style("padding", "5px")

     var hoverText = svg.append("text")
     .attr("id", 'topbartext')
     .attr("x", 25)
     .attr("y", 290)
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("text-anchor", "start") 
     .attr("font-family", "sans-serif")

     var text2 = d3.select("#network1").append('text')
     .attr("id", 'topbartext')
     .attr("x", 620/2)
     .attr("y", 15)
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("text-anchor", "middle") 
     .attr("font-family", "sans-serif")



     var mouseover = function(event, d) {
         d3.select(this).style("fill-opacity", 1)
          hoverText.text("Hover Team: " + d.team + " " + d.percentwin + "% of games won")
     }
     var mousemove = function(event, d) {
          Tooltip
          .style("left", (event.x/2+20) + "px")
          .style("top", (event.y/2-30) + "px")
     }
     var mouseleave = function(event, d) {
          d3.select(this).style("fill-opacity", .6)
          hoverText.text("")
     }
     var first = true
     var click = function(event, d){
          if(first){
               d3.selectAll("circle").style("stroke-width", 1)
               text2.text("Team 1: " + d.team + " " + d.percentwin + "% of games won")
               d3.select("#network2").remove()
          }
          else{
               d3.select(".bottom-vis2").append("svg").attr("id", "network2")
               var text3 = d3.select("#network2").append('text')
               .attr("id", 'topbartext')
               .attr("x", 620/2)
               .attr("y", 15)
               .attr("dx", "-.8em")
               .attr("dy", ".15em")
               .attr("text-anchor", "middle") 
               .attr("font-family", "sans-serif")
               .text("Team 2: " + d.team + " " + d.percentwin + "% of games won")
          }
          d3.select(this)
            .style("stroke-width", 3)

          var fileName = "./ProjectData/" + d.league + "/" + d.team + "_event_data.csv"
          //console.log(fileName)
          if(first)
               createNetwork(fileName, 1)
          else
               createNetwork(fileName, 2)
          first = !first
     }

     // Initialize the circle
     var node = svg.append("g")
     .selectAll("circle")
     .data(data)
     .join("circle")
       .attr("class", "node")
       .attr("r", d => size(d.percentwin))
       .attr("cx", dimensions.width / 2)
       .attr("cy", dimensions.height / 2)
       .style("fill", d => color(d.league))
       .style("fill-opacity", 0.6)
       .attr("stroke", "black")
       .style("stroke-width", 1)
       .on("mouseover", mouseover)
       .on("mousemove", mousemove)
       .on("mouseleave", mouseleave)
       .on("click", click)
       .call(d3.drag() 
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

     

     // Features of the forces applied to the nodes:
     var simulation = d3.forceSimulation()
          .force("x", d3.forceX().strength(0.5).x( function(d){ return x(d.league) } ))
          .force("y", d3.forceY().strength(0.1).y( dimensions.height/2 ))
          .force("center", d3.forceCenter().x(dimensions.width / 2).y(dimensions.height / 2)) // Attraction to the center of the svg area
          .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of percentwin is > 0
          .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.percentwin)+3) }).iterations(1)) // Force that avoids circle overlapping
      

     // Apply these forces to the nodes and update their positions.
     simulation
          .nodes(data)
          .on("tick", function(d){
          node
               .attr("cx", d => d.x)
               .attr("cy", d => d.y)
     });

     function dragstarted(event, d) {
     if (!event.active) simulation.alphaTarget(.03).restart();
     d.fx = d.x;
     d.fy = d.y;
     }
     function dragged(event, d) {
     d.fx = event.x;
     d.fy = event.y;
     }
     function dragended(event, d) {
     if (!event.active) simulation.alphaTarget(.03);
     d.fx = null;
     d.fy = null;
     }

     //function to create network
     var connections1, connections2, shots1, shots2, events_data1, events_data2, file1
     createNetwork = function(fileName, networkNum){
          //console.log(events_data)
          d3.selectAll("#networkElement" + networkNum).remove()
          d3.selectAll("#selectionElem").remove()
          //d3.select("#network2").remove()
          //d3.select(".bottom-vis2").append("svg").attr("id", "network2")
          d3.csv(fileName).then(
          function(events_data){
               var dimensions = {
              width:650,
              height: 305,
              margin : {
                  top: 30
              }
          }
          var back_x = dimensions.width/4
          var mid_x = dimensions.width/2
          var front_x = dimensions.width *  3/4
          var goalie_x = dimensions.width/16
          var goal_x = dimensions.width *15/16
     
          var svg = d3.select("#network" + networkNum)
                      .style("width", dimensions.width)
                      .style("height", dimensions.height)
     
          var xScale = d3.scaleLinear()
                         .domain([0,100])
                         .range([0, dimensions.width])
     
          var yScale = d3.scaleLinear()
                         .domain([100,0])
                         .range([dimensions.margin.top, dimensions.height])

          var goalie = svg.append("circle")
                          .attr("id", "goalie")
                          .attr('cx', goalie_x)
                          .attr('cy', (dimensions.height + dimensions.margin.top) /2)
                          .attr('r', 5)
                          .style('fill', 'black')

          var back_line = svg.append("g")
                          .append('line')
                          .attr('x1', back_x)
                          .attr('y1', dimensions.height)
                          .attr('x2', back_x)
                          .attr('y2', dimensions.margin.top)
                          .style("stroke", "black")
                          .style("stroke-width", "3")

          var mid_line = svg.append("g")
                            .append('line')
                            .attr('x1', mid_x)
                            .attr('y1', dimensions.height)
                            .attr('x2', mid_x)
                            .attr('y2', dimensions.margin.top)
                            .style("stroke", "black")
                            .style("stroke-width", "3")

          var front_line = svg.append("g")
                              .append('line')
                              .attr('x1', front_x)
                              .attr('y1', dimensions.height)
                              .attr('x2', front_x)
                              .attr('y2', dimensions.margin.top)
                              .style("stroke", "black")
                              .style("stroke-width", "3")

          var goal_line = svg.append("g")
                             .append('line')
                             .attr('x1', goal_x)
                             .attr('y1', 0.6 * (dimensions.height + dimensions.margin.top))
                             .attr('x2', goal_x)
                             .attr('y2', 0.4 * (dimensions.height + dimensions.margin.top))
                             .style("stroke", "black")
                             .style("stroke-width", "3")

         var top_border = svg.append("g")
                                 .append('line')
                                 .attr('x1', goal_x)
                                 .attr('x2', goalie_x)
                                 .attr('y1', dimensions.margin.top)
                                 .attr('y2', dimensions.margin.top)
                                 .style("stroke", "black")
                                 .style("stroke-width", "2")
        var bottom_border = svg.append("g")
                               .append('line')
                               .attr('x1', goal_x)
                               .attr('x2', goalie_x)
                             .attr('y1', dimensions.height)
                             .attr('y2', dimensions.height)
                             .style("stroke", "black")
                             .style("stroke-width", "2")
         var side1_border = svg.append("g")
                              .append('line')
                              .attr('x1', goal_x)
                              .attr('x2', goal_x)
                              .attr('y1', dimensions.margin.top)
                              .attr('y2', dimensions.height)
                              .style("stroke", "black")
                              .style("stroke-width", "2")
         var back_border = svg.append("g")
                              .append('line')
                              .attr('x1', goalie_x)
                              .attr('x2', goalie_x)
                              .attr('y1', dimensions.margin.top)
                              .attr('y2', dimensions.height)
                              .style("stroke", "black")
                              .style("stroke-width", "2")
         var circle_border = svg.append("g")
                                .append('circle')
                                .attr('cx', dimensions.width / 2)
                                .attr('cy', (dimensions.height + dimensions.margin.top) / 2)
                                .attr('r', 40)
                                .style("stroke", "black")
                                .style("stroke-width", "2")
                                .style("fill", "#bbbbbb40")

          if(networkNum == 1){
            events_data1 = events_data
            file1 = fileName                   
             connections1 = svg.append("g")
                                .attr("id", "networkElement"+networkNum)
                                .attr("class", "connections")
                                .selectAll("line")
                                .data(events_data)
                                .enter()
                                .append("line")
                                .attr("class", "connections")
                                .filter((d,i)=> +d.True_Index+1< events_data.length) //was 20000 and line width was .03
                                .filter((d,i) =>{
                                    return d.clean_roles != "IDK"
                                })
                                .filter((d, i) => {
                                    return events_data[(+d.True_Index)+1].clean_roles != "IDK"
                                })
                                .filter((d,i) => {
                                    if(i == 0 && d.eventName != "Pass")
                                        return
                                    if(d.eventName == "Pass" || events_data[(+d.True_Index)-1].eventName == "Pass"){
                                        return d
                                    }
                                })
                                .filter((d, i) => d.clean_roles != events_data[(+d.True_Index)+1].clean_roles) //here
                                .attr("x1", (d, i) => {
                                    if(d.eventName == "Pass"){
        
                                        if(d.clean_roles == "Goalkeeper"){
                                            return goalie_x
                                        }
                                        if(d.clean_roles == "Defender"){
                                            return back_x
                                        }
                                        if(d.clean_roles == "Midfielder"){
                                            return mid_x
                                        }
                                        if(d.clean_roles == "Forward"){
                                            return front_x
                                        }
                                    }
        
                                })
                                .attr("y1", (d,i) =>{
                                    if(d.eventName == "Pass")
                                        return yScale(d.start_y)
                                })
                                .attr("x2", (d,i) => {
                                    if(d.eventName == "Pass"){
                                        if(events_data[(+d.True_Index)+1].clean_roles == "Goalkeeper"){
                                            return goalie_x
                                        }
                                        if(events_data[(+d.True_Index)+1].clean_roles == "Defender"){
                                            return back_x
                                        }
                                        if(events_data[(+d.True_Index)+1].clean_roles == "Midfielder"){
                                            return mid_x
                                        }
                                        if(events_data[(+d.True_Index)+1].clean_roles == "Forward"){
                                            return front_x
                                        }
                                        return dimensions.width + 1
                                    }
                                })
                                .attr("y2", (d,i) => {
                                    if(d.eventName == "Pass"){
                                        //   if(events_data[(+d.True_Index)+1].clean_roles == "Goalkeeper"){
                                        //       return (dimensions.height + dimensions.margin.top) / 2
                                        //   }
                                        return yScale(d.end_y)
                                    }
                                    
                                })
                                .attr("stroke", (d,i) => {
                                    if(d.eventName == "Pass"){
        
                                        if(d.clean_roles == "Goalkeeper"){
                                            return "black"
                                        }
                                        if(d.clean_roles == "Defender"){
                                            return "blue"
                                        }
                                        if(d.clean_roles == "Midfielder"){
                                            return "green"
                                        }
                                        if(d.clean_roles == "Forward"){
                                            return "red"
                                        }
                                    }
                                })
                                .attr("stroke-width", "0.02")
                            
                shots1 = svg.append("g")
                            .attr("id", "networkElement"+networkNum)
                            .selectAll("line")
                            .data(events_data)
                            .enter()
                            .append("line")
                            .filter((d,i)=> i + 1<=20000)
                            .filter((d,i) => {
                             if(d.eventName == "Shot" && d.clean_roles == "Forward"){
                                 return d
                             }})
                            .attr("x1", (d, i) => {
                                 if(d.clean_roles == "Goalkeeper"){
                                     return goalie_x
                                 }
                                 if(d.clean_roles == "Defender"){
                                     return back_x
                                 }
                                 if(d.clean_roles == "Midfielder"){
                                     return mid_x
                                 }
                                 if(d.clean_roles == "Forward"){
                                     return front_x
                                 } 
                              })
                             .attr("y1", (d,i) =>{
                                 if(d.clean_roles == "Goalkeeper"){
                                     return (dimensions.height + dimensions.margin.top) / 2
                                 }
                                 return yScale(d.start_y)
                                 
                              })
                             .attr("x2", (d,i) => {
                                 return goal_x                 
                              })
                             .attr("y2", (d,i) => {
                                 return (0.5 * (dimensions.height + dimensions.margin.top))
                              })
                             .attr("stroke", (d,i) => {
        
                                 if(d.clean_roles == "Goalkeeper"){
                                     return "black"
                                 }
                                 if(d.clean_roles == "Defender"){
                                     return "blue"
                                 }
                                 if(d.clean_roles == "Midfielder"){
                                     return "green"
                                 }
                                 if(d.clean_roles == "Forward"){
                                     return "red"
                                 }
                             
                              })
                             .attr("stroke-width", "0.1")
            }
            else{
                events_data2 = events_data
                var file2 = fileName
                connections2 = svg.append("g")
                .attr("id", "networkElement"+networkNum)
                .attr("class", "connections")
                .selectAll("line")
                .data(events_data)
                .enter()
                .append("line")
                .attr("class", "connections")
                .filter((d,i)=> +d.True_Index+1< events_data.length) 
                .filter((d,i) =>{
                    return d.clean_roles != "IDK"
                })
                .filter((d, i) => {
                    return events_data[(+d.True_Index)+1].clean_roles != "IDK"
                })
                .filter((d,i) => {
                    if(i == 0 && d.eventName != "Pass")
                        return
                    if(d.eventName == "Pass" || events_data[(+d.True_Index)-1].eventName == "Pass"){
                        return d
                    }
                })
                .filter((d, i) => d.clean_roles != events_data[(+d.True_Index)+1].clean_roles) //here
                .attr("x1", (d, i) => {
                    if(d.eventName == "Pass"){

                        if(d.clean_roles == "Goalkeeper"){
                            return goalie_x
                        }
                        if(d.clean_roles == "Defender"){
                            return back_x
                        }
                        if(d.clean_roles == "Midfielder"){
                            return mid_x
                        }
                        if(d.clean_roles == "Forward"){
                            return front_x
                        }
                    }

                })
                .attr("y1", (d,i) =>{
                    if(d.eventName == "Pass"){
                        return yScale(d.start_y)
                    }
                    
                })
                .attr("x2", (d,i) => {
                    if(d.eventName == "Pass"){
                        if(events_data[(+d.True_Index)+1].clean_roles == "Goalkeeper"){
                            return goalie_x
                        }
                        if(events_data[(+d.True_Index)+1].clean_roles == "Defender"){
                            return back_x
                        }
                        if(events_data[(+d.True_Index)+1].clean_roles == "Midfielder"){
                            return mid_x
                        }
                        if(events_data[(+d.True_Index)+1].clean_roles == "Forward"){
                            return front_x
                        }
                        //console.log("inside x2", events_data[(+d.True_Index)+1].clean_roles)
                        return dimensions.width + 1
                    }
                })
                .attr("y2", (d,i) => {
                    if(d.eventName == "Pass"){
                        return yScale(d.end_y)
                    }
                    
                })
                .attr("stroke", (d,i) => {
                    if(d.eventName == "Pass"){

                        if(d.clean_roles == "Goalkeeper"){
                            return "black"
                        }
                        if(d.clean_roles == "Defender"){
                            return "blue"
                        }
                        if(d.clean_roles == "Midfielder"){
                            return "green"
                        }
                        if(d.clean_roles == "Forward"){
                            return "red"
                        }
                    }
                })
                .attr("stroke-width", "0.02")
                
            shots2 = svg.append("g")
                .attr("id", "networkElement"+networkNum)
                .selectAll("line")
                .data(events_data)
                .enter()
                .append("line")
                .filter((d,i)=> i + 1<=20000)
                .filter((d,i) => {
                 if(d.eventName == "Shot" && d.clean_roles == "Forward"){
                     return d
                 }})
                .attr("x1", (d, i) => {
                     if(d.clean_roles == "Goalkeeper"){
                         return goalie_x
                     }
                     if(d.clean_roles == "Defender"){
                         return back_x
                     }
                     if(d.clean_roles == "Midfielder"){
                         return mid_x
                     }
                     if(d.clean_roles == "Forward"){
                         return front_x
                     }
                 

                  })
                 .attr("y1", (d,i) =>{
                     if(d.clean_roles == "Goalkeeper"){
                         return (dimensions.height + dimensions.margin.top) / 2
                     }
                     return yScale(d.start_y)
                     
                  })
                 .attr("x2", (d,i) => {
                     return goal_x
                     
                  })
                 .attr("y2", (d,i) => {

                     return (0.5 * (dimensions.height + dimensions.margin.top))
                     
                  })
                 .attr("stroke", (d,i) => {

                     if(d.clean_roles == "Goalkeeper"){
                         return "black"
                     }
                     if(d.clean_roles == "Defender"){
                         return "blue"
                     }
                     if(d.clean_roles == "Midfielder"){
                         return "green"
                     }
                     if(d.clean_roles == "Forward"){
                         return "red"
                     }
                 
                  })
                 .attr("stroke-width", "0.1")

            }
                var height = 50
                var selectionSVG = d3.select("#selections")
                                    .style("width", dimensions.width)
                                    .style("height", height)
    
                var goalieCircle = selectionSVG.append("circle")
                                    .attr("id", "selectionElem")
                                    .attr("cx", goalie_x)
                                    .attr("cy", height/2)
                                    .attr("r", height/4)
                                    .style("fill", "grey")
                                    .style("stroke", "black")
                                    .style("stroke-width", 0)
                                    .attr("fill-opacity", .6)
                                    .on("mouseover", function(){
                                        d3.select(this).attr("fill-opacity", 1)
                                        goalieText.style("fill-opacity", 1)
                                    })
                                    .on("mouseout", function(){
                                        d3.select(this).attr("fill-opacity", .6)
                                        goalieText.style("fill-opacity", .6)
                                    })
                                    .on("click", function(event){
                                        defenderCircle.style("stroke-width", 0)
                                        midCircle.style("stroke-width", 0)
                                        frontCircle.style("stroke-width", 0)
    
                                        d3.select(this).style("stroke-width", 2)
    
                                        if(event.ctrlKey || event.metaKey){
                                            defenderCircle.on("click", function(){
                                                defenderCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Defender")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Defender")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                            midCircle.on("click", function(){
                                                midCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Midfielder")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Midfielder")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                            frontCircle.on("click", function(){
                                                frontCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Forward")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Forward")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                        }
    
                                        connections1.attr("stroke-width", ".02")
                                            .filter(d => d.clean_roles != "Goalkeeper") 
                                            .transition()
                                            .attr("stroke-width", "0")
                                        shots1.transition()
                                            .attr("stroke-width", "0")
                                        if(networkNum == 2){
                                            connections2.attr("stroke-width", ".02")
                                            .filter(d => d.clean_roles != "Goalkeeper") 
                                            .transition()
                                            .attr("stroke-width", "0")
                                            shots2.transition().attr("stroke-width", 0)
                                        }
                                    })
    
                var goalieText = selectionSVG.append("text")
                                    .attr("id", "selectionElem")
                                    .attr("x", goalie_x + height/4 + 10)
                                    .attr("y", height/1.6)
                                    .attr("text-anchor", "start")
                                    .attr("font-family", "sans-serif")
                                    .style("fill-opacity", .6)
                                    .style("fill", "grey")
                                    .text("Goalie")
    
                var defenderCircle = selectionSVG.append("circle")
                                    .attr("id", "selectionElem")
                                    .attr("cx", back_x)
                                    .attr("cy", height/2)
                                    .attr("r", height/4)
                                    .style("fill", "blue")
                                    .style("stroke", "black")
                                    .style("stroke-width", 0)
                                    .attr("fill-opacity", .6)
                                    .on("mouseover", function(){
                                        d3.select(this).attr("fill-opacity", 1)
                                        defenderText.style("fill-opacity", 1)
                                    })
                                    .on("mouseout", function(){
                                        d3.select(this).attr("fill-opacity", .6)
                                        defenderText.style("fill-opacity", .6)
                                    })
                                    .on("click", function(event){
                                        goalieCircle.style("stroke-width", 0)
                                        midCircle.style("stroke-width", 0)
                                        frontCircle.style("stroke-width", 0)
    
                                        d3.select(this).style("stroke-width", 2)
                                        
                                        if(event.ctrlKey || event.metaKey){
                                            goalieCircle.on("click", function(){
                                                goalieCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Goalkeeper")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Goalkeeper")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                            midCircle.on("click", function(){
                                                midCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Midfielder")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Midfielder")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                            frontCircle.on("click", function(){
                                                frontCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Forward")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Forward")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                        }
                                        connections1.attr("stroke-width", ".02")
                                            .filter(d => d.clean_roles != "Defender") 
                                            .transition()
                                            .attr("stroke-width", "0")
                                        if(networkNum == 2){
                                        connections2.attr("stroke-width", ".02")
                                            .filter(d => d.clean_roles != "Defender") 
                                            .transition()
                                            .attr("stroke-width", "0")
                                        shots2.transition().attr("stroke-width", 0)
                                        }
                                          shots1.transition()
                                               .attr("stroke-width", "0")
                                    })
    
                var defenderText = selectionSVG.append("text")
                                    .attr("id", "selectionElem")
                                    .attr("x", back_x + height/4 + 10)
                                    .attr("y", height/1.6)
                                    .attr("text-anchor", "start")
                                    .attr("font-family", "sans-serif")
                                    .style("fill", "blue")
                                    .style("fill-opacity", .6)
                                    .text("Defender")
    
                var midCircle = selectionSVG.append("circle")
                                    .attr("id", "selectionElem")
                                    .attr("cx", mid_x)
                                    .attr("cy", height/2)
                                    .attr("r", height/4)
                                    .style("fill", "green")
                                    .style("stroke", "black")
                                    .style("stroke-width", 0)
                                    .attr("fill-opacity", .6)
                                    .on("mouseover", function(){
                                        d3.select(this).attr("fill-opacity", 1)
                                        midfielderText.style("fill-opacity", 1)
                                    })
                                    .on("mouseout", function(){
                                        d3.select(this).attr("fill-opacity", .6)
                                        midfielderText.style("fill-opacity", .6)
                                    })
                                    .on("click", function(event){
                                        goalieCircle.style("stroke-width", 0)
                                        defenderCircle.style("stroke-width", 0)
                                        frontCircle.style("stroke-width", 0)
                                        d3.select(this).style("stroke-width", 2)
    
                                        if(event.ctrlKey || event.metaKey){
                                            goalieCircle.on("click", function(){
                                                goalieCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Goalkeeper")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Goalkeeper")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                            defenderCircle.on("click", function(){
                                                defenderCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Defender")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Defender")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                            frontCircle.on("click", function(){
                                                frontCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Forward")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Forward")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                        }
                                        connections1.attr("stroke-width", ".02")
                                            .filter(d => d.clean_roles != "Midfielder") 
                                            .transition()
                                            .attr("stroke-width", "0")
                                        if(networkNum == 2){
                                        connections2.attr("stroke-width", ".02")
                                            .filter(d => d.clean_roles != "Midfielder") 
                                            .transition()
                                            .attr("stroke-width", "0")
                                            shots2.transition()
                                            .attr("stroke-width", "0")
                                        }
                                        shots1.transition()
                                             .attr("stroke-width", "0")
                                    })
    
    
                var midfielderText = selectionSVG.append("text")
                                    .attr("id", "selectionElem")
                                    .attr("x", mid_x + height/4 + 10)
                                    .attr("y", height/1.6)
                                    .attr("text-anchor", "start")
                                    .attr("font-family", "sans-serif")
                                    .style("fill", "green")
                                    .style("fill-opacity", .6)
                                    .text("Midfielder")
    
                var frontCircle = selectionSVG.append("circle")
                                    .attr("id", "selectionElem")
                                    .attr("cx", front_x)
                                    .attr("cy", height/2)
                                    .attr("r", height/4)
                                    .style("fill", "red")
                                    .style("stroke", "black")
                                    .style("stroke-width", 0)
                                    .attr("fill-opacity", .6)
                                    .on("mouseover", function(){
                                        d3.select(this).attr("fill-opacity", 1)
                                        forwardText.style("fill-opacity", 1)
                                    })
                                    .on("mouseout", function(){
                                        d3.select(this).attr("fill-opacity", .6)
                                        forwardText.style("fill-opacity", .6)
                                    })
                                    .on("click", function(event){
                                        goalieCircle.style("stroke-width", 0)
                                        defenderCircle.style("stroke-width", 0)
                                        midCircle.style("stroke-width", 0)
                                        d3.select(this).style("stroke-width", 2)
    
                                        shots1.attr("stroke-width", "0.02")
                                        
                                          if(event.ctrlKey || event.metaKey){
                                            goalieCircle.on("click", function(){
                                                goalieCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Goalkeeper")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Goalkeeper")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                            defenderCircle.on("click", function(){
                                                defenderCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Defender")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Defender")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                            midCircle.on("click", function(){
                                                midCircle.style("stroke-width", 1)
                                                connections1.filter((d, i) => events_data1[(+d.True_Index)+1].clean_roles != "Midfielder")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                if(networkNum == 2){
                                                connections2.filter((d, i) => events_data2[(+d.True_Index)+1].clean_roles != "Midfielder")
                                                .transition()
                                                .attr("stroke-width", "0")
                                                }
                                            })
                                          }
                                          connections1.attr("stroke-width", "0.02")
                                              .filter(d => d.clean_roles != "Forward") 
                                              .transition()
                                              .attr("stroke-width", "0")
                                        if(networkNum == 2){
                                          connections2.attr("stroke-width", "0.02")
                                              .filter(d => d.clean_roles != "Forward") 
                                              .transition()
                                              .attr("stroke-width", "0")
                                              }
                                            shots2.attr("stroke-width", "0.02")
                                      })
                                    
                var forwardText = selectionSVG.append("text")
                                    .attr("id", "selectionElem")
                                    .attr("x", front_x + height/4 + 10)
                                    .attr("y", height/1.6)
                                    .attr("text-anchor", "start")
                                    .attr("font-family", "sans-serif")
                                    .style("fill-opacity", .6)
                                    .style("fill", "red")
                                    .text("Forward")
                    
                    var brushSVG = d3.select("#brush")
                        .style("width", 20)
                        .style("height", dimensions.height)
                
                    var brushLine = brushSVG.append("line")
                        .attr("x1",10)
                        .attr("y1", dimensions.margin.top)
                        .attr("x2", 10)
                        .attr("y2", dimensions.height)
                        .style("stroke", "black")
                        .style("stroke-width", "3")

                    var brush = d3.brushY()
                    .extent([[4,dimensions.margin.top], [16, dimensions.height]])
                    .on("brush", (event, d) => {
                      connections1.transition()
                      .attr("stroke-width", d => {
                          if(yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1]))
                              return 0
                          return ".02"
                      })
                      shots1.transition()
                      .attr("stroke-width", d=> {
                          if(yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1]))
                              return 0
                          return ".02"
                      })
                      if(networkNum == 2){
                            connections2.transition()
                            .attr("stroke-width", d => {
                                if(yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1]))
                                    return 0
                                return ".02"
                            })
                            shots2.transition()
                            .attr("stroke-width", d=> {
                                //console.log("d.start_y", d.start_y)
                                if(yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1]))
                                    return 0
                                return ".02"
                            })
                        }
                    })
                    brushSVG.append("g")
                    .attr("class", "brush")
                    .attr("id", "selectionElem")
                    .call(brush)

                var goalieBrush = d3.brushY()
                    .extent([[goalie_x-6,dimensions.margin.top], [goalie_x+6, dimensions.height]])
                    .on("brush", (event, d) => {
                        connections1.transition()
                        .attr("stroke-width", d => {
                            if((yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1])) || d.clean_roles != "Goalkeeper")
                                return 0
                            return ".02"
                        })
                        shots1.transition().attr("stroke-width", 0)
                        if(networkNum == 2){
                            connections2.transition()
                            .attr("stroke-width", d => {
                                if((yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1])) || d.clean_roles != "Goalkeeper")
                                    return 0
                                return ".02"
                            })
                            shots2.transition().attr("stroke-width", 0)
                        }
                    })
                
                var defenseBrush = d3.brushY()
                    .extent([[back_x-6,dimensions.margin.top], [back_x+6, dimensions.height]])
                    .on("brush", (event, d) => {
                        connections1.transition()
                        .attr("stroke-width", d => {
                            if((yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1])) || d.clean_roles != "Defender")
                                return 0
                            return ".02"
                        })
                        shots1.transition().attr("stroke-width", 0)
                        if(networkNum == 2){
                            connections2.transition()
                            .attr("stroke-width", d => {
                                if((yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1])) || d.clean_roles != "Defender")
                                    return 0
                                return ".02"
                            })
                            shots2.transition().attr("stroke-width", 0)
                        }
                    })

                var midBrush = d3.brushY()
                    .extent([[mid_x-6,dimensions.margin.top], [mid_x+6, dimensions.height]])
                    .on("brush", (event, d) => {
                        connections1.transition()
                        .attr("stroke-width", d => {
                            if((yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1])) || d.clean_roles != "Midfielder")
                                return 0
                            return ".02"
                        })
                        shots1.transition().attr("stroke-width", 0)
                        if(networkNum == 2){
                            connections2.transition()
                            .attr("stroke-width", d => {
                                if((yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1])) || d.clean_roles != "Midfielder")
                                    return 0
                                return ".02"
                            })
                            shots2.transition().attr("stroke-width", 0)
                        }
                    })

                var forwardBrush = d3.brushY()
                    .extent([[front_x-6,dimensions.margin.top], [front_x+6, dimensions.height]])
                    .on("brush", (event, d) => {
                        connections1.transition()
                        .attr("stroke-width", d => {
                            if((yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1])) || d.clean_roles != "Forward")
                                return 0
                            return ".02"
                        })

                        shots1.transition()
                        .attr("stroke-width", d=> {
                            if(yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1]))
                                return 0
                            return ".02"
                        })
                        if(networkNum == 2){
                            shots2.transition()
                            .attr("stroke-width", d=> {
                                //console.log("d.start_y", d.start_y)
                                if(yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1]))
                                    return 0
                                return ".02"
                            })
                            connections2.transition()
                            .attr("stroke-width", d => {
                                if((yScale(d.start_y) < event.selection[0] || (yScale(d.start_y) > event.selection[1])) || d.clean_roles != "Forward")
                                    return 0
                                return ".02"
                            })
                        }
                    })
                
                d3.select("#network1").append("g")
                    .attr("class", "brush")
                    .attr("id", "selectionElem")
                    .call(goalieBrush)
                d3.select("#network1").append("g")
                    .attr("class", "brush")
                    .attr("id", "selectionElem")
                    .call(defenseBrush)
                d3.select("#network1").append("g")
                    .attr("class", "brush")
                    .attr("id", "selectionElem")
                    .call(midBrush)
                d3.select("#network1").append("g")
                    .attr("class", "brush")
                    .attr("id", "selectionElem")
                    .call(forwardBrush)

                var resetClick = function(event, d){
                    createNetwork(file1, 1)
                    if(networkNum == 2){
                        setTimeout(() => {
                            createNetwork(file2, 2);
                    }, 4000); //ensures the second network is created after the first one to ensure the selection elements from the first network get deleted     
                    }
                }
                var reset = selectionSVG.append("rect")
                                    .attr("x", goal_x)
                                    .attr("y", 17)
                                    .attr("width", 55)
                                    .attr("height", 20)
                                    .attr("fill", "grey")
                                    .attr("stroke", "black")
                                    .attr("stroke-width", 0)
                                    .on("mouseover", function(){
                                        d3.select(this).attr("stroke-width", 1) 
                                    })
                                    .on("mouseout", function(){
                                        d3.select(this).attr("stroke-width", 0)
                                    })
                                    .on("click", resetClick)

                var resetText = selectionSVG.append("text")
                                    .attr("x", goal_x + 3)
                                    .attr("y", height/1.6)
                                    .attr("text-anchor", "start")
                                    .on("mouseover", function(){
                                        reset.attr("stroke-width", 1) 
                                    })
                                    .on("mouseout", function(){
                                        reset.attr("stroke-width", 0)
                                    })
                                    .on("click", resetClick)
                                    .text("Reset")          
     })}
})
