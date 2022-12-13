//fisheye d3 plug-in that was a design idea (didn't end up working out but left in code that is commented out later)
(function() {
    d3.fisheye = {
      scale: function(scaleType) {
        return d3_fisheye_scale(scaleType(), 3, 0);
      },
      circular: function() {
        var radius = 200,
            distortion = 2,
            k0,
            k1,
            focus = [0, 0];
  
        function fisheye(d) {
          var dx = d.x - focus[0],
              dy = d.y - focus[1],
              dd = Math.sqrt(dx * dx + dy * dy);
          if (!dd || dd >= radius) return {x: d.x, y: d.y, z: dd >= radius ? 1 : 10};
          var k = k0 * (1 - Math.exp(-dd * k1)) / dd * .75 + .25;
          return {x: focus[0] + dx * k, y: focus[1] + dy * k, z: Math.min(k, 10)};
        }
  
        function rescale() {
          k0 = Math.exp(distortion);
          k0 = k0 / (k0 - 1) * radius;
          k1 = distortion / radius;
          return fisheye;
        }
  
        fisheye.radius = function(_) {
          if (!arguments.length) return radius;
          radius = +_;
          return rescale();
        };
  
        fisheye.distortion = function(_) {
          if (!arguments.length) return distortion;
          distortion = +_;
          return rescale();
        };
  
        fisheye.focus = function(_) {
          if (!arguments.length) return focus;
          focus = _;
          return fisheye;
        };
  
        return rescale();
      }
    };
  
    function d3_fisheye_scale(scale, d, a) {
  
      function fisheye(_) {
        var x = scale(_),
            left = x < a,
            range = d3.extent(scale.range()),
            min = range[0],
            max = range[1],
            m = left ? a - min : max - a;
        if (m == 0) m = max - min;
        return (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a))) + a;
      }
  
      fisheye.distortion = function(_) {
        if (!arguments.length) return d;
        d = +_;
        return fisheye;
      };
  
      fisheye.focus = function(_) {
        if (!arguments.length) return a;
        a = +_;
        return fisheye;
      };
  
      fisheye.copy = function() {
        return d3_fisheye_scale(scale.copy(), d, a);
      };
  
      fisheye.nice = scale.nice;
      fisheye.ticks = scale.ticks;
      fisheye.tickFormat = scale.tickFormat;
      return d3.rebind(fisheye, scale, "domain", "range");
    }
  })();
