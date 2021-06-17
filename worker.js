self.onmessage = function(e){
  var msg = e.data;

 let model = new TSNE({
  dim: msg.dim || 2,
  perplexity: msg.perplexity || 100.0,
  earlyExaggeration: msg.earlyExaggeration || 4.0,
  learningRate: msg.learningRate || 100.0,
  nIter: msg.nIter || 500,
  metric: msg.metric || 'euclidean'
});

 model.init({
  data: msg.data,
  type: 'dense'
 });

 model.on('progressData', function(pos){
  self.postMessage({pos: pos});
 });

 model.on('progressIter', function (iter) {
  self.postMessage({
    iterations: iter[0],
    cost: iter[1]
  });
});
 
  model.run();
};