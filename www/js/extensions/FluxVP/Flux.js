//Accessing Flux.io App through Flux API

var viewport, projects, selectedProject, projectCells, selectedOutputCell
var cellTranslateValue = {value: 0}
var cellScaleValue = {value: 1}
var cellRotateValue = {value: 0}

/**
 * Fetch the cells (keys) of the currently selected project from Flux.
 */
function fetchCells() {
  // get the project's cells (keys) from flux (returns a promise)
  getCells(selectedProject).then(function(data) {
    // assign the cells to the global variable 'projectCells'
    projectCells = data.entities;	
  })
}

/**
 * Fetch the user's projects from Flux.
 */
function fetchProjects() {
  // get the user's projects from flux (returns a promise)
	getProjects().then(function(data) {
		projects = data.entities;
			
		// Set the project to Flux app "Viewer" directly for this demo.
		//selectedProject = projects.filter(function(p) { return p.id === projects[2].id })[0];
		selectedProject = projects.filter(function(p) { return p.name === "Viewer" })[0];
		console.log ("Selected Flux project = " + selectedProject.name)
		var notificationHandler = function(msg) {			  
			//write all events to the app console
			//c.val(c.val() + msg.type + ': \'' + msg.body.label + '\'\n')
			if (msg.type === "CELL_MODIFIED") {
			  //only render when the modification involves the selected output
				if(selectedOutputCell && (selectedOutputCell.id === msg.body.id)) {
					getValue(selectedProject, selectedOutputCell).then(render)
				}
				getValue(selectedProject, projectCells[0]).then(function(data) { //WY - whenever there is a change in any cell value, update this cell value, which is Watched. 
																					//TODO: Need to change the code to update only the changed cell value...can we watch the "data" directly?
					cellRotateValue.value = data.value;
				});
				getValue(selectedProject, projectCells[1]).then(function(data) { //WY - whenever there is a change in any cell value, update this cell value, which is Watched. 
																					//TODO: Need to change the code to update only the changed cell value...can we watch the "data" directly?
					cellScaleValue.value = data.value;
				});	
				getValue(selectedProject, projectCells[2]).then(function(data) { //WY - whenever there is a change in any cell value, update this cell value, which is Watched. 
																					//TODO: Need to change the code to update only the changed cell value...can we watch the "data" directly?
					cellTranslateValue.value = data.value;
				});					
			}
		}		
		//listens and responds to changes on flux using our handler
		createWebSocket(selectedProject, notificationHandler)
		// now go fetch the project's cells (keys)
		fetchCells()	
	  })
}

/**
 * Start the application.
 */
function initFlux() {
	console.log ("initFlux.")
  // Check if we're coming back from Flux with the login credentials.
  helpers.storeFluxUser()
  // check that the user is logged in, otherwise show the login page
    .then(function() { return helpers.isLoggedIn() })
    .then(function(isLoggedIn) {
      if (isLoggedIn) {		  
		console.log ("Flux logged in!")
        // get the user's projects from Flux
        fetchProjects()
      } else {
        alert ("Not logged in to Flux.io app yet. Please return to https://co-design.herokuapp.com/ and login to Flux.io and Flux app first. Then reload this page.")
      }
    })
}

// When the window is done loading, start the application. Or when the Viewer model is done loading.
//window.onload = initFlux