d3.csv("./ProjectData/shots.csv").then(

    function(shotsData){
        //pitch is preferred to be 105 by 68 metres... but varies
        
        var dimensions = {
            width: 1.7*200, 
            height: 1.7*(68/105 * 200) + 30,
            margin: {
                top: 30
            }
        }

        var svg = d3.select("#choropleth")
                    .style("width", dimensions.width)
                    .style("height", dimensions.height)


        var xScale = d3.scaleLinear()
                    .domain([0, 1])
                    .range([0, dimensions.width])

        var yScale = d3.scaleLinear()
                     .domain([1, 0])
                     .range([dimensions.margin.top, dimensions.height])

        var numVertical = 60, 
            numHorizontal = 25

        var rectangles = new Array(numVertical*numHorizontal)
        
        var numPenalty = 0;

        function calcRectangles(){
            rectangles = new Array(numVertical*numHorizontal)
            shotsData.forEach(d => {

            var penaltyBox = false
            if(d.positionX > 1-16.5/105 && d.positionY < 1-16.5/68 && d.positionY > 16.5/68){
                penaltyBox = true
            }
            var row = Math.floor(numHorizontal*(d.positionY))
            var col = Math.floor(numVertical*(d.positionX))
            var whichOne = numVertical*row + col

            if(rectangles[whichOne] == undefined){
                if(penaltyBox){
                    numPenalty++;
                }
                if(d.shotResult == "Goal"){
                    rectangles[whichOne] = [whichOne, 1, 1, penaltyBox] //which one, one goal made, one shot, whether or not in penalty box
                }
                else if(d.shotResult != "OwnGoal"){ //filters out own goals
                    rectangles[whichOne] = [whichOne, 0, 1, penaltyBox] //which one, zero goals made, one shot, whether or not in penalty box
                }
            }
            else{
                if(penaltyBox)
                    rectangles[whichOne][3] = true
                if(d.shotResult == "Goal"){
                    rectangles[whichOne][1]++;
                }
                if(d.shotResult != "OwnGoal"){ //doesn't mistakenly count own goal
                    rectangles[whichOne][2]++;
                }
            }
        }) }
        calcRectangles()
        
        var colorScaleSmall = d3.scaleLinear()
                                .domain([0, .1])
                                .range(["#d92723", "#fdc9b4"])

        var colorScaleBig = d3.scaleLinear()
                                .domain([.1, 1])
                                .range(["#73c378", "#157f3b"])
        
        var totalColorScale = d3.scaleLog() //was scaleLinear...
                           .domain(d3.extent(rectangles, d => {
                            if(d != undefined)
                                return d[2]
                           }))
                           .range(["white", "#157f3b"])

        createDisplay = function (rectangles, num){
            svg.select("#display").remove();
            var display = svg.append("g")
                            .attr("id", "display")
                            .selectAll("rect")
                            .data(rectangles)
                            .enter()
                            .append("rect")
                            .attr("class", "aggregated")
                            .filter(d => d != undefined)
                            .attr("x", d => xScale(d[0]%numVertical/numVertical))
                            .attr("y", d => yScale(Math.floor(d[0]/numVertical)/numHorizontal) - dimensions.height/numHorizontal)
                            .attr("width", xScale(1.0/numVertical))
                            .attr("height", dimensions.height - yScale(1.0/numHorizontal))
                            .attr("fill", d => {
                                if(d[1]/d[2] <= .1)
                                    return colorScaleSmall(d[1]/d[2])
                                return colorScaleBig(d[1]/d[2])
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 0)
                            .on("mouseover", function(d, i){
                                d3.select(this)
                                .attr("stroke-width", "1")
                                d3.selectAll(".aggregated2")._groups[0][d3.select(this)._groups[0][0].__data__[0]].setAttribute("stroke-width", "1") //what if i gave every rect a unique id
                                text
                                .text("Percentage made (goals/shots) in Rectangle: " + 100*(Math.round(i[1]/i[2] * 100) / 100).toFixed(2) + "%  Number of Shots in Rectangle: " + i[2])
                                
                                

                            })
                            .on("mouseout", function(){
                                d3.select(this)
                                .attr("stroke-width", "0")
                                d3.selectAll(".aggregated2")._groups[0][d3.select(this)._groups[0][0].__data__[0]].setAttribute("stroke-width", "0") //what if i gave every rect a unique id

                            })
                            .append("text")
                            .text(d => d[0])
        }
        createDisplay(rectangles)

        var text = d3.select('#shotsText')
                    .attr("text-anchor", "end") //makes sure it does not go outside the svg
                    .attr("font-family", "sans-serif")
                    .style("font-size", 10)
                    .text("Percentage made (goals/shots) in Rectangle: 0%  Number of Shots in Rectangle: 0")


        var penaltyClicked = function(){
            if(document.getElementById("penalty-box").value == "Penalty Box"){
                document.getElementById("penalty-box").value="Whole Field";
                d3.selectAll(".aggregated")
                .filter(d => {
                    if(d != undefined){
                        return d[3] == false;
                    }
                    })
                .transition().duration(100)
                .attr("width", 0)
                d3.selectAll(".aggregated")
                .filter(d => {
                    if(d != undefined){
                        return d[3] == true;
                    }
                    })
                .transition()
                .attr('transform', 'translate(-195,670)rotate(-90,200,112)scale(2.8 2)')

                d3.selectAll(".aggregated2")
                .filter(d => {
                    if(d != undefined){
                        return d[3] == false;
                    }
                    })
                .transition().duration(100)
                .attr("width", 0)
                d3.selectAll(".aggregated2")
                .filter(d => {
                    if(d != undefined){
                        return d[3] == true;
                    }
                    })
                .transition()
                .attr('transform', 'translate(-195,670)rotate(-90,200,112)scale(2.8 2)')    
            }        
            else{
                document.getElementById("penalty-box").value="Penalty Box";
                createDisplay(rectangles)
                createDisplay2(rectangles)
            }
        }
        d3.select("#penalty-box").on('click', penaltyClicked)

            //BELOW IS CODE COMMENTED OUT FOR CIRCULAR FISHEYE, DISTORTS RECTANGLES TOO WEIRDLY...
            /*var fisheye = d3.fisheye.circular()
                                    .radius(30)
                                    .distortion(.1)

            fisheye.focus([dimensions.width/2, (dimensions.height+dimensions.margin.top)/2])


            d3.selectAll(".aggregated").attr("transform", (d, i) => {
                // console.log("d", d)
                // console.log("i", i)

                if(d != undefined){
                    var xAndy = {x: d3.selectAll(".aggregated")._groups[0][d[0]].getAttribute("x"), y: d3.selectAll(".aggregated")._groups[0][i].getAttribute("y")}
                    // console.log(xAndy)
                    var fe = fisheye(xAndy)
                    // console.log("fe", fe)
                    return "translate(" + [fe.x-xAndy.x, fe.y-xAndy.y] + ")" + "scale(" + fe.z + ")"
                }
            })

            svg.on("mousemove", function(event){
                var mouse = d3.pointer(event)
                // console.log(mouse)
                fisheye.focus(mouse)
                d3.selectAll(".aggregated").attr("transform", (d, i) => {
                    // console.log("d hey", d)
                    // console.log("i", i)
                    if(d != undefined){
                        var xAndy = {x: d3.selectAll(".aggregated")._groups[0][i].getAttribute("x"), y: d3.selectAll(".aggregated")._groups[0][i].getAttribute("y")}

                     var fe = fisheye(xAndy)
                      //console.log("fe", fe)
                     return "translate(" + [fe.x-xAndy.x, fe.y-xAndy.y] + ")" + "scale(" + fe.z + ")"
                    }
                })  
            })
            var xFisheye = d3.fisheye.scale(d3.scale.identity).domain([0, width]).focus(0),
            yFisheye = d3.scale.linear().domain([0, height]);
            */


            //second svg for total shots
            var svg2 = d3.select("#choropleth2")
            .style("width", dimensions.width)
            .style("height", dimensions.height)

            createDisplay2 = function(rectangles){
                svg2.select("#display2").remove()
                var display2 = svg2.append("g")
                                .attr("id", "display2")
                                .selectAll("rect")
                                .data(rectangles)
                                .enter()
                                .append("rect")
                                .attr("class", "aggregated2")
                                .filter(d => d != undefined)
                                .attr("x", d => xScale(d[0]%numVertical/numVertical))
                                .attr("y", d => yScale(Math.floor(d[0]/numVertical)/numHorizontal) - dimensions.height/numHorizontal)
                                .attr("width", xScale(1.0/numVertical))
                                .attr("height", dimensions.height - yScale(1.0/numHorizontal))
                                .attr("fill", d => totalColorScale(d[2]))
                                .attr("stroke", "black")
                                .attr("stroke-width", 0)
                                .on("mouseover", function(d, i){
                                    d3.select(this)
                                    .attr("stroke-width", "1")
                                    d3.selectAll(".aggregated")._groups[0][d3.select(this)._groups[0][0].__data__[0]].setAttribute("stroke-width", "1") //what if i gave every rect a unique id
                                    text
                                    .text("Percentage made (goals/shots) in Rectangle: " + 100*(Math.round(i[1]/i[2] * 100) / 100).toFixed(2) + "%  Number of Shots in Rectangle: " + i[2])
    
                                })
                                .on("mouseout", function(){
                                    d3.select(this)
                                    .attr("stroke-width", "0")
                                    d3.selectAll(".aggregated")._groups[0][d3.select(this)._groups[0][0].__data__[0]].setAttribute("stroke-width", "0") //what if i gave every rect a unique id
                                })
                                .append("text")
                                .text(d => d[0])
            }
            createDisplay2(rectangles)

            d3.select("#numVertical").on("change", function(){
                numVertical = parseInt(document.getElementById("numVertical").value)
                calcRectangles()
                createDisplay(rectangles)
                createDisplay2(rectangles)
                if(document.getElementById("penalty-box").value == "Whole Field"){
                    document.getElementById("penalty-box").value="Penalty Box"
                    penaltyClicked()
                }
            })
                
            d3.select("#numHorizontal").on("change", function(){
                numHorizontal = parseInt(document.getElementById("numHorizontal").value)
                calcRectangles()
                createDisplay(rectangles)
                createDisplay2(rectangles)
                if(document.getElementById("penalty-box").value == "Whole Field"){
                    document.getElementById("penalty-box").value="Penalty Box"
                    penaltyClicked()
                }
            })
    }

)
