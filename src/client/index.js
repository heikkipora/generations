import React from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import {parseGedcom, toTree} from './gedcom'

class GenerationsApp extends React.Component {
  constructor() {
    super()
    this.state = {
      raw: '',
      persons: [],
      families: [],
      selectedPerson: '',
      tree: {},
      stats: {}
    }
  }

  componentDidMount = () => {
  }

  render = () =>
    <div>
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container content">
            <h1 className="title">
              Generations
            </h1>
            <p>Visualizing a GEDCOM format genealogy data file as tree.</p>
            <p>All processing is done securely in your browser and no data is submitted to a remote server.</p>
          </div>
        </div>
      </section>
      <section className="hero">
        <div className="hero-body">
          <div className="container content">
            <textarea value={this.state.raw} onChange={this.handleGedcomChange} className="textarea is-small" placeholder="Paste GEDCOM data here" rows="5"></textarea>
            <p>Found {this.state.persons.length} people and {this.state.families.length} families.</p>
            {this.renderSelect()}
            <p>&nbsp;</p>
            <nav className="level">
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">People</p>
                  <p className="title">{this.state.stats.people || '-'}</p>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Years</p>
                  <p className="title">{this.state.stats.years || '-'}</p>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Earliest</p>
                  <p className="title">{this.state.stats.earliest || '-'}</p>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Latest</p>
                  <p className="title">{this.state.stats.latest || '-'}</p>
                </div>
              </div>
            </nav>
            <pre>{JSON.stringify(this.state.tree, null, 2)}</pre>
          </div>
        </div>
      </section>
    </div>

  renderSelect = () =>
    <Select name="persons"
            value={this.state.selectedPerson}
            onChange={this.handlePersonChange}
            options={this.state.persons.map(this.personToOption)}/>

  handleGedcomChange = event => {
    const raw = event.target.value
    const {persons, families} = parseGedcom(raw)
    this.setState({
      raw,
      persons,
      families
    })
  }

  handlePersonChange = selectedPerson => {
    const {tree, stats} = selectedPerson ? toTree(this.state.persons, this.state.families, selectedPerson.value) : {tree: {}, stats: {}}
    this.setState({selectedPerson, tree, stats})
  }

  personToOption = person => {
    return {
      value: person.id,
      label: `${person.name} (${person.yearsLabel})`
    }
  }
}

ReactDOM.render(<GenerationsApp/>, document.getElementById('app'))
