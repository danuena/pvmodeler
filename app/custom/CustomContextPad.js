export default class CustomContextPad {
  constructor(bpmnFactory, config, contextPad, create, elementFactory, injector, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }


    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      autoPlace,
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function appendServiceTask(suitabilityScore) {
      return function(event, element) {
        if (autoPlace) {
          const businessObject = bpmnFactory.create('bpmn:Task');

          businessObject.PVNodeType = suitabilityScore;

          const shape = elementFactory.createShape({
            type: 'bpmn:Task',
            businessObject: businessObject
          });

          autoPlace.append(element, shape);
        } else {
          appendServiceTaskStart(event, element);
        }
      };
    }

    function appendServiceTaskStart(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task');

        businessObject.PVNodeType = suitabilityScore;

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        });

        create.start(event, shape, element);
      };
    }

    /* subprocess */

    function appendServiceSubprocess(suitabilityScore) {
      return function(event, element) {
        if (autoPlace) {
          const businessObject = bpmnFactory.create('bpmn:Subprocess');

          businessObject.PVNodeType = suitabilityScore;

          const shape = elementFactory.createShape({
            type: 'bpmn:Subprocess',
            businessObject: businessObject
          });

          autoPlace.append(element, shape);
        } else {
          appendServiceTaskSubprocess(event, element);
        }
      };
    }

    function appendServiceTaskSubprocess(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Subprocess');

        businessObject.PVNodeType = suitabilityScore;

        const shape = elementFactory.createShape({
          type: 'bpmn:Subprocess',
          businessObject: businessObject
        });

        create.start(event, shape, element);
      };
    }

    function customConnection(custom){
      return function(event, element, autoActivate) {
        // const shape = elementFactory.createShape({
        //   type: 'bpmn:Subprocess',
        //   businessObject: businessObject
        // });
        
        // const businessObject = bpmnFactory.create('bpmn:SequenceFlow');

        // businessObject.PVNodeType = "custom";

        // const shape = elementFactory.createShape({
        //   type: 'bpmn:SequenceFlow',
        //   businessObject: businessObject
        // });

        create.start(event, element, autoActivate);
      }
    }

    function startConnect(event, element, autoActivate) {
      create.start(event, element, autoActivate);
    }

    return {
      'append.varpoint': {
        group: 'model',
        className: 'icono-varpoint',
        title: translate('Append VarPoint'),
        action: {
          click: appendServiceTask("<<VarPoint>>"),
          dragstart: appendServiceTaskStart("<<VarPoint>>")
        }
      },
      'append.abstract': {
        group: 'model',
        className: 'icono-abstract',
        title: translate('Append Abstract'),
        action: {
          click: appendServiceTask("<<Abstract>>"),
          dragstart: appendServiceTaskStart("<<Abstract>>")
        }
      },
      'append.null': {
        group: 'model',
        className: 'icono-null',
        title: translate('Append Null'),
        action: {
          click: appendServiceTask("<<Null>>"),
          dragstart: appendServiceTaskStart("<<Null>>")
        }
      },
      'append.optional': {
        group: 'model',
        className: 'icono-optional',
        title: translate('Append Optional'),
        action: {
          click: appendServiceTask("<<Optional>>"),
          dragstart: appendServiceTaskStart("<<Optional>>")
        } ,
        'append.default': {
          group: 'model',
          className: 'icono-default',
          title: translate('Append Default'),
          action: {
            dragstart: appendServiceTaskSubprocess("<<Default>>"),
            click: appendServiceTaskSubprocess("<<Default>>")
          }
        },
        'append.variant': {
          group: 'model',
          className: 'icono-variant',
          title: translate('Append Variant'),
          action: {
            dragstart: appendServiceTaskSubprocess("<<Variant>>"),
            click: appendServiceTaskSubprocess("<<Variant>>")
          }
        }
      }
    };
  }
}

CustomContextPad.$inject = [
  'bpmnFactory',
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
];