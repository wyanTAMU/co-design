
function FluxExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

FluxExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
FluxExtension.prototype.constructor = FluxExtension;

FluxExtension.prototype.load = function() {
	
	var viewer = this.viewer;
	var _lastElement = null;
			
	WatchJS.onChange(cellRotateValue,"value",function(change) {
			rotateIt();				
	}) 
	WatchJS.onChange(cellScaleValue,"value",function(change) {
			scaleIt();			
	}) 
	WatchJS.onChange(cellTranslateValue,"value",function(change) {
			translateIt();			
	}) 
	
	rotateIt = function() {
    	getValue(selectedProject, projectCells[0]).then(function(data) {
			var cellValue;
			if (data.value.constructor === Array){
				cellValue = data.value[0]; //data from Grasshopper is a list
			}else{
				cellValue = data.value;
			}
	
			var AXIS_Z    = new THREE.Vector3( 0, 0, 1 );			
			var fragProxy = viewer.impl.getFragmentProxy(
						  viewer.model,
						  0); //index 0 of the model fragment happens to be the roof of the building
			fragProxy.getAnimTransform();
			fragProxy.quaternion.setFromAxisAngle( AXIS_Z, THREE.Math.degToRad( cellValue ) );

			fragProxy.updateAnimTransform();
			viewer.impl.sceneUpdated(true);
		})
	}
  
	scaleIt = function() {
		
    	getValue(selectedProject, projectCells[1]).then(function(data) {
			var cellValue;
			if (data.value.constructor === Array){
				cellValue = data.value[0]; //data from Grasshopper is a list
			}else{
				cellValue = data.value;
			}
			var fragProxy = viewer.impl.getFragmentProxy(
						  viewer.model,
						  0);
			fragProxy.getAnimTransform();
			fragProxy.scale.set(cellValue, cellValue, 1);
			fragProxy.updateAnimTransform();
			viewer.impl.sceneUpdated(true);
		})
	}
	
	translateIt = function() {
		getValue(selectedProject, projectCells[2]).then(function(data) {
			var cellValue;
			if (data.value.constructor === Array){
				cellValue = data.value[0]; //data from Grasshopper is a list
			}else{
				cellValue = data.value;
			}	
			var fragProxy = viewer.impl.getFragmentProxy(
						  viewer.model,
						  0);
			fragProxy.getAnimTransform();
			fragProxy.position.z = parseInt(cellValue);
			fragProxy.updateAnimTransform();
			viewer.impl.sceneUpdated(true);			
		})
	}
  
	//This can be useful in future work
	viewer.addEventListener(
		Autodesk.Viewing.SELECTION_CHANGED_EVENT,
		function(event) {
			if ( event.dbIdArray.length > 0 ) {
				_lastElement = event.dbIdArray[0];
				console.log("ID of selected object = " + _lastElement);	
			}
		}
	);
	
	console.log ("Flux extension loaded!")
	return true;
};

FluxExtension.prototype.unload = function() {
  console.log('FluxExtension is now unloaded!');
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('FluxExtension', FluxExtension);