const MARGIN4 = {LEFT:10, RIGHT:10, TOP:10, BOTTOM:10}
const WIDTH4 = 550 - MARGIN4.LEFT - MARGIN4.RIGHT
const HEIGHT4 = 370 - MARGIN4.TOP - MARGIN4.BOTTOM

// Àrea do SB
const svgMP = d3.select("#multidimencionalProjection").append("svg") 
        .attr("width", WIDTH4 + MARGIN4.LEFT + MARGIN4.RIGHT)
        .attr("height",HEIGHT4 + MARGIN4.TOP + MARGIN4.BOTTOM)
    //.append("g")
        //.attr("transform", `translate(${WIDTH4 /2}, ${HEIGHT4 /2})`)

/*var x = d3.scaleLinear().range([MARGIN4.LEFT, WIDTH4]),
    y = d3.scaleLinear().range([HEIGHT4, MARGIN4.TOP]);*/
    
var imported = document.createElement('mp_teste2');
imported.src = 'worker.js';
worker = imported.src;

x = d3.scaleLinear()
.domain([-1, 1])
.range([0, WIDTH4]),
area = d3.area()
   .x((d,i) => i)
   .y0(WIDTH4)
   .y1((d,i) => WIDTH4 +  parseInt(3 * d||0));
  
  
      
d3.csv("data/excomment_mp_junit.csv",d3.autoType).then(function(data) {


      const circles = svgMP.selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .attr('r', 4)
          .attr('stroke-width', 0.3)
          .attr('fill', d => d3.rgb(d[0] * 256, d[1] * 256, d[2] * 256))
          .attr('stroke', d => d3.rgb(d[0] * 256, d[1] * 256, d[2] * 256))
          .attr('opacity', d => 0.5 + 0.5 * d[3]);

      const cost = svgMP.append('path')
          .attr('fill', '#aaa');            

      let pos = data.map(d => [Math.random() - 0.5, Math.random() - 0.5]);
      let costs = [];

      const timer = d3.timer(function () {
        circles
          .attr('cx', (d,i) => x(pos[i][0]))
          .attr('cy', (d,i) => x(pos[i][1]));
        cost.attr('d', area(costs));
      });

      worker.onmessage = function (e) {
          if (e.data.pos) pos = e.data.pos;
          if (e.data.iterations) {
            costs[e.data.iterations] = e.data.cost;
            if (e.data.iterations >= 399) timer.stop();
          }
      };
      worker.postMessage({
          nIter: 400,
          // dim: 2,
          perplexity: 20.0,
          // earlyExaggeration: 4.0,
          // learningRate: 100.0,
          // metric: 'euclidean',
          data: data
      });

  });
