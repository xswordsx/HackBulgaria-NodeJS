"use strict";

function DirectedGraph() {
	this.nodes = {};
};

DirectedGraph.prototype.addEdge = function (nodeA, nodeB) {
	this.nodes[nodeA.name] = this.nodes[nodeA.name] || nodeA;
	this.nodes[nodeB.name] = this.nodes[nodeB.name] || nodeB;

	this.nodes[nodeA.name].children[nodeB.name] = nodeB;
};

DirectedGraph.prototype.getNeighborsFor = function(nodeName) {
	if(!this.nodes[nodeName]) {
		return null;
	} else {
		return Object.keys(this.nodes[nodeName].children);
	}
};

DirectedGraph.prototype.pathBetween = function(nodeA, nodeB) {
	var bfsQueue = Object.keys(this.nodes[nodeA].children);
	var checked = {};
	while(bfsQueue.length != 0) {
		var nextStep = [];
		bfsQueue.forEach(function(nodeName){
			if(nodeB == nodeName) {
				return true;
			}
			checked[nodeName] = true;
			nextStep = nextStep.concat(Object.keys(this.nodes[nodeName].children));
		});
		bfsQueue = nextStep.filter(function(nodeName){
			return !checked[nodeName];
		});
	}
	return false;
};

module.exports = DirectedGraph;