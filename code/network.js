d3.csv("./ProjectData/champions_league_events_with_names2.csv").then(
    
    function(events_data){
        //console.log(events_data)

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

        var svg = d3.select("#network")
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
                            if(event.ctrlKey){
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
                        .style("stroke-width", "2")
                        .on("mouseover", function(){
                            d3.select(this).style("stroke-width", "3.5")
                        })
                        .on("mouseout", function(){
                            d3.select(this).style("stroke-width", "2")
                        })
                        .on("click", function(event){
                            if(event.ctrlKey){
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
                          .style("stroke-width", "2")
                          .on("mouseover", function(){
                            d3.select(this).style("stroke-width", "3.5")
                          })
                          .on("mouseout", function(){
                            d3.select(this).style("stroke-width", "2")
                          })
                          .on("click", function(event){
                            if(event.ctrlKey){
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
                            .style("stroke-width", "2")
                            .on("mouseover", function(){
                                d3.select(this).style("stroke-width", "3.5")
                            })
                            .on("mouseout", function(){
                                d3.select(this).style("stroke-width", "2")
                            })
                            .on("click", function(event){
                                if(event.ctrlKey){
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
                           .style("stroke-width", "2")
                           .on("mouseover", function(){
                              d3.select(this).style("stroke-width", "3.5")
                           })
                           .on("mouseout", function(){
                              d3.select(this).style("stroke-width", "2")
                           })
                           .on("click", function(){
                            connections.attr("stroke-width", ".01")
                           })
                           
        var connections = svg.append("g")
                             .selectAll("line")
                             .data(events_data)
                             .enter()
                             .append("line")
                             .filter((d,i)=> i + 1<=events_data.length) //was 20000 and line width was .03
                             .filter((d,i) => {
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
                                        return "red"
                                    }
                                    if(d.clean_roles == "Defender"){
                                        return "blue"
                                    }
                                    if(d.clean_roles == "Midfielder"){
                                        return "green"
                                    }
                                    if(d.clean_roles == "Forward"){
                                        return "orange"
                                    }
                                }
                             })
                             .attr("stroke-width", "0.01")

        var shots = svg.append("g")
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
                                return "red"
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
)