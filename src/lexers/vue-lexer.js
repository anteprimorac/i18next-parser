import BaseLexer from './base-lexer'
import JavascriptLexer from './javascript-lexer.js'

export default class VueLexer extends BaseLexer {
  constructor(options = {}) {
    super(options)

    this.functions = options.functions || ['$t', 't']
  }

  extract(content, filename) {
    let keys = []

    if (content.indexOf('<script') !== -1) {
      const Lexer = new JavascriptLexer({ functions: this.functions })
      const compiledComponent = require('vue-template-compiler').parseComponent(
        content
      )
      Lexer.on('warning', (warning) => this.emit('warning', warning))
      if (compiledComponent.script) {
        keys = keys.concat(Lexer.extract(compiledComponent.script.content))
      }

      if (compiledComponent.template) {
        keys = keys.concat(
          Lexer.extract(
            require('vue-template-compiler').compile(content).render
          )
        )
      }
    } else {
      const Lexer = new JavascriptLexer()
      Lexer.on('warning', (warning) => this.emit('warning', warning))
      keys = keys.concat(Lexer.extract(content))

      const compiledTemplate = require('vue-template-compiler').compile(
        content
      ).render
      const Lexer2 = new JavascriptLexer({ functions: this.functions })
      Lexer2.on('warning', (warning) => this.emit('warning', warning))
      keys = keys.concat(Lexer2.extract(compiledTemplate))
    }

    return keys
  }
}
