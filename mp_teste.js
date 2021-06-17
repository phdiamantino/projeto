import * as tf from "@tensorflow/tfjs";
import * as tsne from "@tensorflow/tfjs-tsne";


const MARGIN4 = {LEFT:10, RIGHT:10, TOP:10, BOTTOM:10}
const WIDTH4 = 550 - MARGIN4.LEFT - MARGIN4.RIGHT
const HEIGHT4 = 370 - MARGIN4.TOP - MARGIN4.BOTTOM

// Àrea do SB
const svgMP = d3.select("#multidimencionalProjection").append("svg") 
        .attr("width", WIDTH4 + MARGIN4.LEFT + MARGIN4.RIGHT)
        .attr("height",HEIGHT4 + MARGIN4.TOP + MARGIN4.BOTTOM)
    //.append("g")
        //.attr("transform", `translate(${WIDTH4 /2}, ${HEIGHT4 /2})`)
        
        const NFeatures = 200;
        //const newNFeatures = 2;
        
        const nPoints = 200;
        
        const dataPlot = tf.randomUniform([nPoints, NFeatures]);
        console.log(dataPlot);
        const plotTensor = (data) => {
          tf.toPixels(dataPlot, document.getElementById("myCanvas"));
        };
        plotTensor(dataPlot);
        //const rdmProjection = tf.randomNormal(
        //  [NFeatures, newNFeatures],
        ////  0.0,
        // 1 / newNFeatures
        //);
        
        ///export const projData = data.matMul(rdmProjection);
        
        //console.log(projData.print());
        /*
        // Initialize the tsne optimizer
        const tsneOpt = tsne.tsne(data);
        tsneOpt.verbose = true;
        //let coordinatesArray;
        // Compute a T-SNE embedding, returns a promise.
        // Runs for 1000 iterations by default.
        tsneOpt
          .compute()
          .then(() => {
            // tsne.coordinate returns a *tensor* with x, y coordinates of
            // the embedded data.
            const coordinates = tsneOpt.coordinates();
            console.log(coordinates);
            //fs.writeFile(coordinates.dataSync(), 'utf8');
          })
          .then(() => console.log("done!"));
        
        //export const embedding = tensorToArray;
        
        //console.log(coordinatesArray);
        
        //console.log(coordinatesArray);
        */
        /*
        const tsneOptGen = tsne.tsne(data);
        
        async function iterativeTsne() {
          // Get the suggested number of iterations to perform.
          const knnIterations = tsneOptGen.knnIterations();
          // Do the KNN computation. This needs to complete before we run tsne
          for (let i = 0; i < knnIterations; ++i) {
            await tsneOptGen.iterateKnn();
            // You can update knn progress in your ui here.
            tsneOptGen.verbose = true;
          }
        
          const tsneIterations = 1000;
          for (let i = 0; i < tsneIterations; ++i) {
            await tsneOptGen.iterate();
            // Draw the embedding here...
            const coordinates = tsne.coordinates();
            console.log(i);
          }
        }
        
        iterativeTsne();
        
        */
        
        /**
         * Run the example
         */
        async function start() {
          const numDimensions = 30;
          const numPoints = 5000;
        
          const data = generateData(numDimensions, numPoints);
          const coordinates = await computeEmbedding(data, numPoints);
          showEmbedding(coordinates);
        }
        
        /*
         * Generate some synthetic data to demonstrate the T-SNE implementation.
         *
         * The data is drawn from a straight line in the high dimensional space to which
         * random noise is added. The data must be a rank 2 tensor.
         */
        function generateData(numDimensions, numPoints) {
          const data = tf.tidy(() => {
            return tf
              .linspace(0, 1, numPoints * numDimensions)
              .reshape([numPoints, numDimensions])
              .add(tf.randomUniform([numPoints, numDimensions]));
          });
          return data;
        }
        
        /*
         * Computes our embedding.
         *
         * This runs the T-SNE algorithm over our data tensor
         * and returns x,y coordinates in embedding space.
         *
         */
        async function computeEmbedding(data, numPoints) {
          const embedder = tsne.tsne(data, {
            perplexity: 18,
            verbose: true,
            knnMode: "auto"
          });
        
          // This will run the TSNE computation for 1000 steps.
          // Note that this may take a while.
          await embedder.compute(1000);
        
          // Get the normalized coordinates of the data
          return await embedder.coordsArray();
        }
        
        /**
         * This will add a new plot visualizing the embedding space on a scatterplot.
         */
        function showEmbedding(data) {
          const margin = { top: 20, right: 15, bottom: 60, left: 60 };
          const width = 800 - margin.left - margin.right;
          const height = 800 - margin.top - margin.bottom;
        
          const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
          const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
        
          const chart = d3
            .select("body")
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "chart");
        
          const main = chart
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "main");
        
          const xAxis = d3.axisBottom(x);
          main
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "main axis date")
            .call(xAxis);
        
          const yAxis = d3.axisLeft(y);
          main
            .append("g")
            .attr("transform", "translate(0,0)")
            .attr("class", "main axis date")
            .call(yAxis);
        
          const dots = main.append("g");
        
          dots
            .selectAll("scatter-dots")
            .data(data)
            .enter()
            .append("svg:circle")
            .attr("cx", (d) => x(d[0]))
            .attr("cy", (d) => y(d[1]))
            .attr("stroke-width", 0.25)
            .attr("stroke", "#1f77b4")
            .attr("fill", "none")
            .attr("r", 5);
        }
        //start();
        document.addEventListener("DOMContentLoaded", () => start());
        