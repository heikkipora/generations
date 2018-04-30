import React from 'react'
import {select} from 'd3-selection'
import {forceCenter, forceLink, forceManyBody, forceSimulation, forceX} from 'd3-force'

class Tree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount = () => {
    this.createD3Tree()
  }

  componentDidUpdate = () => {
    this.createD3Tree()
  }

  createD3Tree = () => {
    const svg = select(this.node)
    const width = +svg.attr('width')
    const height = +svg.attr('height')

    svg.selectAll('*')
      .remove()

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.props.links)
      .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
  
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.props.nodes)
      .enter().append('circle')
        .attr('r', 5)
        .attr('fill', 'red')

    node.append('title')
      .text(d => d.name)

    const simulation = forceSimulation(this.props.nodes)
      .force('charge', forceManyBody())
      .force('link', forceLink(this.props.links).distance(30)) //.iterations(2))
      .force('centerX', forceX(width/2))
      .force('pushUp', forcePushUp)
      .on('tick', ticked)

    const nodes = this.props.nodes
    if (nodes.length > 0) {
      nodes[0].fx = width / 2
      nodes[0].fy = height - 10
    }

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].x = width / 2
      nodes[i].y = height / 2
    }

    const links = this.props.links
    function forcePushUp(alpha) {
      const k = alpha
      for (let i = 0; i < links.length; i++) {
        const link = links[i]
        link.source.vy += k
        link.target.vy -= k
      }
    }

    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
  
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    }
  }

  render = () => 
    <svg ref={node => this.node = node} width={1344} height={800}></svg>
}

export default Tree