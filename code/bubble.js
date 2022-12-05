//import {createNetwork} from './code/network.js'
d3.csv("./ProjectData/bubble1718.csv").then(
     function(data) {
     // set the dimensions
     var dimensions = {
          width: 1000,
          height: 300
      }

     // append the svg object 
     var svg = d3.select("#bubble")
          .style("width", dimensions.width)
          .style("height", dimensions.height)
          
     //league
     var keys = ["Premier League", "Serie A", "Bundesliga", "La Liga", "Ligue 1"]


     // x scale
     var x = d3.scaleOrdinal()
     .domain(keys)
     .range([100, 200, 300, 400, 500])

     // Color palette 
     var color = d3.scaleOrdinal()
          .domain(keys)
          .range(d3.schemeSet2);

     //get the dots for legend     
     svg.selectAll("mydots")
     .data(keys)
     .enter()
     .append("circle")
     .attr("cx", 850)
     .attr("cy", function(d,i){ return 100 + i*25}) 
     .attr("r", 7)
     .style("fill", function(d){ return color(d)})     
     
     // Add one dot in the legend for each name.
     svg.selectAll("mylabels")
     .data(keys)
     .enter()
     .append("text")
     .attr("x", 900)
     .attr("y", function(d,i){ return 100 + i*25}) 
     .style("fill", function(d){ return color(d)})
     .text(function(d){ return d})
     .attr("text-anchor", "left")
     .style("alignment-baseline", "middle")

     
     // Size scale
     var size = d3.scaleLinear()
          .domain([0, 400])
          .range([1, 110])  // circle px wide

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
     .attr("x", dimensions.width)
     .attr("y", 70)
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("text-anchor", "end") 
     .attr("font-family", "sans-serif")

     var text2 = svg.append('text')
     .attr("id", 'topbartext')
     .attr("x", dimensions.width)
     .attr("y", 30)
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("text-anchor", "end") 
     .attr("font-family", "sans-serif")

     var text3 = svg.append("text")
     .attr("id", 'topbartext')
     .attr("x", dimensions.width)
     .attr("y", 50)
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("text-anchor", "end") 
     .attr("font-family", "sans-serif")

     var mouseover = function(event, d) {
         d3.select(this).style("fill-opacity", 1)
          hoverText.text("Hover Team: " + d.team + " " + d.percentwin + "% win")
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
               console.log("first", first)
               d3.selectAll("circle").style("stroke-width", 1)
               text2.text("Team 1: " + d.team + " " + d.percentwin + "% win")
               text3.text("")
          }
          else{
               text3.text("Team 2: " + d.team + " " + d.percentwin + "% win")
          }
          d3.select(this)
            .style("stroke-width", 3)

          var fileName = "./ProjectData/" + d.league + "/" + d.team + "_event_data.csv"
          console.log(fileName)
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
     createNetwork = function(fileName, networkNum){
          //console.log(events_data)
          d3.selectAll("#networkElement" + networkNum).remove()
          d3.csv(fileName).then(
          function(events_data){
               var dimensions = {
              width:500,
              height: 250,
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
                          .attr('cx', goalie_x)
                          .attr('cy', (dimensions.height + dimensions.margin.top) /2)
                          .attr('r', 5)
                          .style('fill', 'black')
                          .on("mouseover", function(){
                              d3.select(this).attr("r", 7)
                          })
                          .on("mouseout", function(){
                              d3.select(this).attr("r", 5)
                          })
                          .on("click", function(event){
                              if(event.ctrlKey || event.metaKey){
                                  back_line.on("click", function(){
                                      connections.filter((d, i) => events_data[i+1].clean_roles != "Defender")
                                      .transition()
                                      .attr("stroke-width", "0")
                                  })
                                  mid_line.on("click", function(){
                                      connections.filter((d, i) => events_data[i+1].clean_roles != "Midfielder")
                                      .transition()
                                      .attr("stroke-width", "0")
                                  })
                                  front_line.on("click", function(){
                                      connections.filter((d, i) => events_data[i+1].clean_roles != "Forward")
                                      .transition()
                                      .attr("stroke-width", "0")
                                  })
                              }
                              connections.attr("stroke-width", ".01")
                                  .filter(d => d.clean_roles != "Goalkeeper") 
                                  .transition()
                                  .attr("stroke-width", "0")
                          })
          var back_line = svg.append("g")
                          .append('line')
                          .attr('x1', back_x)
                          .attr('y1', dimensions.height)
                          .attr('x2', back_x)
                          .attr('y2', dimensions.margin.top)
                          .style("stroke", "black")
                          .style("stroke-width", "3")
                          .on("mouseover", function(){
                              d3.select(this).style("stroke-width", "4")
                          })
                          .on("mouseout", function(){
                              d3.select(this).style("stroke-width", "3")
                          })
                          .on("click", function(event){
                              if(event.ctrlKey || event.metaKey){
                                  goalie.on("click", function(){
                                      connections.filter((d, i) => events_data[i+1].clean_roles != "Goalkeeper")
                                      .transition()
                                      .attr("stroke-width", "0")
                                  })
                                  mid_line.on("click", function(){
                                      connections.filter((d, i) => events_data[i+1].clean_roles != "Midfielder")
                                      .transition()
                                      .attr("stroke-width", "0")
                                  })
                                  front_line.on("click", function(){
                                      connections.filter((d, i) => events_data[i+1].clean_roles != "Forward")
                                      .transition()
                                      .attr("stroke-width", "0")
                                  })
                              }
                              connections.attr("stroke-width", ".01")
                                  .filter(d => d.clean_roles != "Defender") 
                                  .transition()
                                  .attr("stroke-width", "0")
                          })
          var mid_line = svg.append("g")
                            .append('line')
                            .attr('x1', mid_x)
                            .attr('y1', dimensions.height)
                            .attr('x2', mid_x)
                            .attr('y2', dimensions.margin.top)
                            .style("stroke", "black")
                            .style("stroke-width", "3")
                            .on("mouseover", function(){
                              d3.select(this).style("stroke-width", "4")
                            })
                            .on("mouseout", function(){
                              d3.select(this).style("stroke-width", "3")
                            })
                            .on("click", function(event){
                              if(event.ctrlKey || event.metaKey){
                                  goalie.on("click", function(){
                                      connections.filter((d, i) => events_data[i+1].clean_roles != "Goalkeeper")
                                      .transition()
                                      .attr("stroke-width", "0")
                                  })
                                  back_line.on("click", function(){
                                      connections.filter((d, i) => events_data[i+1].clean_roles != "Defender")
                                      .transition()
                                      .attr("stroke-width", "0")
                                  })
                                  front_line.on("click", function(){
                                      connections.filter((d, i) => events_data[i+1].clean_roles != "Forward")
                                      .transition()
                                      .attr("stroke-width", "0")
                                  })
                              }
                              connections.attr("stroke-width", ".01")
                                  .filter(d => d.clean_roles != "Midfielder") 
                                  .transition()
                                  .attr("stroke-width", "0")
                          })
          var front_line = svg.append("g")
                              .append('line')
                              .attr('x1', front_x)
                              .attr('y1', dimensions.height)
                              .attr('x2', front_x)
                              .attr('y2', dimensions.margin.top)
                              .style("stroke", "black")
                              .style("stroke-width", "3")
                              .on("mouseover", function(){
                                  d3.select(this).style("stroke-width", "4")
                              })
                              .on("mouseout", function(){
                                  d3.select(this).style("stroke-width", "3")
                              })
                              .on("click", function(event){
                                  if(event.ctrlKey || event.metaKey){
                                      goalie.on("click", function(){
                                          connections.filter((d, i) => events_data[i+1].clean_roles != "Goalkeeper")
                                          .transition()
                                          .attr("stroke-width", "0")
                                      })
                                      back_line.on("click", function(){
                                          connections.filter((d, i) => events_data[i+1].clean_roles != "Defender")
                                          .transition()
                                          .attr("stroke-width", "0")
                                      })
                                      mid_line.on("click", function(){
                                          connections.filter((d, i) => events_data[i+1].clean_roles != "Midfielder")
                                          .transition()
                                          .attr("stroke-width", "0")
                                      })
                                  }
                                  connections.attr("stroke-width", ".01")
                                      .filter(d => d.clean_roles != "Forward") 
                                      .transition()
                                      .attr("stroke-width", "0")
                                  // if (d3.event.ctrlKey) {
                                  //     console.log("hello control was pressed")
                                      // mid_line.on("click", function(){
                                      //     connections.filter((d, i) => events_data[i+1].clean_roles != "Midfielder")
                                      //     .transition()
                                      //     .attr("stroke-width", "0")
                                  //     })
                                  // }
                              })
          var goal_line = svg.append("g")
                             .append('line')
                             .attr('x1', goal_x)
                             .attr('y1', 0.6 * (dimensions.height + dimensions.margin.top))
                             .attr('x2', goal_x)
                             .attr('y2', 0.4 * (dimensions.height + dimensions.margin.top))
                             .style("stroke", "black")
                             .style("stroke-width", "3")
                             .on("mouseover", function(){
                                d3.select(this).style("stroke-width", "4")
                             })
                             .on("mouseout", function(){
                                d3.select(this).style("stroke-width", "3")
                             })
                             .on("click", function(){
                              connections.attr("stroke-width", ".01")
                             })
                             
          var connections = svg.append("g")
                               .attr("id", "networkElement"+networkNum)
                               .selectAll("line")
                               .data(events_data)
                               .enter()
                               .append("line")
                               .filter((d,i)=> i + 1< events_data.length) //was 20000 and line width was .03
                               .filter((d,i) =>{
                                   return d.clean_roles != "IDK"
                               })
                               .filter((d, i) => {
                                   return events_data[i+1].clean_roles != "IDK"
                               })
                               .filter((d,i) => {
                                   console.log("d", d)
                                   console.log("i", i)
                                  if(i == 0 && d.eventName != "Pass")
                                      return
                                  if(d.eventName == "Pass" || events_data[i - 1].eventName == "Pass"){
                                      return d
                                  }
                               })
                               .attr("x1", (d, i) => {
                                  //console.log(d)
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
                                      if(d.clean_roles == "Goalkeeper"){
                                          return (dimensions.height + dimensions.margin.top) / 2
                                      }
                                      return yScale(d.start_y)
                                  }
                                  
                               })
                               .attr("x2", (d,i) => {
                                  //console.log(events_data[i + 1].clean_roles)
                                  if(d.eventName == "Pass"){
                                      //console.log(events_data[i + 1].clean_roles)
                                      if(events_data[i + 1].clean_roles == "Goalkeeper"){
                                          return goalie_x
                                      }
                                      if(events_data[i + 1].clean_roles == "Defender"){
                                          return back_x
                                      }
                                      if(events_data[i + 1].clean_roles == "Midfielder"){
                                          return mid_x
                                      }
                                      if(events_data[i + 1].clean_roles == "Forward"){
                                          return front_x
                                      }
                                      console.log("inside x2", events_data[i+1].clean_roles)
                                      return dimensions.width + 1
                                      // d3.select(this).setAttribute("x1", 0)
                                  }
                               })
                               .attr("y2", (d,i) => {
                                  if(d.eventName == "Pass"){
                                      if(events_data[i + 1].clean_roles == "Goalkeeper"){
                                          return (dimensions.height + dimensions.margin.top) / 2
                                      }
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
                               .attr("stroke-width", "0.01")
     
          var shots = svg.append("g")
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
                              //console.log(d
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
                              //console.log(events_data[i + 1].clean_roles)
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
     
                              
     })}
     createNetwork("./ProjectData/Premier League/Arsenal_event_data.csv", 1)
     createNetwork("./ProjectData/Premier League/Chelsea_event_data.csv", 2)
})
