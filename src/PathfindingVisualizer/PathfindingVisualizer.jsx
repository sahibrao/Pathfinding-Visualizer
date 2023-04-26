import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;
const MAX_ROWS = 22;
const MAX_COLS = 48;
const ORIGINAL_MESSAGE = 'Press Visualize to Start!';
const FINAL_MESSAGE = 'Thank you!';
let message;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    message = ORIGINAL_MESSAGE;
    this.state = {
      grid: [],
      mouseIsPressed: false,
      mouseIsPressedForStartNode: false,
      mouseIsPressedForEndNode: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  removePreviousStartNode(grid){
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        if (grid[row][col].isStart){
          grid[row][col].isStart = false;
        }
      }
    }
    return grid;
  }

  removePreviousEndNode(grid){
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        if (grid[row][col].isFinish){
          grid[row][col].isFinish = false;
        }
      }
    }
    return grid;
  }

  handleMouseDown(row, col) {
    if(this.state.mouseIsPressedForStartNode){
      const newGrid = this.state.grid.slice();
      this.removePreviousStartNode(newGrid);
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isStart: !node.isStart,
      };
      newGrid[row][col] = newNode;
      message = ORIGINAL_MESSAGE;
      this.setState({grid: newGrid, mouseIsPressedForStartNode: false});
      return;
    }
    if(this.state.mouseIsPressedForEndNode){
      const newGrid = this.state.grid.slice();
      this.removePreviousEndNode(newGrid);
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isFinish: !node.isFinish,
      };
      newGrid[row][col] = newNode;
      message = ORIGINAL_MESSAGE;
      this.setState({grid: newGrid, mouseIsPressedForEndNode: false});
      return;
    }
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if(this.state.mouseIsPressedForStartNode || this.state.mouseIsPressedForEndNode){
      return;
    }
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    if(this.state.mouseIsPressedForStartNode || this.state.mouseIsPressedForEndNode){
      return;
    }
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  getStartNode(grid){
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        if (grid[row][col].isStart){
          return grid[row][col];
        }
      }
    }
    return grid[0][0];
  }
  getEndNode(grid){
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        if (grid[row][col].isFinish){
          return grid[row][col];
        }
      }
    }
    return grid[MAX_ROWS][MAX_COLS];
  }
  

  visualizeDijkstra() {
    console.log('visualising Dijkstra');
    const {grid} = this.state;
    const startNode = this.getStartNode(grid);
    const finishNode = this.getEndNode(grid);
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    message = FINAL_MESSAGE;
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder)
  }

  enterStartNode(){
    message = 'Pick a Node as your Starting Node'
    this.setState({mouseIsPressedForStartNode: true, mouseIsPressedForEndNode: false});
  }
  enterEndNode(){
    message = 'Pick a Node as your Ending Node'
    this.setState({mouseIsPressedForEndNode: true, mouseIsPressedForStartNode: false});
  }
  resetWalls(){
    const newGrid = this.state.grid;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        if (newGrid[row][col].isWall){
          newGrid[row][col].isWall = false;
        }
      }
    }
    this.setState({grid: newGrid});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <ul>
          <li id = 'main'><a href = "/">Pathfinding Visualizer</a></li>
          {/* eslint-disable-next-line */}
          <li onClick={() => this.visualizeDijkstra().then(message = FINAL_MESSAGE)}><a href = "#">Visualize!</a></li>
          {/* eslint-disable-next-line */}
          <li onClick={() => this.resetWalls()}><a href = "#">Reset Walls</a></li>
          {/* eslint-disable-next-line */}
          <li onClick={() => this.enterEndNode()}><a href = "#">End Node</a></li>
          {/* eslint-disable-next-line */}
          <li className = 'startNode' onClick={() => this.enterStartNode()}><a href = "#">Start Node</a></li>
        </ul>
        <p>{message}</p>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

// creating a 2d array as a Grid
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < MAX_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < MAX_COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    // TODO: For Dijkstra, it is infinity, may need to change for others
    distance: Infinity,
    isVisited: false,
    // TODO: May need to adjust later on if border problems arise
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};