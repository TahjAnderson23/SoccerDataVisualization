d3.json("/ProjectData/events_European_Championship.json").then(
    
    function(events_data){
        console.log(events_data)

        var dimensions = {
            width:300,
            height: 150,
            margin : {
                top: 30
            }
        }
        var back_x = dimensions.width/16
        var mid_x = dimensions.width/2
        var front_x = dimensions.width *  15/16
        var svg = d3.select("#network")
                    .style("width", dimensions.width)
                    .style("height", dimensions.height)

        var xScale = d3.scaleLinear()
                       .domain([0,100])
                       .range([0, dimensions.width])

        var yScale = d3.scaleLinear()
                       .domain([100,0])
                       .range([dimensions.margin.top, dimensions.height])

        var back_line = svg.append("g")
                        .append('line')
                        .attr('x1', back_x)
                        .attr('y1', dimensions.height)
                        .attr('x2', back_x)
                        .attr('y2', 0)
                        .style("stroke", "black")
                        .style("stroke-width", "2")
        var mid_line = svg.append("g")
                          .append('line')
                          .attr('x1', mid_x)
                          .attr('y1', dimensions.height)
                          .attr('x2', mid_x)
                          .attr('y2', 0)
                          .style("stroke", "black")
                          .style("stroke-width", "2")
        var front_line = svg.append("g")
                            .append('line')
                            .attr('x1', front_x)
                            .attr('y1', dimensions.height)
                            .attr('x2', front_x)
                            .attr('y2', 0)
                            .style("stroke", "black")
                            .style("stroke-width", "2")
        
        var connections = svg.append("g")

    }
)