d3.csv("./ProjectData/finalbubbleset.csv").then(
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


     var text = svg.append('text')
     .attr("id", 'topbartext')
     .attr("x", dimensions.width)
     .attr("y", 30)
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("text-anchor", "end") 
     .attr("font-family", "sans-serif")


     var mouseover = function(event, d) {
         Tooltip
          text.text("Team: " + d.team + " " + d.percentwin + "% win")
          .style("opacity", 1)
     }
     var mousemove = function(event, d) {
          Tooltip
          .style("left", (event.x/2+20) + "px")
          .style("top", (event.y/2-30) + "px")
     }
     var mouseleave = function(event, d) {
          Tooltip
          .style("opacity", 0)
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
       .style("fill-opacity", 0.8)
       .attr("stroke", "black")
       .style("stroke-width", 1)
       .on("mouseover", mouseover)
       .on("mousemove", mousemove)
       .on("mouseleave", mouseleave)
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

})
