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
        // console.log(shotsData)

        // console.log(shotsData[0])
        
        var dimensions = {
            width: 1.5*200, 
            height: 1.5*(68/105 * 200) + 30,
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
        var xScaleP = d3.scaleLinear()
                    .domain([1-16.5/105, 1])
                    .range([0, 1])

        var yScale = d3.scaleLinear()
                     .domain([1, 0])
                     .range([dimensions.margin.top, dimensions.height])
        var yScaleP = d3.scaleLinear()
                    .domain([16.5/68, 1-16.5/68])
                    .range([0, 1])

        var numVertical = 60, 
            numHorizontal = 25, 
            numVerticalP = Math.ceil(33/68*numHorizontal),
            numHorizontalP = Math.ceil(16.5/105 * numVertical)

        var rectangles = new Array(numVertical*numHorizontal)
        //rows are sectioned off of every numVertical...
        
        var numPenalty = 0;

        function calcRectangles(){
            rectangles = new Array(numVertical*numHorizontal)
            shotsData.forEach(d => {
            //figure out which rectangle
            //figure out which row...
            var penaltyBox = false
            if(d.positionX > 1-16.5/105 && d.positionY < 1-16.5/68 && d.positionY > 16.5/68){
                penaltyBox = true
            }
            var row = Math.floor(numHorizontal*(d.positionY))
            var col = Math.floor(numVertical*(d.positionX))
            var whichOne = numVertical*row + col

            var scaledY = yScaleP(d.positionY)
            var rowP = Math.floor(numHorizontalP*yScaleP(d.positionY))
            
            var scaledX = xScaleP(d.positionX)
            var colP = Math.floor(numVerticalP*(xScaleP(d.positionX)))

            var whichOneP = numVerticalP*rowP + colP

            if(rectangles[whichOne] == undefined){
                if(penaltyBox){
                    numPenalty++;
                }
                if(d.shotResult == "Goal"){
                    rectangles[whichOne] = [whichOne, 1, 1, penaltyBox, whichOneP] //which one, one goal made, one shot, whether or not in penalty box, which one for rotate
                    rectangles

                }
                else if(d.shotResult != "OwnGoal"){ //filters out own goals
                    rectangles[whichOne] = [whichOne, 0, 1, penaltyBox, whichOneP] //which one, zero goals made, one shot, whether or not in penalty box, which one for rotate
                }
            }
            else{
                if(d.shotResult == "Goal"){
                    rectangles[whichOne][1]++;
                }
                if(d.shotResult != "OwnGoal"){ //doesn't mistakenly count own goal
                    rectangles[whichOne][2]++;
                }
            }
        }) }
        calcRectangles()
        
        
                           //WHAT IF LESS THAN .1 HAD A DIFFERENT COLOR SCALE THAN >.1......
        var colorScale6 = d3.scaleLinear() //BEST SO FAR
                            .domain([0, .1, 1]) //can change middle number...
                            .range(["red", "green"])
        
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
            
        var colorScale0 = function(d){
            if(d == 0)
                return "#970b13"
            if(d < .025)
                return "#bb151a"
            if(d < .1)
                return "#fc8a6b"
            if(d < .15)
                return "#d3eecd"
            if(d < .2)
                return "#b7e2b1"
            if(d < .3)
                return "#97d494"
            if(d < .5)
                return "#73c378"
            if(d < .75)
                return "#2f984f"
            if(d < .9)
                return "#036429"
            return "#00441b"
        }

                        //    Green: ["#f7fcf5","#e8f6e3","#d3eecd","#b7e2b1","#97d494","#73c378","#4daf62","#2f984f","#157f3b","#036429","#00441b"]
                        //    Red:   ["#fff5f0","#fee3d6","#fdc9b4","#fcaa8e","#fc8a6b","#f9694c","#ef4533","#d92723","#bb151a","#970b13","#67000d"]
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
                            .attr("stroke", "#bbb")
                            .attr("stroke-width", 1)
                            .on("mouseover", function(d, i){
                                d3.select(this)
                                .attr("stroke", "black")
                                // console.log("this", d3.select(this)._groups[0][0].__data__[0])
                                // console.log(d3.selectAll(".aggregated2")._groups[0][d3.select(this)._groups[0][0].__data__[0]])//._groups[0][i].attr("stroke", "black")
                                d3.selectAll(".aggregated2")._groups[0][d3.select(this)._groups[0][0].__data__[0]].setAttribute("stroke", "black") //what if i gave every rect a unique id
                                text
                                .text("Percentage in Rectangle: " + 100*(Math.round(i[1]/i[2] * 100) / 100).toFixed(2) + "%")
                                text2
                                .text("Shots in Rectangle: " + i[2])

                            })
                            .on("mouseout", function(){
                                d3.select(this)
                                .attr("stroke", "#bbb")
                                d3.selectAll(".aggregated2")._groups[0][d3.select(this)._groups[0][0].__data__[0]].setAttribute("stroke", "#bbb") //what if i gave every rect a unique id

                            })
                            .append("text")
                            .text(d => d[0])
        }
        createDisplay(rectangles)

        var text = svg.append('text')
                    .attr("id", 'topbartext')
                    .attr("x", dimensions.width)
                    .attr("y", 20)
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("text-anchor", "end") //makes sure it does not go outside the svg
                    .attr("font-family", "sans-serif")
                    .style("font-size", 10)
                    .text("Percentage in Rectangle: 0%")



        d3.select("#penalty-box").on('click', function(){
            d3.selectAll(".aggregated")
              .filter(d => {
                  if(d != undefined){
                    return d[3] == false;
                  }
                })
              .transition().duration(1000)
              .attr("width", 0)
            // xScale
            //     .domain([.1, .9]) THIS CAUSES ERRORS...
            //current idea: change numVertical and numHorizontal depending on d3.extent(...)

            var yScale2 = d3.scaleLinear()
              .domain([1, 1-16.5/105])
              .range([0, dimensions.height])

            console.log("numV", numVerticalP)
            console.log("numH", numHorizontalP)
            
            d3.selectAll(".aggregated") //WHATS WRONG WITH THIS IS D[4] IS WRONG... made it separate but rounding errors cause slightly off numbering of squares
                .filter(d => {
                    if(d != undefined && d[3]){
                        console.log(d)
                        return d;
                    }
                })
                .transition().duration(10000)
                .attr("x", d => xScale(d[4]%numVerticalP/numVerticalP))
                .attr("y", d => yScale(Math.floor(d[4]/numVerticalP)/numHorizontalP) - dimensions.height/numHorizontalP)
                .attr("width", xScale(1.0/numVerticalP))
                .attr("height", dimensions.height - yScale(1.0/numHorizontalP))
            // d3.selectAll(".aggregated")
            //     .filter(d => {
            //         if(d != undefined && d[3])
            //             return d
            //     })
            //     .transition().duration(3000)
            //     .attr("transform", "scale(.5 1)")
            // d3.selectAll(".aggregated")
            //   .filter(d => d != undefined && d[3])
            //   .transition().duration(3000)
            //   .attr("x", d => xScale(d[4]%numHorizontal/numHorizontal))
            //   .attr("y", d => yScale2(Math.floor(d[4]/numHorizontal)/numVertical) - dimensions.height/numVertical)
            //   .attr("width", xScale(1.0/numHorizontal))
            //   .attr("height", d => dimensions.height - yScale(1.0/numHorizontal)) //HAS TO DO SOMETHING WITH THIS, CHANGING YSCALE AFFECTED THIS THINGS DOMAIN TOO!!!
            // d3.selectAll(".aggregated")
            //   .filter(d => {
            //       if(d != undefined){
            //         return d[3] == true;
            //       }
            //     })
            //   .transition().duration(3000)
            //   .attr('transform', 'translate(100,400)rotate(-90)scale(.5 1)')

            })

            //BELOW IS COMMENTED CODE FOR CIRCULAR FISHEYE, DISTORTS TOO WEIRDLY...
            /*var fisheye = d3.fisheye.circular()
                                    .radius(20)
                                    .distortion(.05)

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
            })*/
            // var xFisheye = d3.fisheye.scale(d3.scale.identity).domain([0, width]).focus(0),
            // yFisheye = d3.scale.linear().domain([0, height]);
            // console.log(xFisheye)


            //second svg for total shots
            var svg2 = d3.select("#choropleth2")
            .style("width", dimensions.width)
            .style("height", dimensions.height)

            var text2 = svg2.append('text')
            .attr("id", 'topbartext2')
            .attr("x", dimensions.width)
            .attr("y", 20)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("text-anchor", "end") //makes sure it does not go outside the svg
            .attr("font-family", "sans-serif")
            .style("font-size", 10)
            .text("Shots in Rectangle: 0")

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
                                .attr("stroke", "#bbb")
                                .attr("stroke-width", 1)
                                .on("mouseover", function(d, i){
                                    d3.select(this)
                                    .attr("stroke", "black")
                                    d3.selectAll(".aggregated")._groups[0][d3.select(this)._groups[0][0].__data__[0]].setAttribute("stroke", "black") //what if i gave every rect a unique id
                                    text
                                    .text("Percentage in Rectangle: " + 100*(Math.round(i[1]/i[2] * 100) / 100).toFixed(2) + "%")
                                    text2
                                    .text("Shots in Rectangle: " + i[2])
    
                                })
                                .on("mouseout", function(){
                                    d3.select(this)
                                    .attr("stroke", "#bbb")
                                    d3.selectAll(".aggregated")._groups[0][d3.select(this)._groups[0][0].__data__[0]].setAttribute("stroke", "#bbb") //what if i gave every rect a unique id
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
            })
                
            d3.select("#numHorizontal").on("change", function(){
                numHorizontal = parseInt(document.getElementById("numHorizontal").value)
                calcRectangles()
                createDisplay(rectangles)
                createDisplay2(rectangles)
            })
    }

)
