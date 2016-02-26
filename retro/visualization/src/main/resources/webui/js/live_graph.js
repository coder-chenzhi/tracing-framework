//lightweight is an optional argument that will try to draw the graph as fast as possible
function live_graph(attachPoint) {	
  var attach = d3.select(attachPoint);
  
  // Get a handle to the datasets
  var datasets = DataSets();
  
  // Get the active dataset
  var active = datasets.keys()[0];
  
  // First create a dropdown
  var select = attach.append("select").attr("class", "graphselector")
                                      .on("change", function() { active = select.node().value; draw(); });
  var options = select.selectAll("option").data(datasets.keys());
  options.enter().append("option");
  options.exit().remove();
  options.attr("value", function(d) { return d; }).text(function(d) { return datasets.get(d).name(); });
  

	// Create the root SVG element and set its width and height
	var root = attach.append('svg:svg').attr('class', 'graphs');
	
	// Create the visualization components
	var graph = ResourceGraph().window(60000).refreshinterval(1000);
	
	// Create the subscriber
	var subscriber = new Subscriber().on("report", function(report) { datasets.collect(report); });
  
	/* Redraws the whole viz, for example when the parameters change or screen is resized.
	 * For now we redraw at a fixed interval */
	var nextdraw = null;
	function draw() {
//	  console.log("drawing active: " + active);
	  // Make sure only one draw loop at a time
	  window.clearTimeout(nextdraw);
	  
		// Determine the new widths and heights
		var width = window.innerWidth;
		var height = window.innerHeight - select.node().offsetHeight;
		
		console.log(width, height);
		
		// Resize the chart
		root.attr('width', width);
		root.attr('height', height);
		
		// Modify the viz parameters
		graph.width(width).height(height);

		// Redraw the viz
		root.datum(datasets.get(active)).call(graph);
		nextdraw = window.setTimeout(draw, 500);
	}

	// This function animates the graph by calling itself at a regular interval
	var nextanimate;
  function animate() {
    window.clearTimeout(nextanimate);
    root.datum(datasets.get(active)).call(graph.transition);
    nextanimate = window.setTimeout(animate, graph.refreshinterval());
  }
  animate();
	
	// Finally, draw it explicitly the first time
  draw();
  
}