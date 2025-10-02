Qualtrics.SurveyEngine.addOnload(function()
{
	// ================================================================= //
	//                      SETUP AND INITIALIZATION                     //
	// ================================================================= //
	var qthis = this;
	qthis.hideNextButton();

	// Make the question container full screen
	jQuery('.QuestionText, .QuestionBody').hide();
	jQuery('.QuestionOuter').css({
		'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%',
		'height': '100vh', 'z-index': '9999', 'background': 'black',
		'margin': '0', 'padding': '0'
	});

	// Create the display stage for the experiment
	var displayDiv = document.createElement('div');
	displayDiv.id = 'display_stage';
	displayDiv.style.cssText = 'width: 100%; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;';
	jQuery('.QuestionOuter').prepend(displayDiv);

	// GitHub repository path
	window.task_github = "https://carolcyu.github.io/IFAD_MRI/";

	// Load necessary CSS and JavaScript files
	jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/jspsych.css'>").appendTo('head');
	jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/my_experiment_style_MRI.css'>").appendTo('head');

	var scripts = [
		window.task_github + "jspsych/jspsych.js",
		window.task_github + "jspsych/plugin-image-keyboard-response.js",
		window.task_github + "jspsych/plugin-html-button-response.js",
		window.task_github + "jspsych/plugin-html-keyboard-response.js"
	];

	var loaded_scripts = 0;
	function loadScript() {
		if (loaded_scripts < scripts.length) {
			jQuery.getScript(scripts[loaded_scripts], function() {
				loaded_scripts++;
				loadScript();
			});
		} else {
			initExp();
		}
	}
	loadScript(); // Start loading scripts

	// ================================================================= //
	//                          EXPERIMENT LOGIC                         //
	// ================================================================= //
	function initExp(){
		try {
			var jsPsych = initJsPsych({
				display_element: 'display_stage',
				on_finish: function() {
					// Clean up the keyboard listener when the experiment is done
					document.removeEventListener('keydown', window.qualtricsKeyboardListener);
					
					var ifad_data = jsPsych.data.get().json();
					Qualtrics.SurveyEngine.setEmbeddedData("IFAD", ifad_data);
					jQuery('#display_stage').remove();
					qthis.clickNextButton();
				}
			});

			// =====================================================================
			// ==   THIS IS THE GUARANTEED KEYBOARD FIX FROM qualtrics_STT.js   ==
			// =====================================================================
			setTimeout(function() {
				// Define the listener function so we can remove it later
				window.qualtricsKeyboardListener = function(event) {
					var keyPressed = event.key;

					// Directly interact with the jsPsych instance
					try {
						jsPsych.finishTrial({
							response: keyPressed
						});
					} catch (e) {
						// If finishTrial fails (e.g., trial doesn't expect a response),
						// this prevents errors and allows the experiment to continue.
						console.warn("Key press " + keyPressed + " received, but no action taken on current trial.");
					}
				};
				
				// Add the listener to the entire document
				document.addEventListener('keydown', window.qualtricsKeyboardListener);
			}, 1500); // Wait 1.5 seconds for the experiment to be fully initialized

			// --- IFAD TASK TIMELINE DEFINITION ---
			var timeline = [];
			var welcome = { type: jsPsychHtmlKeyboardResponse, stimulus: " <p>Welcome to the Modified Affect-Misattribution Task! </p> <p>Press any button for instructions. </p>" };
			timeline.push(welcome);

			var instructions = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p>In this task, an image will appear on the screen followed by a symbol.</p><p>Using the response pad, please rate <strong>HOW PLEASANT a SYMBOL is</strong>, as quickly as you can. </p><p>Try to focus on rating the symbol.</p>", post_trial_gap: 1000 };
			timeline.push(instructions);

			var instructions2 = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p>If the symbol is...</p> <p><strong>Very unpleasant</strong>, press the button 1</p><p><strong>Unpleasant</strong>, press the button 2</p><p><strong>Pleasant</strong>, press the button 3</p> <p><strong>Very pleasant</strong>, press the button 4.</p><p> <img src='" + window.task_github + "img/response_key.png' alt='Key'></div></p>", post_trial_gap: 1000 };
			timeline.push(instructions2);

			var questions = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p>If you have questions or concerns, please signal to the examiner. </p> <p>If not, press any key to continue. </p>" };
			timeline.push(questions);
			
			// This trial will now be advanced by the global listener when '5' is pressed
			var MRIstart = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p> Please wait while the scanner starts up. This will take 10 seconds. </strong></p>", choices: "NO_KEYS", trial_duration: 10000, prompt: "<p> A cross (+) will appear when the task starts. </p>" };
			timeline.push(MRIstart);

			var test_stimuli = [
				{stimulus: window.task_github + 'iaps_neut/6150.jpg', symbol: window.task_github + 'sdvp/symbol33.jpg'}, {stimulus: window.task_github + 'iaps_neut/7001.jpg', symbol: window.task_github + 'sdvp/symbol34.jpg'}, {stimulus: window.task_github + 'iaps_neut/7002.jpg', symbol: window.task_github + 'sdvp/symbol35.jpg'},
                {stimulus: window.task_github + 'iaps_neut/7009.jpg', symbol: window.task_github + 'sdvp/symbol36.jpg'}, {stimulus: window.task_github + 'iaps_neut/7026.jpg', symbol: window.task_github + 'sdvp/symbol37.jpg'}, {stimulus: window.task_github + 'iaps_neut/7052.jpg', symbol: window.task_github + 'sdvp/symbol38.jpg'},
                {stimulus: window.task_github + 'iaps_neut/7055.jpg', symbol: window.task_github + 'sdvp/symbol39.jpg'}, {stimulus: window.task_github + 'iaps_neut/7080.jpg', symbol: window.task_github + 'sdvp/symbol40.jpg'}, {stimulus: window.task_github + 'iaps_neut/7100.jpg', symbol: window.task_github + 'sdvp/symbol41.jpg'},
                {stimulus: window.task_github + 'iaps_neut/7150.jpg', symbol: window.task_github + 'sdvp/symbol42.jpg'}, {stimulus: window.task_github + 'iaps_neut/7705.jpg', symbol: window.task_github + 'sdvp/symbol43.jpg'}, {stimulus: window.task_github + 'sdvp/3068.jpg', symbol: window.task_github + 'sdvp/symbol1.jpg'},
                {stimulus: window.task_github + 'sdvp/6570.jpg', symbol: window.task_github + 'sdvp/symbol2.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_1.jpg', symbol: window.task_github + 'sdvp/symbol3.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_2.jpg', symbol: window.task_github + 'sdvp/symbol4.jpg'},
                {stimulus: window.task_github + 'sdvp/SDVPS_3.jpg', symbol: window.task_github + 'sdvp/symbol5.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_4.jpg', symbol: window.task_github + 'sdvp/symbol6.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_5.jpg', symbol: window.task_github + 'sdvp/symbol7.jpg'},
                {stimulus: window.task_github + 'sdvp/SDVPS_6.jpg', symbol: window.task_github + 'sdvp/symbol8.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_7.jpg', symbol: window.task_github + 'sdvp/symbol21.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_8.jpg', symbol: window.task_github + 'sdvp/symbol22.jpg'},
                {stimulus: window.task_github + 'iaps_neg/1525.jpg', symbol: window.task_github + 'sdvp/symbol9.jpg'}, {stimulus: window.task_github + 'iaps_neg/2345_1.jpg', symbol: window.task_github + 'sdvp/symbol10.jpg'}, {stimulus: window.task_github + 'iaps_neg/3150.jpg', symbol: window.task_github + 'sdvp/symbol11.jpg'},
                {stimulus: window.task_github + 'iaps_neg/3170.jpg', symbol: window.task_github + 'sdvp/symbol12.jpg'}, {stimulus: window.task_github + 'iaps_neg/7380.jpg', symbol: window.task_github + 'sdvp/symbol13.jpg'}, {stimulus: window.task_github + 'iaps_neg/9140.jpg', symbol: window.task_github + 'sdvp/symbol14.jpg'},
                {stimulus: window.task_github + 'iaps_neg/9184.jpg', symbol: window.task_github + 'sdvp/symbol15.jpg'}, {stimulus: window.task_github + 'iaps_neg/9301.jpg', symbol: window.task_github + 'sdvp/symbol16.jpg'}, {stimulus: window.task_github + 'iaps_neg/9326.jpg', symbol: window.task_github + 'sdvp/symbol17.jpg'},
                {stimulus: window.task_github + 'iaps_neg/9611.jpg', symbol: window.task_github + 'sdvp/symbol18.jpg'}, {stimulus: window.task_github + 'iaps_neg/9903.jpg', symbol: window.task_github + 'sdvp/symbol19.jpg'}, {stimulus: window.task_github + 'iaps_pos/1463.jpg', symbol: window.task_github + 'sdvp/symbol20.jpg'},
                {stimulus: window.task_github + 'iaps_pos/1811.jpg', symbol: window.task_github + 'sdvp/symbol23.jpg'}, {stimulus: window.task_github + 'iaps_pos/2071.jpg', symbol: window.task_github + 'sdvp/symbol24.jpg'}, {stimulus: window.task_github + 'iaps_pos/2154.jpg', symbol: window.task_github + 'sdvp/symbol25.jpg'},
                {stimulus: window.task_github + 'iaps_pos/4610.jpg', symbol: window.task_github + 'sdvp/symbol26.jpg'}, {stimulus: window.task_github + 'iaps_pos/5480.jpg', symbol: window.task_github + 'sdvp/symbol27.jpg'}, {stimulus: window.task_github + 'iaps_pos/5829.jpg', symbol: window.task_github + 'sdvp/symbol28.jpg'},
                {stimulus: window.task_github + 'iaps_pos/7400.jpg', symbol: window.task_github + 'sdvp/symbol29.jpg'}, {stimulus: window.task_github + 'iaps_pos/7492.jpg', symbol: window.task_github + 'sdvp/symbol30.jpg'}, {stimulus: window.task_github + 'iaps_pos/8380.jpg', symbol: window.task_github + 'sdvp/symbol31.jpg'},
                {stimulus: window.task_github + 'iaps_pos/8503.jpg', symbol: window.task_github + 'sdvp/symbol32.jpg'}
			];

			var fixation = { type: jsPsychHtmlKeyboardResponse, stimulus: '<div style="font-size:60px;">+</div>', choices: "NO_KEYS", trial_duration: 1000 };
			var test = { type: jsPsychImageKeyboardResponse, stimulus: jsPsych.timelineVariable('stimulus'), choices: "NO_KEYS", trial_duration: 75, post_trial_gap: 125, stimulus_height: 650 };
			var symbol = { type: jsPsychImageKeyboardResponse, stimulus: jsPsych.timelineVariable('symbol'), choices: "NO_KEYS", trial_duration: 100 };
			
			// This response trial is now handled by the global listener.
			// The listener will call finishTrial, recording the key press.
			var response = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p>How would you rate that symbol?</p>", choices: "NO_KEYS", trial_duration: 3000 };

			var test_procedure = { timeline: [fixation, test, symbol, response], timeline_variables: test_stimuli, repetitions: 1, randomize_order: false, post_trial_gap: 500 };
			timeline.push(test_procedure);

			var debrief_block = { type: jsPsychHtmlKeyboardResponse, stimulus: function() { var trials = jsPsych.data.get(); var rt = Math.round(trials.select('rt').mean()); return `<p>Your average response time was ${rt}ms.</p><p>Press any key to complete the experiment. Thank you for your time!</p>`; } };
			timeline.push(debrief_block);

			jsPsych.run(timeline);

		} catch (error) {
			console.error(error);
			jQuery('#display_stage').html('<p style="color: red;">A critical error occurred. Please contact the study administrator.</p>');
		}
	}
});

Qualtrics.SurveyEngine.addOnReady(function(){ /* Not used */ });
Qualtrics.SurveyEngine.addOnUnload(function(){ /* Not used */ });
