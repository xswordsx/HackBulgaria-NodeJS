var should = require('chai').should();
var DirectedGraph = require('../graph');


describe("A directional graph", function(){
	var graph, nodeA, nodeB, nodeC;

	beforeEach(function () {
		graph = new DirectedGraph();
		nodeA = {
			name: "Lorem",
			children: {}
		};
		nodeB = {
			name: "ipsum",
			children: {}
		};
		nodeC = {
			name: "Sit don amis",
			children: {}
		};
	});

	afterEach(function () {
		Object.keys(graph.nodes).forEach(function(nodeName){
			delete graph.nodes[nodeName];
		});
		delete graph;
		delete nodeA;
		delete nodeB;
		delete nodeC;
	});


	it("should have nodes (which are objects)", function(){
		graph.should.have.property("nodes");
		graph.nodes.should.be.an("object");
	});

	describe('#addEdge', function () {
		it("should be able to add edges (from two given vertecies)", function(){
			graph.addEdge(nodeA, nodeB);
			graph.nodes.should.have.property(nodeA.name);
			graph.nodes.should.have.property(nodeB.name);
			graph.nodes.should.not.have.property(nodeC.name);

			Object.keys(graph.nodes).forEach(function(nodeName){
				delete graph.nodes[nodeName];
			});
			graph.nodes.should.be.empty;

			graph.nodes[nodeA.name] = nodeA;
			graph.addEdge(nodeA, nodeB);

			graph.nodes.should.have.property(nodeA.name);
			graph.nodes.should.have.property(nodeB.name);

		});
	});

	describe('#getNeighborsFor', function () {
		it("should be able to return the names of the neighbours of a given vertex", function(){
			graph.addEdge(nodeA, nodeB);
			graph.addEdge(nodeA, nodeC);
			graph.getNeighborsFor(nodeA.name).should.contain(nodeB.name);
			graph.getNeighborsFor(nodeA.name).should.contain(nodeC.name);
		});
		it("should return an empty array if the vertex has no neighbors", function(){
			graph.addEdge(nodeA, nodeB);
			graph.getNeighborsFor(nodeB.name).should.be.empty;
		});
		it("should return null if the vertex is not in the graph", function(){
			graph.addEdge(nodeA, nodeB);
			should.not.exist(graph.getNeighborsFor(nodeC.name));
		})
	});
DICKBUTT
	describe('#pathBetween', function () {
		it("should be able to tell if there is a path between two nodes", function(){
			graph.addEdge(nodeA, nodeB);
			graph.addEdge(nodeB, nodeC);
			// Graph is now: [A->B->C]
			nodeA.children = {"lorem": nodeA};
			console.log("A:", JSON.stringify(nodeA, null, 2));
			// console.log("B:", nodeB);
			graph.pathBetween(nodeA.name, nodeB.name).should.equal(true);
			graph.pathBetween(nodeB.name, nodeC.name).should.equal(true);
			graph.pathBetween(nodeA.name, nodeC.name).should.equal(true);

			graph.pathBetween(nodeC.name, nodeB.name).should.equal(false);
			graph.pathBetween(nodeB.name, nodeA.name).should.equal(false);
			graph.pathBetween(nodeC.name, nodeA.name).should.equal(false);

			graph.pathBetween(nodeA.name, nodeA.name).should.equal(false);
			graph.pathBetween(nodeB.name, nodeB.name).should.equal(false);
			graph.pathBetween(nodeC.name, nodeC.name).should.equal(false);
		});
	});

	describe('#toString', function () {
		xit("should be able to be stringified", function(){

		});
	});
});