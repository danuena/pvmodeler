import AP from '../adjustmentpoints'
import VSF from '../VerticalSincronizationFull'
import VSE from '../VerticalSincronizationEmpty'



export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function createTask(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.PVNodeType = suitabilityScore;

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    function createSubprocess(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:SubProcess');

        businessObject.PVNodeType = suitabilityScore;

        const shape = elementFactory.createShape({
          type: 'bpmn:SubProcess',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

  function startCreateAP(event) {
      return function(event) {
        const businessObject = bpmnFactory.create("bpmn:Gateway");
        businessObject.PVNodeType = "AP";

        const shape = elementFactory.createShape({
          type: 'bpmn:Gateway',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
  }

  function startCreateVSF(event) {
      return function(event) {
        const businessObject = bpmnFactory.create("bpmn:Gateway");
        businessObject.PVNodeType = "VSF";

        const shape = elementFactory.createShape({
          type: 'bpmn:Gateway',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
  }

    function startCreateVSE(event) {
      return function(event) {
        const businessObject = bpmnFactory.create("bpmn:Gateway");
        businessObject.PVNodeType = "VSE";

        const shape = elementFactory.createShape({
          type: 'bpmn:Gateway',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
  }
    

    return {
      'create.varpoint': {
        group: 'activity',
        className: 'icono-varpoint',
        title: translate('Create VarPoint'),
        action: {
          dragstart: createTask("<<VarPoint>>"),
          click: createTask("<<VarPoint>>")
        }
      },
      'create.abstract': {
        group: 'activity',
        className: 'icono-abstract',
        title: translate('Create abstract'),
        action: {
          dragstart: createTask("<<Abstract>>"),
          click: createTask("<<Abstract>>")
        }
      },
      'create.null': {
        group: 'activity',
        className: 'icono-null',
        title: translate('Create Null'),
        action: {
          dragstart: createTask("<<Null>>"),
          click: createTask("<<Null>>")
        }
      },
      'create.optional': {
        group: 'activity',
        className: 'icono-optional',
        title: translate('Create Optional'),
        action: {
          dragstart: createTask("<<Optional>>"),
          click: createTask("<<Optional>>")
        }
      }
      ,
      'create.default': {
        group: 'activity',
        className: 'icono-defplus',
        title: translate('Create Default'),
        action: {
          dragstart: createSubprocess("<<Default>>"),
          click: createSubprocess("<<Default>>")
        }
      },
      'create.variant': {
        group: 'activity',
        className: 'icono-varplus',
        title: translate('Create Variant'),
        action: {
          dragstart: createSubprocess("<<Variant>>"),
          click: createSubprocess("<<Variant>>")
        }
      },
    'create.vpplus': {
      group: 'activity',
      className: 'icono-vpplus',
      title: translate('Create Variation Point'),
      action: {
        dragstart: createSubprocess("<<VarPoint>>"),
        click: createSubprocess("<<VarPoint>>")
      }
    },
    'create.absplus': {
      group: 'activity',
      className: 'icono-absplus',
      title: translate('Create Abstract'),
      action: {
        dragstart: createSubprocess("<<Abstract>>"),
        click: createSubprocess("<<Abstract>>")
      }
    },
    'create.nullplus': {
      group: 'activity',
      className: 'icono-nullplus',
      title: translate('Create Variation Point'),
      action: {
        dragstart: createSubprocess("<<Null>>"),
        click: createSubprocess("<<Null>>")
      }
    },
    'create.optplus': {
      group: 'activity',
      className: 'icono-optplus',
      title: translate('Create Optional'),
      action: {
        dragstart: createSubprocess("<<Optional>>"),
        click: createSubprocess("<<Optional>>")
      }
    },
    'create.adjustmentpoints': {
      group: 'activity',
      title: 'Create Adjustment Points',
      imageUrl: AP.dataURL,
      action: {
        dragstart: startCreateAP("AP"),
        click: startCreateAP("AP")
      }
    },
    'create-verticalsincronizationfull': {
      group: 'activity',
      title: 'Create Vertical Sincronization',
      imageUrl: VSF.dataURL,
      action: {
        dragstart: startCreateVSF("VSF"),
        click: startCreateVSF("VSF")
      }
    },
    'create-verticalsincronizationEmpty': {
      group: 'activity',
      title: 'Create Vertical Sincronization',
      imageUrl: VSE.dataURL,
      action: {
        dragstart: startCreateVSE("VSE"),
        click: startCreateVSE("VSE")
      }
    },
    };
  }
}

CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];