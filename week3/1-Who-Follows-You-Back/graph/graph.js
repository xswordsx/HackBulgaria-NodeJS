"use strict";

function DirectedGraph() {
	this.nodes = {};
};

DirectedGraph.prototype.addEdge = function (nodeA, nodeB) {
	this.nodes[nodeA.name] = this.nodes[nodeA.name] || nodeA;
	this.nodes[nodeB.name] = this.nodes[nodeB.name] || nodeB;

	this.nodes[nodeA.name].children[nodeB.name] = nodeB;
};

DirectedGraph.prototype.getNeighborsFor = function(node) {
	if(!this.nodes[node]) {
		return [];
	} else {
		return Object.keys(this.nodes[node].children);
	}
};

DirectedGraph.prototype.pathBetween = function(nodeA, nodeB) {
	var result = false;
	Objec.keys(this.nodes[nodeA].children).forEach(function(child){

	});
	return result;
};

module.exports = DirectedGraph;