Qualtrics.SurveyEngine.addOnload(function()
{
	// Retrieve Qualtrics object and save in qthis
	var qthis = this;

	// Hide buttons and question content
	qthis.hideNextButton();
	
	// Hide the question text and make the container full screen
	jQuery('.QuestionText, .QuestionBody').hide();
	jQuery('.QuestionOuter').css({
		'position': 'fixed',
		'top': '0',
		'left': '0',
		'width': '100%',
		'height': '100vh',
		'z-index': '9999',
		'background': 'black',
		'margin': '0',
		'padding': '0'
	});
	
	// Create display elements
	var displayDiv = document.createElement('div');
	displayDiv.id = 'display_stage';
	displayDiv.style.cssText = 'width: 100%; height: 100vh; padding: 80px 20px 20px 20px; position: relative; z-index: 1000; display: flex; flex-direction: column; justify-content: center; align-items: center;';
	displayDiv.innerHTML = '<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>';
	
	// Insert at the top of the question area
	jQuery('.QuestionOuter').prepend(displayDiv);
	
	// Define task_github globally for the IFAD task
	window.task_github = "https://carolcyu.github.io/IFAD_MRI/";
	
	// Load the experiment
	if (typeof jQuery !== 'undefined') {
		loadExperiment();
	}
	
	function loadExperiment() {
		// Update display
		jQuery('#display_stage').html('<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>');
		
		// Load CSS first with error handling
		jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/jspsych.css'>").appendTo('head');
		jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/my_experiment_style_MRI.css'>").appendTo('head');
		
		// Add inline CSS as backup for proper display
		jQuery("<style>").text(`
			#display_stage {
				background-color: black !important;
				height: 100vh !important;
				padding: 50px 20px 20px 20px !important;
				width: 100% !important;
				position: relative !important;
				z-index: 1000 !important;
				overflow: hidden;
				display: flex !important;
				flex-direction: column !important;
				justify-content: center !important;
				align-items: center !important;
				box-sizing: border-box !important;
			}
			.jspsych-content {
				background-color: black !important;
				width: 100% !important;
				height: 100vh !important;
				overflow: hidden;
				display: flex !important;
				flex-direction: column !important;
				justify-content: center !important;
				align-items: center !important;
				box-sizing: border-box !important;
			}
			.jspsych-display-element {
				background-color: black !important;
				width: 100% !important;
				height: 100vh !important;
				display: flex !important;
				flex-direction: column !important;
				justify-content: center !important;
				align-items: center !important;
			}
			.QuestionOuter {
				position: fixed !important;
				top: 0 !important;
				left: 0 !important;
				width: 100% !important;
				height: 100vh !important;
				z-index: 9999 !important;
				background: black !important;
				margin: 0 !important;
				padding: 0 !important;
			}
			body {
				overflow: hidden !important;
			}
		`).appendTo('head');
		
		// Scripts to load for the IFAD task
		var scripts = [
			window.task_github + "jspsych/jspsych.js",
			window.task_github + "jspsych/plugin-image-keyboard-response.js",
			window.task_github + "jspsych/plugin-html-button-response.js", 
			window.task_github + "jspsych/plugin-html-keyboard-response.js"
		];
		
		loadScripts(0);
		
		function loadScripts(index) {
			if (index >= scripts.length) {
				// All scripts loaded, start experiment
				setTimeout(initExp, 500);
				return;
			}
			
			jQuery.getScript(scripts[index])
				.done(function() {
					loadScripts(index + 1);
				})
				.fail(function() {
					jQuery('#display_stage').html('<p style="color: red;">Failed to load experiment scripts. Please refresh the page.</p>');
				});
		}
	}


function initExp(){
	try {
		// Check if jsPsych is available
		if (typeof initJsPsych === 'undefined') {
			jQuery('#display_stage').html('<p style="color: red;">Error: jsPsych library not loaded</p>');
			return;
		}
		
		// Ensure display stage is focused for keyboard input
		var displayStage = document.getElementById('display_stage');
		if (displayStage) {
			displayStage.focus();
			displayStage.setAttribute('tabindex', '0');
			displayStage.style.outline = 'none';
			
			displayStage.addEventListener('click', function() {
				this.focus();
			});
			
			setTimeout(function() {
				displayStage.focus();
			}, 100);
		}
		
		// Add focus management
		var focusInterval = setInterval(function() {
			var displayStage = document.getElementById('display_stage');
			if (displayStage) {
				displayStage.focus();
			}
		}, 1000);
		
		/* start the experiment*/
		var jsPsych = initJsPsych({
		/* Use the Qualtrics-mounted stage as the display element */
		display_element: 'display_stage',
		on_trial_start: function() {
			// Ensure focus on each trial
			var displayStage = document.getElementById('display_stage');
			if (displayStage) {
				displayStage.focus();
			}
		},
		on_finish: function() {
			// Clear the focus interval
			if (typeof focusInterval !== 'undefined') {
				clearInterval(focusInterval);
			}
			
			/* Saving task data to qualtrics */
			var ifad_data = jsPsych.data.get().json();
			Qualtrics.SurveyEngine.setEmbeddedData("IFAD", ifad_data);
			
			// clear the stage
			jQuery('#display_stage').remove();

			// simulate click on Qualtrics "next" button
			qthis.clickNextButton();
		}
	  }); 
	  
	  // <<< START IFAD EXPERIMENT TIMELINE >>>
	  var timeline = [];

	  var welcome = {
		type: jsPsychHtmlKeyboardResponse,
		stimulus: " <p>Welcome to the Modified Affect-Misattribution Task! </p> <p>Press any button for instructions. </p>",
	  };
	  timeline.push(welcome);

	  var instructions = {
		type: jsPsychHtmlKeyboardResponse,
		stimulus: "<p>In this task, an image will appear on the screen followed by a symbol.</p><p>Using the response pad, please rate <strong>HOW PLEASANT a SYMBOL is</strong>, as quickly as you can. </p><p>Try to focus on rating the symbol.</p>",
		post_trial_gap: 1000,
	  };
	  timeline.push(instructions);
	  
	  var instructions2 = {
		type: jsPsychHtmlKeyboardResponse,
		stimulus: "<p>If the symbol is...</p> <p><strong>Very unpleasant</strong>, press the button 1</p><p><strong>Unpleasant</strong>, press the button 2</p><p><strong>Pleasant</strong>, press the button 3</p> <p><strong>Very pleasant</strong>, press the button 4.</p><p> <img src='" + window.task_github + "img/response_key.png' alt='Key'></div></p>",
		post_trial_gap: 1000,
	  };
	  timeline.push(instructions2);

	  var questions = {
		type: jsPsychHtmlKeyboardResponse,
		stimulus: "<p>If you have questions or concerns, please signal to the examiner. </p> <p>If not, press any key to continue. </p>",
	  };
	  timeline.push(questions);

	  var MRIstart = {
		type: jsPsychHtmlKeyboardResponse,
		stimulus: "<p> Please wait while the scanner starts up. This will take 10 seconds. </strong></p>",
		choices: ['5'],
		prompt: "<p> A cross (+) will appear when the task starts. </p>",
		data: {
		  task: 'mri_start'
		}
	  };
	  timeline.push(MRIstart);
	  
	  var test_stimuli = [    
		{stimulus: window.task_github + 'iaps_neut/6150.jpg', symbol: window.task_github + 'sdvp/symbol33.jpg'},
		{stimulus: window.task_github + 'iaps_neut/7001.jpg', symbol: window.task_github + 'sdvp/symbol34.jpg'},
		{stimulus: window.task_github + 'iaps_neut/7002.jpg', symbol: window.task_github + 'sdvp/symbol35.jpg'},
		{stimulus: window.task_github + 'iaps_neut/7009.jpg', symbol: window.task_github + 'sdvp/symbol36.jpg'},
		{stimulus: window.task_github + 'iaps_neut/7026.jpg', symbol: window.task_github + 'sdvp/symbol37.jpg'},
		{stimulus: window.task_github + 'iaps_neut/7052.jpg', symbol: window.task_github + 'sdvp/symbol38.jpg'},
		{stimulus: window.task_github + 'iaps_neut/7055.jpg', symbol: window.task_github + 'sdvp/symbol39.jpg'},
		{stimulus: window.task_github + 'iaps_neut/7080.jpg', symbol: window.task_github + 'sdvp/symbol40.jpg'},
		{stimulus: window.task_github + 'iaps_neut/7100.jpg', symbol: window.task_github + 'sdvp/symbol41.jpg'},
		{stimulus: window.task_github + 'iaps_neut/7150.jpg', symbol: window.task_github + 'sdvp/symbol42.jpg'},
		{stimulus: window.task_github + 'iaps_neut/7705.jpg', symbol: window.task_github + 'sdvp/symbol43.jpg'},

		{stimulus: window.task_github + 'sdvp/3068.jpg', symbol: window.task_github + 'sdvp/symbol1.jpg'},
		{stimulus: window.task_github + 'sdvp/6570.jpg', symbol: window.task_github + 'sdvp/symbol2.jpg'},
		{stimulus: window.task_github + 'sdvp/SDVPS_1.jpg', symbol: window.task_github + 'sdvp/symbol3.jpg'},
		{stimulus: window.task_github + 'sdvp/SDVPS_2.jpg', symbol: window.task_github + 'sdvp/symbol4.jpg'},
		{stimulus: window.task_github + 'sdvp/SDVPS_3.jpg', symbol: window.task_github + 'sdvp/symbol5.jpg'},
		{stimulus: window.task_github + 'sdvp/SDVPS_4.jpg', symbol: window.task_github + 'sdvp/symbol6.jpg'},
		{stimulus: window.task_github + 'sdvp/SDVPS_5.jpg', symbol: window.task_github + 'sdvp/symbol7.jpg'},
		{stimulus: window.task_github + 'sdvp/SDVPS_6.jpg', symbol: window.task_github + 'sdvp/symbol8.jpg'},
		{stimulus: window.task_github + 'sdvp/SDVPS_7.jpg', symbol: window.task_github + 'sdvp/symbol21.jpg'},
		{stimulus: window.task_github + 'sdvp/SDVPS_8.jpg', symbol: window.task_github + 'sdvp/symbol22.jpg'},

		{stimulus: window.task_github + 'iaps_neg/1525.jpg', symbol: window.task_github + 'sdvp/symbol9.jpg'},
		{stimulus: window.task_github + 'iaps_neg/2345_1.jpg', symbol: window.task_github + 'sdvp/symbol10.jpg'},
		{stimulus: window.task_github + 'iaps_neg/3150.jpg', symbol: window.task_github + 'sdvp/symbol11.jpg'},
		{stimulus: window.task_github + 'iaps_neg/3170.jpg', symbol: window.task_github + 'sdvp/symbol12.jpg'},
		{stimulus: window.task_github + 'iaps_neg/7380.jpg', symbol: window.task_github + 'sdvp/symbol13.jpg'},
		{stimulus: window.task_github + 'iaps_neg/9140.jpg', symbol: window.task_github + 'sdvp/symbol14.jpg'},
		{stimulus: window.task_github + 'iaps_neg/9184.jpg', symbol: window.task_github + 'sdvp/symbol15.jpg'},
		{stimulus: window.task_github + 'iaps_neg/9301.jpg', symbol: window.task_github + 'sdvp/symbol16.jpg'},
		{stimulus: window.task_github + 'iaps_neg/9326.jpg', symbol: window.task_github + 'sdvp/symbol17.jpg'},
		{stimulus: window.task_github + 'iaps_neg/9611.jpg', symbol: window.task_github + 'sdvp/symbol18.jpg'},
		{stimulus: window.task_github + 'iaps_neg/9903.jpg', symbol: window.task_github + 'sdvp/symbol19.jpg'},

		{stimulus: window.task_github + 'iaps_pos/1463.jpg', symbol: window.task_github + 'sdvp/symbol20.jpg'},
		{stimulus: window.task_github + 'iaps_pos/1811.jpg', symbol: window.task_github + 'sdvp/symbol23.jpg'},
		{stimulus: window.task_github + 'iaps_pos/2071.jpg', symbol: window.task_github + 'sdvp/symbol24.jpg'},
		{stimulus: window.task_github + 'iaps_pos/2154.jpg', symbol: window.task_github + 'sdvp/symbol25.jpg'},
		{stimulus: window.task_github + 'iaps_pos/4610.jpg', symbol: window.task_github + 'sdvp/symbol26.jpg'},
		{stimulus: window.task_github + 'iaps_pos/5480.jpg', symbol: window.task_github + 'sdvp/symbol27.jpg'},
		{stimulus: window.task_github + 'iaps_pos/5829.jpg', symbol: window.task_github + 'sdvp/symbol28.jpg'},
		{stimulus: window.task_github + 'iaps_pos/7400.jpg', symbol: window.task_github + 'sdvp/symbol29.jpg'},
		{stimulus: window.task_github + 'iaps_pos/7492.jpg', symbol: window.task_github + 'sdvp/symbol30.jpg'},
		{stimulus: window.task_github + 'iaps_pos/8380.jpg', symbol: window.task_github + 'sdvp/symbol31.jpg'},
		{stimulus: window.task_github + 'iaps_pos/8503.jpg', symbol: window.task_github + 'sdvp/symbol32.jpg'}
	  ];
	  
	  var fixation = {
		type: jsPsychHtmlKeyboardResponse,
		stimulus: '<div style="font-size:60px;">+</div>',
		choices: "NO_KEYS",
		trial_duration: 1000,
		data: {
		  task: 'fixation'
		}
	  };

	  var test = {
		type: jsPsychImageKeyboardResponse,
		stimulus: jsPsych.timelineVariable('stimulus'),
		choices: "NO_KEYS",
		trial_duration: 75,
		post_trial_gap: 125,
		stimulus_height: 650,
		maintain_aspect_ration: true,
	  };

	  var symbol = {
		type: jsPsychImageKeyboardResponse,
		stimulus: jsPsych.timelineVariable('symbol'),
		choices: "NO_KEYS",
		trial_duration: 100,
	  };
	  
	  var response = {
		type: jsPsychHtmlKeyboardResponse,
		stimulus: "<p>How would you rate that symbol?</p>",
		choices: ['1', '2', '3','4'],
		trial_duration: 3000,
		response_ends_trial: false,
		data: {
		  task: 'response'
		}
	  };
	  
	  var test_procedure = {
		timeline: [fixation, test, symbol, response],
		timeline_variables: test_stimuli,
		repetitions: 1,
		randomize_order: false,
		post_trial_gap: 500,
	  };
	  timeline.push(test_procedure);
	
	  var debrief_block = {
		type: jsPsychHtmlKeyboardResponse,
		stimulus: function() {
		  var trials = jsPsych.data.get().filter({task: 'response'});
		  var rt = Math.round(trials.select('rt').mean());
		  return `<p>Your average response time was ${rt}ms.</p>
			<p>Press any key to complete the experiment. Thank you for your time!</p>`;
		}
	  };
	  timeline.push(debrief_block);
	  
	  // <<< END IFAD EXPERIMENT TIMELINE >>>

	  /* start the experiment */
	  jsPsych.run(timeline);
	
	} catch (error) {
		if (document.getElementById('display_stage')) {
			document.getElementById('display_stage').innerHTML = '<p style="color: red;">Error initializing experiment. Please refresh the page.</p>';
		}
	}
}

});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/
});
