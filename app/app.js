import $ from 'jquery';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import diagramXML from '../resources/diagram.bpmn';
import cleanDiagram from '../resources/cleanDiagram.bpmn';

import customModule from './custom';

import processVariabilityExtension from '../resources/pv.json'

import resize from './resize';

const HIGH_PRIORITY = 1500;

const containerEl = document.getElementById('container'),
      qualityAssuranceEl = document.getElementById('quality-assurance'),
      suitabilityScoreEl = document.getElementById('suitability-score'),
      lastCheckedEl = document.getElementById('last-checked'),
      okayEl = document.getElementById('okay'),
      formEl = document.getElementById('form'),
      warningEl = document.getElementById('warning');

// hide quality assurance if user clicks outside
window.addEventListener('click', (event) => {
  
});

// create modeler
const bpmnModeler = new BpmnModeler({
  container: containerEl,
  additionalModules: [
    customModule,
    resize
  ],
  moddleExtensions: {
    pv: processVariabilityExtension
  },
  taskResizingEnabled: true,
  eventResizingEnabled: true
});

// import XML
bpmnModeler.importXML(diagramXML).then(() => {



  // validate suitability score
  function validate() {
    const { value } = suitabilityScoreEl;

    if (isNaN(value)) {
      warningEl.classList.remove('hidden');
      okayEl.disabled = true;
    } else {
      warningEl.classList.add('hidden');
      okayEl.disabled = false;
    }
  }
}).catch((err) => {
  console.error(err);
});

function getExtensionElement(element, type) {
  if (!element.extensionElements) {
    return;
  }

  return element.extensionElements.values.filter((extensionElement) => {
    return extensionElement.$instanceOf(type);
  })[0];
}

$(function() {

  async function openDiagram(xml) {

    try {
  
      await bpmnModeler.importXML(xml);
  
    } catch (err) {
  
      console.error(err);
    }
  }


  $('#file-input').on("change", function(e){

    e.stopPropagation();
    e.preventDefault();

    var files = e.target.files;

    var file = files[0];

    var reader = new FileReader();

    reader.onload = function(e) {

      var xml = e.target.result;

      openDiagram(xml);
    };
    reader.readAsText(file);
  });

  $("#js-import-diagram").click(function(e){
    e.stopPropagation();
    e.preventDefault();

    $('#file-input').trigger('click');

    //--------

    

    ///----------
    
  })

  function createNewDiagram() {
    bpmnModeler.clear();
    openDiagram(cleanDiagram);
  }
  var downloadLink = $('#js-download-diagram');
  var downloadSvgLink = $('#js-download-svg');

  $('.buttons a').click(function(e) {
    if (!$(this).is('.active')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  
  $('#js-create-diagram').click(function(e) {
    e.stopImmediatePropagation();
    e.preventDefault();

    openDiagram(cleanDiagram);
  });

  $("#js-new-diagram").click(function(e){
    e.stopImmediatePropagation();
    e.preventDefault();
    openDiagram(cleanDiagram);
  })
  function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);

    if (data) {
      link.addClass('active').attr({
        'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        'download': name
      });
    } 
  }

  var exportArtifacts = debounce(async function() {

    try {

      const { svg } = await bpmnModeler.saveSVG();

      setEncoded(downloadSvgLink, 'diagram.svg', svg);
    } catch (err) {

      console.error('Error happened saving svg: ', err);
      setEncoded(downloadSvgLink, 'diagram.svg', null);
    }

    try {

      const { xml } = await bpmnModeler.saveXML({ format: true });
      setEncoded(downloadLink, 'diagram.bpmn', xml);
    } catch (err) {

      console.error('Error happened saving XML: ', err);
      setEncoded(downloadLink, 'diagram.bpmn', null);
    }
  }, 500);

  bpmnModeler.on('commandStack.changed', exportArtifacts);
});



// helpers //////////////////////

function debounce(fn, timeout) {

  var timer;

  return function() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, timeout);
  };
}
