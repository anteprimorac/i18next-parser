import BaseLexer from './base-lexer'
import JavascriptLexer from './javascript-lexer.js'

export default class VueLexer extends BaseLexer {
  constructor(options = {}) {
    super(options)

    this.functions = options.functions || ['$t', 't']
  }

  extract(content, filename) {
    let keys = []

    const compiledComponent = require('vue-template-compiler').parseComponent(
      content
    )
    const Lexer = new JavascriptLexer({ functions: this.functions })
    Lexer.on('warning', (warning) => this.emit('warning', warning))

    // extract keys from js script if exists
    if (compiledComponent.script) {
      keys = keys.concat(Lexer.extract(compiledComponent.script.content))
    }

    // compile and extract keys from component template if exists
    if (compiledComponent.template) {
      keys = keys.concat(
        Lexer.extract(require('vue-template-compiler').compile(content).render)
      )
    }

    return keys
  }
}
