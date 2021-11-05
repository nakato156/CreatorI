/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
 interface Opt_shortcut{
	'type': string,
	'propagate': boolean,
	'disable_in_input': boolean,
	'target': any,
	'keycode': boolean
}

interface Special_Keys{
	'esc':number,
	'escape':number,
	'tab':number,
	'space':number,
	'return':number,
	'enter':number,
	'backspace':number,

	'scrolllock':number,
	'scroll_lock':number,
	'scroll':number,
	'capslock':number,
	'caps_lock':number,
	'caps':number,
	'numlock':number,
	'num_lock':number,
	'num':number,
				
	'pause':number,
	'break':number,
				
	'insert':number,
	'home':number,
	'delete':number,
	'end':number,
				
	'pageup':number,
	'page_up':number,
	'pu':number,

	'pagedown':number,
	'page_down':number,
	'pd':number,

	'left':number,
	'up':number,
	'right':number,
	'down':number,

	'f1':number,
	'f2':number,
	'f3':number,
	'f4':number,
	'f5':number,
	'f6':number,
	'f7':number,
	'f8':number,
	'f9':number,
	'f10':number,
	'f11':number,
	'f12':number
}

let ShortCuts = class ShortCuts {
	opt:Opt_shortcut;
	all_shortcuts:object;
	default_options: Opt_shortcut;

	constructor (opt: object){
		this.opt = opt as Opt_shortcut
		this.all_shortcuts = {}
		this.default_options = {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target': document,
			'keycode':false
		}
	}

	add = function(shortcut_combination: string, callback:Function ,opt:Opt_shortcut =this.opt) {
		let code:number;
		//Provide a set of default options
		if(!opt) opt = this.default_options;
		else {
			for(var dfo in this.default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = this.default_options[dfo];
			}
		}

		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e:any):boolean {
			e = e || window.event;
			if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return false;
			}

			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();
			
			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown

			let keys:Array<string> = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			let kp = 0;
			
			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			let shift_nums:object = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			}
			//Special Keys - and their codes
			let special_keys:Special_Keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,

				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,
				
				'pause':19,
				'break':19,
				
				'insert':45,
				'home':36,
				'delete':46,
				'end':35,
				
				'pageup':33,
				'page_up':33,
				'pu':33,

				'pagedown':34,
				'page_down':34,
				'pd':34,

				'left':37,
				'up':38,
				'right':39,
				'down':40,

				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			}

			let modifiers = { 
				shift: { wanted:false, pressed:false},
				ctrl : { wanted:false, pressed:false},
				alt  : { wanted:false, pressed:false},
				meta : { wanted:false, pressed:false}	//Meta is Mac specific
			};
						
			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;
						
			for(let i:number=0; keys[i],i<keys.length; i++) {
				//Modifiers
				if(keys[i] == 'ctrl' || keys[i] == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(keys[i] == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(keys[i] == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(keys[i] == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(keys[i].length > 1) { //If it is a special key
					if(special_keys[keys[i]] == code) kp++;
					
				} else if(opt['keycode']) {
					if(opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if(character == keys[i]) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character]; 
							if(character == keys[i]) kp++;
						}
					}
				}
			}
			
			if(kp == keys.length && 
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);

				if(!opt['propagate']) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;

					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
			return true
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback':func, 
			'target':ele, 
			'event': opt['type']
		};
		//Attach the function with the event
		
		if(ele.addEventListener) ele.addEventListener(opt['type'], func);
		else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
		else ele['on'+opt['type']] = func;
	}
	//Remove the shortcut - just specify the shortcut and I will remove the binding
	remove = function(shortcut_combination:string) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination])
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
}
export {ShortCuts}