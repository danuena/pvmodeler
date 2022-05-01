import inherits from 'inherits';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import AdjustmentPoint from '../adjustmentpoints';

import {
  append as svgAppend,
  create as svgCreate
} from 'tiny-svg';


export default function AdjustmentPointRender(eventBus) {
  BaseRenderer.call(this, eventBus, 1500);

  this.canRender = function(element) {
    return is(element, 'bpmn:ServiceTask');
  };


  this.drawShape = function(parent, shape) {
    var url = AdjustmentPoint.dataURL;

    var apGfx = svgCreate('image', {
      x: 0,
      y: 0,
      width: shape.width,
      height: shape.height,
      href: url
    });

    svgAppend(parent, apGfx);

    return apGfx;
  };
}

inherits(APRender, BaseRenderer);

APRender.$inject = [ 'eventBus' ];