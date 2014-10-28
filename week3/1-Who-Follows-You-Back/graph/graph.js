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
	if(!this.nodes[node.name]) {
		return [];
	} else {
		return Object.keys(this.nodes[node.name].children);
	}
};

module.exports = DirectedGraph;