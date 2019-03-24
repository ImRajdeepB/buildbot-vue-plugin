import Vue from 'vue'
import SampleVueComponent from './SampleVueComponent.vue'

console.log('Hello from the buildbot-vue-plugin-boilerplate!')

var module = angular.module('buildbot_vue_plugin_boilerplate', [
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.popover',
  'ngAnimate',
  'guanlecoja.ui',
  'bbData'
])
module.config([
  '$stateProvider',
  'glMenuServiceProvider',
  'bbSettingsServiceProvider',
  'config',
  (
    $stateProvider,
    glMenuServiceProvider,
    bbSettingsServiceProvider,
    config
  ) => {
    // Config object coming in from the master.cfg
    // console.log('config', config)

    // Name of the state
    const name = 'vuePluginBoilerplate'

    // Menu configuration
    glMenuServiceProvider.addGroup({
      name,
      caption: 'Vue Plugin Boilerplate',
      icon: 'question-circle',
      order: 0
    })

    // Configuration
    const cfg = {
      group: name,
      caption: 'Vue Plugin Boilerplate'
    }

    // Register new state
    const state = {
      template: '<my-vue-directive></my-vue-directive>',
      // templateUrl: `vue_plugin_boilerplate/views/${name}.html`,
      name,
      url: '/vuePluginBoilerplate',
      data: cfg
    }

    $stateProvider.state(state)

    // bbSettingsServiceProvider.addSettingsGroup({
    //   name: 'vuePluginBoilerplate',
    //   caption: 'Vue Plugin Boilerplate related settings',
    //   items: [
    //     {
    //       type: 'integer',
    //       name: 'buildLimit',
    //       caption: 'Number of builds to fetch',
    //       default_value: 500
    //     }
    //   ]
    // })
  }
])
module.directive('myVueDirective', [
  '$q',
  '$window',
  'dataService',
  'bbSettingsService',
  'resultsService',
  '$uibModal',
  '$timeout',
  (
    $q,
    $window,
    dataService,
    bbSettingsService,
    resultsService,
    $uibModal,
    $timeout
  ) => {
    function link(scope, element, attrs) {
      /* create an instance of the data accessor */
      var dataAccessor = dataService.open().closeOnDestroy(scope)

      /* get some changes and put the in the vue properties */
      var changes = dataAccessor.getChanges({
        limit: 50,
        order: '-changeid'
      })
      var props = {
        changes
      }

      var ComponentClass = Vue.extend(SampleVueComponent)
      /* cannot pass directly the changes, as the magic of buildbot 
          data module clashes with the magic of vue observers */
      var data = { changes: [] }
      var e = new ComponentClass({
        data: data,
        el: element.get(0)
      })
      function update() {
        data.changes = changes.slice()
      }
      changes.onChange = () => update()
    }

    return {
      link: link
    }
  }
])