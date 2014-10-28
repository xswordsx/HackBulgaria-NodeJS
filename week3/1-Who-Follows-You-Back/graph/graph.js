"use strict";

function DirectedGraph() {
	this.nodes = {};
};

DirectedGraph.prototype.addEdge = function (nodeA, nodeB) {
	this.nodes[nodeA.name] = this.nodes[nodeA.name] || nodeA;
	this.nodes[nodeB.name] = this.nodes[nodeB.name] || nodeB;

	this.nodes[nodeA.name].children[nodeB.name] = nodeB;
};

module.exports = DirectedGraph;