function main(){
    var m = [20, 20, 30, 20],
        w = 940 - m[1] - m[3],
        h = 600 - m[0] - m[2];
    var x,
    y,
    duration = 10000,
    delay = 500;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("body").append("svg")
        .attr("width", 1000)
        .attr("height", 1100)
        .append("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    
    var data = [{
        key: "AAPL",
        
        sumPrice: 1
    },
    {
        key: "aaa",
        sumPrice: 3
    }
     ,{
        key: "IBM",
        
        sumPrice: 4
    }, {
        key: "MSFT",
        
        sumPrice: 4
    }
    ]

    x = d3.scaleBand();

    y = d3.scaleLinear();

    x.domain(data.map(function(d) {
            return d.key;
        }))
        .rangeRound([0, w])
        

    var pie = d3.pie()
        .value(function(d) {
            return d.sumPrice;
        });

    var arc = d3.arc();

    y.domain([0, d3.max(data.map(function(d) {
            return d.sumPrice;
        }))])
        .range([h / 4 - 20, 0]);
    
    var g = svg.selectAll(".symbol")
    .data(function() {
        return pie(data);
    })
    .enter()
    .append("g")
    .attr("class", "symbol");

    g.append("rect")
    .style("fill", function(d) {
        return color(d.data.key);
    })
    .attr("x", function(d){
        return x(d.data.key);
    })
    .attr("y", function(d){
        return y(d.data.sumPrice);
    })
    .attr("width", x.bandwidth())
    .attr("height", function(d) {
            return h - y(d.data.sumPrice);
        });
    g.append("path")
    .style("fill", function(d) {
        return color(d.data.key);
    });

    g.append("text")
    .attr("transform", function(d){
        return "translate(" + (x(d.data.key)+x.bandwidth()/3) + "," + (h+20) + ")";
    })
    .text(function(d) {
        return d.data.key;
    });
setTimeout(toPie, 1000)
setTimeout(toBar, 11000)
function toPie(){
    var g = svg.selectAll(".symbol");

    g.selectAll("rect").remove();

    g.selectAll("path")
        .transition()
        .duration(duration)
        .tween("rc", arcTween);

    //The idea here is to first draw an arc like a bar,
    //then tween the bar-like arc to the donut arc. 
    //Thus, the key is find the initial bar size and position:
    //The initial bar height is approximated by the length of 
    //outside arc: barHeight = init_OuterRadius * init_Angle. 
    //So we can get the startAngle shown in f;
                                       
    function arcTween(d) {
        
        var path = d3.select(this),
            //text = d3.select(this.parentNode).select("text"),
            x0 = x(d.data.key),
            y0 = h - y(d.data.sumPrice); //initial height

        return function(t) {
            
            var r = h / 2 / t,
                //a is stepping factor, starting from 1 to 0,
                //as the timer t goes.
                //A simper alternative: a = 1 - t;
                a = Math.cos(t * Math.PI / 2),
                xx = (-r + (a) * (x0 + x.bandwidth()) + (1 - a) * (w + h) / 2),
                yy = ((a) * h + (1 - a) * h / 2),
                f = {
                    innerRadius: (r - x.bandwidth() / (2 - a)) * a,
                    outerRadius: r,
                    startAngle: a * (Math.PI / 2 - y0 / r) + (1 - a) * d.startAngle,
                    endAngle: a * (Math.PI / 2) + (1 - a) * d.endAngle
                };

                
            console.log( d.startAngle)
            path.attr("transform", "translate(" + xx + "," + yy + ")");
            path.attr("d", arc(f));
            //text.attr("transform", "translate(" + arc.centroid(f) + ")translate(" + xx + "," + yy + ")rotate(" + ((f.startAngle + f.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")");
        };
    }
}

function toBar(){
    var g = svg.selectAll(".symbol");

    

    g.selectAll("path")
        .transition()
        .duration(duration)
        .tween("arc", arcTween);
                                     
    function arcTween(d) {
        var path = d3.select(this),
            //text = d3.select(this.parentNode).select("text"),
            x0 = x(d.data.key),
            y0 = h - y(d.data.sumPrice); //initial height

        return function(t) {
            t = 1-t;
            var r = h / 2 / Math.min(1, t + 1e-3),
                //a is stepping factor, starting from 1 to 0,
                //as the timer t goes.
                //A simper alternative: a = 1 - t;
                a = Math.cos(t * Math.PI / 2),
                xx = (-r + (a) * (x0 + x.bandwidth()) + (1 - a) * (w + h) / 2),
                yy = ((a) * h + (1 - a) * h / 2),
                f = {
                    innerRadius: (r - x.bandwidth() / (2 - a)) * a,
                    //pie chart: (r - x.rangeBand() / (2 - a)) * a,
                    outerRadius: r,
                    startAngle: a * (Math.PI / 2 - y0 / r) + (1 - a) * d.startAngle,
                    endAngle: a * (Math.PI / 2) + (1 - a) * d.endAngle
                };


            path.attr("transform", "translate(" + xx + "," + yy + ")");
            path.attr("d", arc(f));
            //text.attr("transform", "translate(" + arc.centroid(f) + ")translate(" + xx + "," + yy + ")rotate(" + ((f.startAngle + f.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")");
        };
    }
}     

}

// var d = ["123","321"]
// d3.select("body")
//     .selectAll("p")
//     .data(d)
//     .enter().append("p")
//     .text(function(d, i){
//         return d;
//     })
    //create table
    // var matrix = [
    //     [1,2,3,4],
    //     [5,6,7,8],
    //     [9,10]
    // ]
    // var tr = d3.select("body")
    //     .append("table")
    //     .selectAll("tr")
    //     .data(matrix)
    //     .enter()
    //     .append("tr")
    // var td = tr.selectAll("td").data(function(d){
    //         return d
    //     })
    //     .enter()
    //     .append("td")
    //     .text(function(d){
    //         return d
    //     })
    //exit method
    // var mydata = ["hello"]
    // d3.select("body").selectAll("p")
    //     .data(mydata)
    //     .text(function(d){
    //         return d
    //     })
    //     .exit()
    //     .remove();
    //datum
    // d3.select("body")
    //     .select("p")
    //     .datum([1,2,3])
    //     .text(function(d,i){
    //         return 'power' + d
    //     })
    // mouse on
    // d3. select("div").on("mouseover", function(){
    //     d3.select(this)
    //         .style("background-color", "blue")
    //})
    // var myData =["2312312313131312312"]
    // d3.select("body").selectAll("p")
    //     .data(myData)
    //     .enter()//dynamicaaly create placeholder
    //     .append("p")
    //     .style('color',function(d){
    //         if(d % 3 ===0){
    //             return "red"
    //         }
    //         else{
    //             return "blue"
    //         }
    //     })
    //     .text(function(d){
    //         return d;
    //     })
    // d3.json().then(
    //     function(d){
    //         console.log(d.age[44]);
    //     }
    // )
    // d3.csv('').then(
    //     function(d){
    //         for(let index = 0; index<d.length;index++){

    //         }
    //     }
    // )
    //bar chart
    // var barData = [5, 10, 20,40, 60, 80]
    // var width = 900;//width of svg
    // var scaleFactor = 10
    // var barHeight = 20;

    // var graph = d3.select("body")
    //                 .append("svg")
    //                 .attr('width',width)
    //                 .attr('height', barHeight * barData.length)
    
    // var bar = graph.selectAll("g")
    //                 .data(barData)
    //                 .enter().append("g")
    //                 .attr('transform', function(d,i){
    //                     return 'translate(0,'+ i*barHeight+')'
    //                 }) 
    // bar.append("rect")
    //     .attr('width', function(d){
    //         return d * scaleFactor
    //     })
    //     .attr('height', barHeight-1)
    
    //     bar.append('text').attr('x', function(d){
    //         return (d * scaleFactor)
    //         })
    //         .attr('y', barHeight/2)
    //         .attr('dy','.35em')
    //         .text(function(d){
    //             return d;
    //         })
    //circle graph
    // var width = 500
    // var height = 500
    // var data = [10,15,20,25,30]
    // var colors = ['#9C4F96', '#FF6355', '#FBA949', '#FAE442', "#8bD448", '#2AA8F2']

    // var svg = d3.select('body')
    //             .append('svg')
    //             .attr('width', width)
    //             .attr('height', height);
    
    //             var group = svg.selectAll('g')
    //                             .data(data)
    //                             .enter()
    //                             .append('g')
    //                             .attr('transform', function(d, i){
    //                                 return 'translate(0,0)'
    //                             })

    //                 group.append('circle')
    //                             .attr('cx',function(d,i){
    //                                 return i*100+50
    //                             })
    //                             .attr('cy', function(d,i){
    //                                 return 100
    //                             })
    //                             .attr('r', function(d){
    //                                 return d * 1.5
    //                             })
    //                             .attr('fill', function(d, i){
    //                                 return colors[i]
    //                             })
    //using scale
        // var data = [100, 400, 300, 900, 560, 1000]
        // var width = 500
        // barHeight = 20
        // margin = 1;

        // var scale = d3.scaleLinear()
        //                 .domain([d3.min(data), d3.max(data)])
        //                 .range([100,300])
        
        // var svg = d3.select('body').append('svg')
        //                 .attr('width', width)
        //                 .attr('height', barHeight *data.length)
        // var group = svg.selectAll('g')
        //                 .data(data)
        //                 .enter()
        //                 .append('g')
        //                 .attr('transform', function(d, i){
        //                     return 'translate(0,'+ i*barHeight+')'
        //                 })
        // group.append('rect')
        //                 .attr('width', function(d){
        //                    return scale(d); 
        //                 })
        //                 .attr('height', barHeight - margin)

        // group.append('text')
        //         .attr('x', function(d){
        //             return (scale(d))
        //         })
        //         .attr('y', barHeight / 2)
        //         .attr('dy', '.35em')
        //         .text(function(d){
        //             return d;
        //         })
    //axes
        // var width = 500, height = 200
        // var data = [10, 15,20,25,30]

        // var svg = d3.select('body')
        //                 .append('svg')
        //                 .attr('width', width)
        //                 .attr('height', height)
        // var xScale = d3.scaleLinear()
        //                 .domain([d3.min(data), d3.max(data)])
        //                 .range([0, width-100])
        // var x_axis = d3.axisBottom()
        //                 .scale(xScale)
        // svg.append('g')
        //     .call(x_axis)

        // var width = 500, height = 400
        // var data = [10, 15,20,25,30]

        // var svg = d3.select('body')
        //                 .append('svg')
        //                 .attr('width', width)
        //                 .attr('height', height)
        // var yScale = d3.scaleLinear()
        //                 .domain([d3.min(data), d3.max(data)])
        //                 .range([height/2, 0])
        // var y_axis = d3.axisLeft()
        //                 .scale(yScale)
        // svg.append('g')
        // .attr('transform', 'translate(50,10)')
        // .call(y_axis)

        // var width = 500, height = 500
        // var data = [10, 15,20,25,30]
        // var svg = d3.select('body')
        //         .append('svg')
        //         .attr('width', width)
        //         .attr('height', height)

        // var xScale = d3.scaleLinear()
        //                 .domain([d3.min(data), d3.max(data)])
        //                 .range([0, width-100])

        // var yScale = d3.scaleLinear()
        //         .domain([d3.min(data), d3.max(data)])
        //         .range([height/2, 0])

        // var x_axis = d3.axisBottom()
        //                 .scale(xScale)

        // var y_axis = d3.axisLeft()
        //                 .scale(yScale)

        // svg.append('g')
        // .attr('transform', 'translate(50,10)')
        // .call(y_axis)
        // var xAxisTranslate = height/2 + 10

        // svg.append('g')
        // .attr('transform', 'translate(50,'+ xAxisTranslate +')')
        // .call(x_axis)
        //work with csv bar chart
        // var svg = d3.select("svg"),
        // margin =200,
        // width = svg.attr("width")-margin,
        // height = svg.attr("height") - margin

        // var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        //     yScale = d3.scaleLinear().range([height, 0]);
        
        //     var g = svg.append('g').attr("transform", "translate(100,100)")

        //     d3.csv("../stock_values.csv").then(function(data){
        //         xScale.domain(data.map(function(d){
        //             return d.year
        //         }))
        //         yScale.domain([0, d3.max(data, function(d){
        //             return d.value
        //         })])

        //         g.append("g").attr('transform', 'translate(0,'+height+')')
        //         .call(d3.axisBottom(xScale))
        //         g.append('g').call(d3.axisLeft(yScale).tickFormat(function(d){
        //             return "$" + d
        //         }).ticks(10))
            
        //         g.selectAll(".bar")
        //                 .data(data)
        //                 .enter()
        //                 .append("rect")
        //                 .attr("class","bar")
        //                 .on("mouseover", onMouseOver)
        //                 .on("mouseout", onMouseOut)
        //                 .attr("x",function(d){ return xScale(d.year)})
        //                 .attr("y",function(d){ return yScale(d.value)})
        //                 .attr("width", xScale.bandwidth())
        //                 .transition()
        //                 .ease(d3.easeLinear)
        //                 .duration(500)
        //                 .delay(function(d,i){ return i*50})
        //                 .attr("height", function(d){return height - yScale(d.value);})

        //     })
        //     function onMouseOver(d, i){
        //         d3.select(this).attr('class', 'highlight')
        //         d3.select(this)
        //             .transition()
        //             .duration(500)
        //             .attr('width', xScale.bandwidth()+ 5)
        //             .attr('y', function(d){return yScale(d.value)-10})
        //             .attr('height', function(d){ return height-yScale(d.value)+10})
        //             .attr('height', function(d){ return 50})
        //             .attr("rx", function(d){ return 500; })
        //             .attr("ry", function(d){ return 500; })
        //     }
        //     function onMouseOut(d, i){
        //         d3.select(this).attr('class', 'bar')
        //         d3.select(this)
        //             .transition()
        //             .duration(500)
        //             .attr('width', xScale.bandwidth())
        //             .attr('y', function(d){return yScale(d.value)})
        //             .attr('height', function(d){ return height-yScale(d.value)})
        //             .attr("rx", function(d){ return 0; })
        //             .attr("ry", function(d){ return 0; })
        //     }
        //pie chart
        // var data = [2,4,6,8,10,12]
        
        
        // var svg = d3.select("svg"),
        //     width = svg.attr('width'),
        //     height = svg.attr('height'),
        //     radius = Math.min(width, height)/2
            
        // var g =svg.append('g').attr('transform', 'translate('+width/2+','+height/2+')')
        // var color = d3.scaleOrdinal(d3.schemeCategory10)
        // var pie = d3.pie()

        // var arc = d3.arc()
        //             .innerRadius(0)
        //             .outerRadius(radius)

        // var arcs = g.selectAll('arc')
        //             .data(pie(data))
        //             .enter().append('g')
        //             .attr('class','arc')
        
        // arcs.append('path')
        //     .attr('fill', function(d,i){
        //         return color(i)
        //     })
        //     .attr('d', arc)
        // var data = [1,2,3,4];
  
        // // Selecting SVG using d3.select()
        // var svg = d3.select("svg");
  
        // let g = svg.append("g")
        //        .attr("transform", "translate(150,120)");
          
        // // Creating Pie generator
        // var pie = d3.pie();
  
        // // Creating arc
        // var arc = d3.arc()
        //             .innerRadius(10)
        //             .outerRadius(100);
  
        // // Grouping different arcs
        // var arcs = g.selectAll("arc")
        //             .data(pie(data))
        //             .enter()
        //             .append("g");
  
        // // Appending path 
        // arcs.append("path")
        //     .attr("fill", (data, i)=>{
        //         let value=data.data;
        //         return d3.schemeSet3[i];
        //     })
        //     .attr("d", arc);
    //}