var chai = require('chai').should();
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
			graph.getNeighborsFor(nodeA).should.contain(nodeB.name);
			graph.getNeighborsFor(nodeA).should.contain(nodeC.name);
		});
		it("should return an empty array if the vertex has no neighbors", function(){
			graph.addEdge(nodeA, nodeB);
			graph.getNeighborsFor(nodeB).should.be.empty;
		});
		it("or the vertex is not in the graph", function(){
			graph.addEdge(nodeA, nodeB);
			graph.getNeighborsFor(nodeC).should.be.empty;
		})
	});

	describe('#pathBetween', function () {
		xit("should be able to tell if there is a path two nodes", function(){

		});
	});

	describe('#toString', function () {
		xit("should be able to be stringified", function(){

		});
	});
});