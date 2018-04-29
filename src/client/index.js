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
      tree: {}
    }
  }

  componentDidMount = () => {
  }

  render = () =>
    <div>
      <section className="is-primary">
        <textarea value={this.state.raw} onChange={this.handleGedcomChange} className="textarea is-small" placeholder="Paste GEDCOM data here" rows="5"></textarea>
        <p>Found {this.state.persons.length} people and {this.state.families.length} families.</p>
      </section>
      <section>
        {this.renderSelect()}
      </section>
      <section>
        <pre>{JSON.stringify(this.state.tree, null, 2)}</pre>
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
    const tree = toTree(this.state.persons, this.state.families, selectedPerson.value)
    this.setState({selectedPerson, tree})
  }

  personToOption = person => {
    return {
      value: person.id,
      label: `${person.name} (${person.yearsLabel})`
    }
  }
}

ReactDOM.render(<GenerationsApp/>, document.getElementById('app'))
