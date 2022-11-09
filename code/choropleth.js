
d3.csv("/ProjectData/shots.csv").then(

    function(shotsData){
        
        //pitch is preferred to be 105 by 68 metres... but varies

        //positionX is index 9, positionY is index 10
        //shot result is index 7

        console.log(shotsData)

        console.log(shotsData[0])
        
        var dimensions = {
            width: 300,
            height: 150
        }

        var svg = d3.select("#choropleth")
                    .style("width", dimensions.width)
                    .style("height", dimensions.height)


        var xScale = d3.scaleLinear()
                    .domain([0, 1])
                    .range([0, dimensions.width])

        var yScale = d3.scaleLinear()
                     .domain([1, 0])
                     .range([0, dimensions.height])

        var colorScale = d3.scaleLinear()
                           .domain([0, 1])
                           .range(["red", "green"])

        // var colorScale = d3.scaleOrdinal()
        //                    .domain([0, 1])
        //                    .range(["#f7fcf5","#f6fcf4","#f6fcf4","#f5fbf3","#f5fbf2","#f4fbf2","#f4fbf1","#f3faf0","#f2faf0","#f2faef","#f1faee","#f1faee","#f0f9ed","#f0f9ec","#eff9ec","#eef9eb","#eef8ea","#edf8ea","#ecf8e9","#ecf8e8","#ebf7e7","#ebf7e7","#eaf7e6","#e9f7e5","#e9f6e4","#e8f6e4","#e7f6e3","#e7f6e2","#e6f5e1","#e5f5e1","#e4f5e0","#e4f4df","#e3f4de","#e2f4dd","#e1f4dc","#e1f3dc","#e0f3db","#dff3da","#def2d9","#ddf2d8","#ddf2d7","#dcf1d6","#dbf1d5","#daf1d4","#d9f0d3","#d8f0d2","#d7efd1","#d6efd0","#d5efcf","#d4eece","#d4eece","#d3eecd","#d2edcb","#d1edca","#d0ecc9","#cfecc8","#ceecc7","#cdebc6","#ccebc5","#cbeac4","#caeac3","#c9eac2","#c8e9c1","#c6e9c0","#c5e8bf","#c4e8be","#c3e7bd","#c2e7bc","#c1e6bb","#c0e6b9","#bfe6b8","#bee5b7","#bde5b6","#bbe4b5","#bae4b4","#b9e3b3","#b8e3b2","#b7e2b0","#b6e2af","#b5e1ae","#b3e1ad","#b2e0ac","#b1e0ab","#b0dfaa","#aedfa8","#addea7","#acdea6","#abdda5","#aadca4","#a8dca3","#a7dba2","#a6dba0","#a5da9f","#a3da9e","#a2d99d","#a1d99c","#9fd89b","#9ed799","#9dd798","#9bd697","#9ad696","#99d595","#97d494","#96d492","#95d391","#93d390","#92d28f","#91d18e","#8fd18d","#8ed08c","#8ccf8a","#8bcf89","#8ace88","#88cd87","#87cd86","#85cc85","#84cb84","#82cb83","#81ca82","#80c981","#7ec980","#7dc87f","#7bc77e","#7ac77c","#78c67b","#77c57a","#75c479","#74c478","#72c378","#71c277","#6fc276","#6ec175","#6cc074","#6bbf73","#69bf72","#68be71","#66bd70","#65bc6f","#63bc6e","#62bb6e","#60ba6d","#5eb96c","#5db86b","#5bb86a","#5ab769","#58b668","#57b568","#56b467","#54b466","#53b365","#51b264","#50b164","#4eb063","#4daf62","#4caf61","#4aae61","#49ad60","#48ac5f","#46ab5e","#45aa5d","#44a95d","#42a85c","#41a75b","#40a75a","#3fa65a","#3ea559","#3ca458","#3ba357","#3aa257","#39a156","#38a055","#379f54","#369e54","#359d53","#349c52","#339b51","#329a50","#319950","#30984f","#2f974e","#2e964d","#2d954d","#2b944c","#2a934b","#29924a","#28914a","#279049","#268f48","#258f47","#248e47","#238d46","#228c45","#218b44","#208a43","#1f8943","#1e8842","#1d8741","#1c8640","#1b8540","#1a843f","#19833e","#18823d","#17813d","#16803c","#157f3b","#147e3a","#137d3a","#127c39","#117b38","#107a37","#107937","#0f7836","#0e7735","#0d7634","#0c7534","#0b7433","#0b7332","#0a7232","#097131","#087030","#086f2f","#076e2f","#066c2e","#066b2d","#056a2d","#05692c","#04682b","#04672b","#04662a","#03642a","#036329","#026228","#026128","#026027","#025e27","#015d26","#015c25","#015b25","#015a24","#015824","#015723","#005623","#005522","#005321","#005221","#005120","#005020","#004e1f","#004d1f","#004c1e","#004a1e","#00491d","#00481d","#00471c","#00451c","#00441b"])
        
        //var yScale 
        //step 1: figure out how many rectangles we will be appending... depending on user input???
        //only do right half of the field???
        //USER CHOOSES LENGTH AND WIDTH OF BOX
        var numVertical = 80 //change depending on user input??
        var numHorizontal = 30 //ask how many vertical / horizontal cuts desired?

        //step 2: create all of these rectangels?

        //need to go through data and create a dictionary where the first index is the
        //number corresponding to the rectange and the second index is the percentage corresponding to it?
        var rectangles = new Array(numVertical*numHorizontal)
        //rows are sectioned off of every numVertical...

        shotsData.forEach(d => {
            // console.log("d", d)
            //figure out which rectangle
            //figure out which row...
            var row = Math.floor(numHorizontal*(+d.positionY))
            // console.log(row)
            var col = Math.floor(numVertical*(+d.positionX))
            // console.log(col)
            var whichOne = numVertical*row + col
            // rectangles[whichOne] = [+d.positionY, +d.positionX, d.shotResult]
            // console.log(rectangles[whichOne])
            if(rectangles[whichOne] == undefined){
                if(d.shotResult == "Goal"){
                    rectangles[whichOne] = [whichOne, 1, 1] //which one, one goal made, one shot
                }
                else{ //add else if if wanna test for own goals...
                    rectangles[whichOne] = [whichOne, 0, 1] //which one, zero goals made, one shot
                }
            }
            else{
                if(d.shotResult == "Goal"){
                    rectangles[whichOne][1]++;
                }
                rectangles[whichOne][2]++; //add if if wanna test for own goals...
            }
        }) 
        // console.log("rectangles:", rectangles)


        var colorScale2 = d3.scaleLinear()
                           .domain(d3.extent(rectangles, d => {
                            if(d != undefined)
                                return d[1]/d[2]
                           }))
                           .range(["red", "green"])

        var display = svg.append("g")
                            .selectAll("rect")
                            .data(rectangles)
                            .enter()
                            .append("rect")
                            .attr("x", d => {
                                if(d != undefined){
                                    return xScale(d[0]%numVertical/numVertical)
                                }
                            })
                            .attr("y", d =>{
                                if(d != undefined){
                                    return yScale(Math.floor(d[0]/numVertical)/numHorizontal) - dimensions.height/numHorizontal
                                }
                            })
                            .attr("width", xScale(1.0/numVertical))
                            .attr("height", dimensions.height - yScale(1.0/numHorizontal))
                            .attr("fill", d => {
                                if(d != undefined)
                                {
                                    console.log(d[1]/d[2])
                                    return colorScale2(d[1]/d[2])
                                }
                                else
                                    return "black"
                            })
                            .attr("stroke", "#bbb")
                            .attr("stroke-width", 1)
                            .on("mouseover", function(d, i){
                                d3.select(this)
                                .attr("stroke", "black")
                                text.text("Proportion in Rectangle: " + (Math.round(i[1]/i[2] * 100) / 100).toFixed(3))

                            })
                            .on("mouseout", function(){
                                d3.select(this)
                                .attr("stroke", "#bbb")
                            })
                            .append("text")
                            .text(d => {
                                if(d != undefined)
                                    return d[0];
                            })

        var text = svg.append('text')
                    .attr("id", 'topbartext')
                    .attr("x", dimensions.width)
                    .attr("y", 20)
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("text-anchor", "end") //makes sure it does not go outside the svg
                    .attr("font-family", "sans-serif")
                    .text("Proportion in Rectangle: 0")



        //step 3: depending on number/percentage of shots made in the different regions, figure out different color
        //in order to do this will need to define a colorscale first...
                            
    }

)