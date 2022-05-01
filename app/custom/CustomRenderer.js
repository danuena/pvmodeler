import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import AdjustmentPoint from '../AdjustmentPoints'
import VerticalSincronizationFull from '../VerticalSincronizationFull'
import VerticalSincronizationEmpty from '../VerticalSincronizationEmpty'
import ArrowUp from '../ArrowUp'
import ArrowDown from '../ArrowDown'
import ArrowLeft from '../ArrowLeft'
import ArrowRight from '../ArrowRight'

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate
} from 'tiny-svg';

import {
  getRoundRectPath,
} from 'bpmn-js/lib/draw/BpmnRenderUtil';


import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import {
  componentsToPath,
  createLine
} from 'diagram-js/lib/util/RenderUtil';


import { isNil } from 'min-dash';

const HIGH_PRIORITY = 1500,
      TASK_BORDER_RADIUS = 2;


export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {
    // ignore labels
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    const suitabilityScore = this.getText(element);

    if (!isNil(suitabilityScore)) {
      const elementText = this.getText(element);

      if(elementText == "AP"){
          var url = AdjustmentPoint.dataURL;

          var apGfx = svgCreate('image', {
            x: 0,
            y: 0,
            width: 50,
            height: 50,
            href: url
          });

          svgAppend(parentNode, apGfx);
      }
      else if(elementText == 'VSF'){
        var url = VerticalSincronizationFull.dataURL;
          parentNode.innerHTML = "";
          var apGfx = svgCreate('image', {
            x: 0,
            y: 0,
            width: 50,
            height: 50,
            href: url
          });

          svgAppend(parentNode, apGfx);
      }else if(elementText == 'VSE'){
        var url = VerticalSincronizationEmpty.dataURL;
          parentNode.innerHTML = "";
          var apGfx = svgCreate('image', {
            x: 0,
            y: 0,
            width: 50,
            height: 50,
            href: url
          });

          svgAppend(parentNode, apGfx);
      }
      else{
        var text = svgCreate('text');

        svgAttr(text, {
          fill: '#000',
          transform: 'translate(23, 15)',
          fontSize: '0.65em',
          fontStyle: 'italic',
          fontFamily: 'Arial, Helvetica, sans-serif'
        });
        svgAppend(text, document.createTextNode(elementText));
        svgAppend(parentNode, text);
      }
    }

    return shape;
  }

  getShapePath(shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }

  getText(element) {
    const businessObject = getBusinessObject(element);

    const { PVNodeType } = businessObject;

    return PVNodeType;
  }

  

  drawCustomConnection = function(po, element) {

      var ultimoX = element.waypoints[element.waypoints.length - 1].x;
      var ultimoY = element.waypoints[element.waypoints.length - 1 ].y;

      var penuultimoX = element.waypoints[element.waypoints.length - 2].x;
      var penuultimoY = element.waypoints[element.waypoints.length - 2].y;

      var urlImg = "";

      var x = ultimoX;
      var y = ultimoY;

      if(ultimoX == penuultimoX) //vertical
      {
          if(ultimoY > penuultimoY){
              urlImg = ArrowDown.dataURL
              x -= 6;
              y -= 13;
          }
          else{
            urlImg = ArrowUp.dataURL;
            y -=0 ;
            x -= 6;
          }
      }
      else if(ultimoY == penuultimoY) //horizontal
      {
          if(ultimoX > penuultimoX){
            urlImg = ArrowRight.dataURL;
            y -= 6;
            x -=13;
          }
          else{
            urlImg = ArrowLeft.dataURL;
            y -= 6;
          }
      }

      svgAppend(po, createLine(element.waypoints, {
        color: "#000",
        strokeWidth: 2,
        strokeDasharray: 5,
        stroke: "#000",
        fill: '#FFF',
      }));

      
      var apGfx = svgCreate('image', {
        x: x,
        y: y,
        z: 99999999,
        width: 12,
        height: 12,
        href: urlImg,
      });

      return svgAppend(po, apGfx);

  };

  getCustomConnectionPath = function(connection) {
    var waypoints = connection.waypoints.map(function(p) {
      return p.original || p;
    });

    var connectionPath = [
      ['M', waypoints[0].x, waypoints[0].y],
    ];

    waypoints.forEach(function(waypoint, index) {
      if (index !== 0) {
        connectionPath.push(['L', waypoint.x, waypoint.y]);
      }
    });

    return componentsToPath(connectionPath);
  };

  drawConnection = function(p, element) {

    var type = element.PVNodeType;

    if(!type && element.businessObject !== undefined){
      type = element.businessObject.PVNodeType;
    }
  
    if (type === 'custom') {
      element.businessObject.PVNodeType = "custom";
      return this.drawCustomConnection(p, element);
    }
  };
}




CustomRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];

