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
    if (compiledComponent.script) {
      keys = keys.concat(Lexer.extract(compiledComponent.script.content))
    }

    const Lexer2 = new JavascriptLexer({ functions: this.functions })
    Lexer2.on('warning', (warning) => this.emit('warning', warning))

    if (compiledComponent.template) {
      keys = keys.concat(
        Lexer2.extract(require('vue-template-compiler').compile(content).render)
      )
    }

    return keys
  }
}
