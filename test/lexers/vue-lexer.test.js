import { assert } from 'chai'
import VueLexer from '../../src/lexers/vue-lexer'

describe('VueLexer', () => {
  it('extracts keys from template & js', (done) => {
    const Lexer = new VueLexer()
    const content =
      "<template><p>{{ $t('first') }}</p></template><script>export default " +
      "{ mounted() { this.$i18n.t('second'); } }</script>"
    assert.deepEqual(Lexer.extract(content), [
      { key: 'second' },
      { key: 'first' },
    ])
    done()
  })

  it('extracts keys with interpolation from template & js', (done) => {
    const Lexer = new VueLexer()
    const content =
      "<template><p>{{ $t('first {test}', {test: 'station'}) }}</p></template>" +
      "<script>export default { mounted() { this.$i18n.t('second {test}', " +
      "{test: 'interpol'}); } }</script>"
    assert.deepEqual(Lexer.extract(content), [
      {
        key: 'second {test}',
        test: 'interpol',
      },
      {
        key: 'first {test}',
        test: 'station',
      },
    ])
    done()
  })

  it('extracts keys with plural from template & js', (done) => {
    const Lexer = new VueLexer()
    const content =
      "<template><p>{{ $t('first', {count: 5}) }}</p></template><script>export default " +
      "{ mounted() { this.$i18n.t('second', {count: 2}); } }</script>"
    assert.deepEqual(Lexer.extract(content), [
      {
        key: 'second',
        count: '2',
      },
      {
        key: 'first',
        count: '5',
      },
    ])
    done()
  })

  it('extracts custom options', (done) => {
    const Lexer = new VueLexer()
    const content =
      "<template><p>{{ $t('first', {description: 'test'}) }}</p></template><script>export default " +
      "{ mounted() { this.$i18n.t('second'); } }</script>"
    assert.deepEqual(Lexer.extract(content), [
      { key: 'second' },
      { key: 'first', description: 'test' },
    ])
    done()
  })

  it('extracts i18n component translation', (done) => {
    const Lexer = new VueLexer()
    const content = `<template>
  <div>
    <h1>{{ $t('TEMPLATE') }}</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import i18next from './i18n'
import i18n from '@/components/i18n'

const outside = i18next.t('OUTSIDE_OF_COMPONENT')

export default Vue.extend({
  components: {
    i18n,
  },
  props: {
    prop: {
      type: String,
      default: () => i18next.t('DEFAULT_PROP_VALUE'),
    },
  },
  computed: {
    msg() {
      return this.$t('COMPUTED_VALUE')
    },
  },
  methods: {
    add() {
      return this.$t('METHOD')
    },
  },
  beforeRouteUpdate() {
    this.$t('BEFORE_ROUTE_UPDATE')
  },
})
</script>`

    assert.deepEqual(Lexer.extract(content.toString('utf8')), [
      { key: 'OUTSIDE_OF_COMPONENT' },
      { key: 'DEFAULT_PROP_VALUE' },
      { key: 'COMPUTED_VALUE' },
      { key: 'METHOD' },
      { key: 'BEFORE_ROUTE_UPDATE' },
      { key: 'TEMPLATE' },
    ])
    done()
  })
})
