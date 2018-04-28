const _ = require('lodash')
const fs = require('fs')
const gedcom = require('parse-gedcom')
const Promise = require('bluebird')

const readFileAsync = Promise.promisify(fs.readFile)
readFileAsync('pora.ged', 'utf8')
  .then(gedcom.parse)
  .then(nodes => {
    const individuals = _(nodes)
      .filter({tag: 'INDI'})
      .map(toPerson)
      .value()
    console.log(JSON.stringify(individuals, null, 2))
  })

function toPerson(node) {
  return {
    name: name(node),
    sex: sex(node),
    birth: birthYear(node),
    death: deathYear(node)
  }
}

function sex(node) {
  return tagData('SEX', node)
    .head()
}

function name(node) {
  return tagData('NAME', node)
    .map(name => name.replace(/\//g, ''))
    .head()
}

function birthYear(node) {
  return subTagData('BIRT', 'DATE', node)
    .map(extractYear)
    .head()
}

function deathYear(node) {
  return subTagData('DEAT', 'DATE', node)
    .map(extractYear)
    .head()
}

function extractYear(date) {
  const regex = /([1-9][0-9]{2,3})/
  const matches = regex.exec(date)
  if (matches && matches.length >= 2) {
    return matches[1]
  }
}

function tagData(tag, node) {
  return _(node.tree)
    .filter({tag})
    .map(({data}) => data)
}

function subTagData(tag, subTag, node) {
  return _(node.tree)
    .filter({tag})
    .map(({tree}) =>
      _(tree)
        .filter({tag: subTag})
        .map(({data}) => data)
    )
}