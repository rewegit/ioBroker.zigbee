'use strict';

const rgb = require(__dirname + '/rgb.js');

const toPercentage = (value, min, max) => {
    if (value > max) {
        value = max;
    } else if (value < min) {
        value = min;
    }

    const normalised = (value - min) / (max - min);
    return (normalised * 100).toFixed(2);
};

/* states for device:
   id - sysname of state, id
   name - display name of state
   prop - attr name of payload object with value of state
   icon - url of state icon
   role - state role
   write, read - allow to write and read state from admin
   type - type of value
   isEvent - sign of clearing the value after 300ms
   getter - result of call is the value of state. if value is undefined - state not apply
*/

var timers = {};

const states = {
    checking: {  // press button for checking
        id: 'checking',
        name: 'Start checking process',
        icon: undefined,
        role: 'button',
        write: true,
        read: false,
        type: 'boolean',
    },
    click: {
        id: 'click',
        name: 'Click event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.click === 'single') ? true : undefined,
    },
    double_click: {
        id: 'double_click',
        prop: 'click',
        name: 'Double click event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.click === 'double') ? true : undefined,
    },
    triple_click: {
        id: 'triple_click',
        prop: 'click',
        name: 'Triple click event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.click === 'triple') ? true : undefined,
    },
    quad_click: {
        id: 'quad_click',
        prop: 'click',
        name: 'Quadruple click event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.click === 'quadruple') ? true : undefined,
    },
    many_click: {
        id: 'many_click',
        prop: 'click',
        name: 'Many clicks event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.click === 'many') ? true : undefined,
    },
    long_click: {
        id: 'long_click',
        prop: 'click',
        name: 'Long click event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.click === 'long') ? true : undefined,
    },
    voltage: {
        id: 'voltage',
        name: 'Battery voltage',
        icon: 'img/battery_v.png',
        role: 'battery.voltage',
        write: false,
        read: true,
        type: 'number',
        unit: 'V',
        getter: (payload) => payload.voltage / 1000,
    },
    battery: {
        id: 'battery',
        prop: 'voltage',
        name: 'Battery percent',
        icon: 'img/battery_p.png',
        role: 'battery.percent',
        write: false,
        read: true,
        type: 'number',
        unit: '%',
        getter: (payload) => toPercentage(payload.voltage, 2700, 3200),
        min: 0,
        max: 100
    },
    left_click: {
        id: 'left_click',
        prop: 'click',
        name: 'Left click event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.click === 'left') ? true : undefined,
    },
    right_click: {
        id: 'right_click',
        prop: 'click',
        name: 'Right click event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.click === 'right') ? true : undefined,
    },
    both_click: {
        id: 'both_click',
        prop: 'click',
        name: 'Both click event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.click === 'both') ? true : undefined,
    },
    state: {
        id: 'state',
        name: 'Switch state',
        icon: undefined,
        role: 'switch',
        write: true,
        read: true,
        type: 'boolean',
        getter: (payload) => (payload.state === 'ON') ? true : false,
        setter: (value) => (value) ? 'ON' : 'OFF',
    },
    stateEp: {
        id: 'state',
        name: 'Switch state',
        icon: undefined,
        role: 'switch',
        write: true,
        read: true,
        type: 'boolean',
        getter: (payload) => (payload.state === 'ON') ? true : false,
        setter: (value) => (value) ? 'ON' : 'OFF',
        epname: '',
    },
    left_state: {
        id: 'left_state',
        prop: 'state_left',
        name: 'Left switch state',
        icon: undefined,
        role: 'switch',
        write: true,
        read: true,
        type: 'boolean',
        getter: (payload) => (payload.state_left === 'ON') ? true : false,
        setter: (value) => (value) ? 'ON' : 'OFF',
        setattr: 'state',
        epname: 'left',
    },
    right_state: {
        id: 'right_state',
        prop: 'state_right',
        name: 'Right switch state',
        icon: undefined,
        role: 'switch',
        write: true,
        read: true,
        type: 'boolean',
        getter: (payload) => (payload.state_right === 'ON') ? true : false,
        setter: (value) => (value) ? 'ON' : 'OFF',
        setattr: 'state',
        epname: 'right',
    },
    left_button: {
        id: 'left_button',
        prop: 'button_left',
        name: 'Left button pressed',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        getter: (payload) => (payload.button_left === 'hold') ? true : false
    },
    right_button: {
        id: 'right_button',
        prop: 'button_right',
        name: 'Right button pressed',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        getter: (payload) => (payload.button_right === 'hold') ? true : false,
    },
    temperature: {
        id: 'temperature',
        name: 'Temperature',
        icon: undefined,
        role: 'value.temperature',
        write: false,
        read: true,
        type: 'number',
        unit: '°C'
    },
    humidity: {
        id: 'humidity',
        name: 'Humidity',
        icon: undefined,
        role: 'value.humidity',
        write: false,
        read: true,
        type: 'number',
        unit: '%',
        min: 0,
        max: 100
    },
    pressure: {
        id: 'pressure',
        name: 'Pressure',
        icon: undefined,
        role: 'value.pressure',
        write: false,
        read: true,
        type: 'number',
        unit: 'hPa',
        min: 0,
        max: 100
    },
    illuminance: {
        id: 'illuminance',
        name: 'Illuminance',
        icon: undefined,
        role: 'value.lux',
        write: false,
        read: true,
        type: 'number',
        unit: 'lux'
    },
    occupancy: {
        id: 'occupancy',
        name: 'Occupancy',
        icon: undefined,
        role: 'indicator.motion',
        write: false,
        read: true,
        type: 'boolean'
    },
    no_motion: {
        id: 'no_motion',
        prop: 'occupancy',
        name: 'Time from last motion',
        icon: undefined,
        role: 'state',
        write: false,
        read: true,
        type: 'number',
        unit: 'seconds',
        prepublish: (devId, value, callback) => {
            if (value) {
                if (timers[devId]) {
                    clearInterval(timers[devId]);
                    delete timers[devId];
                }
                callback(0);
            } else {
                if (!timers[devId]) {
                    var counter = 60;
                    callback(counter);
                    timers[devId] = setInterval(function() {
                        counter = counter + 10;
                        callback(counter);
                        if (counter > 1800) {  // cancel after 1800 sec
                            clearInterval(timers[devId]);
                            delete timers[devId];
                        }
                    }, 10000); // update every 10 second
                }
            }
        }
    },
    contact: {
        id: 'contact',
        name: 'Contact event',
        icon: undefined,
        role: 'state',
        write: false,
        read: true,
        type: 'boolean'
    },
    isopen: {
        id: 'isopen',
        prop: 'contact',
        name: 'Is open',
        icon: undefined,
        role: 'state',
        write: false,
        read: true,
        type: 'boolean',
        getter: (payload) => (payload.contact) ? false : true,
    },
    water_detected: {
        id: 'detected',
        prop: 'water_leak',
        name: 'Water leak detected',
        icon: undefined,
        role: 'indicator.leakage',
        write: false,
        read: true,
        type: 'boolean'
    },
    gas_detected: {
        id: 'detected',
        prop: 'smoke',
        name: 'Gas leak detected',
        icon: undefined,
        role: 'indicator.alarm.fire',
        write: false,
        read: true,
        type: 'boolean'
    },
    shake: {
        id: 'shake',
        prop: 'action',
        name: 'Shake event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'shake') ? true : undefined,
    },
    wakeup: {
        id: 'wakeup',
        prop: 'action',
        name: 'Wakeup event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'wakeup') ? true : undefined,
    },
    fall: {
        id: 'fall',
        prop: 'action',
        name: 'Free fall event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'fall') ? true : undefined,
    },
    tap: {
        id: 'tap',
        prop: 'action',
        name: 'Tapped twice event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'tap') ? true : undefined,
    },
    tap_side: {
        id: 'tap_side',
        prop: 'side',
        name: 'Top side on tap',
        icon: undefined,
        role: 'state',
        write: false,
        read: true,
        type: 'number',
        getter: (payload) => (payload.action === 'tap') ? payload.side : undefined,
    },
    slide: {
        id: 'slide',
        prop: 'action',
        name: 'Slide event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'slide') ? true : undefined,
    },
    slide_side: {
        id: 'slide_side',
        prop: 'side',
        name: 'Top side on slide',
        icon: undefined,
        role: 'state',
        write: false,
        read: true,
        type: 'number',
        getter: (payload) => (payload.action === 'slide') ? payload.side : undefined,
    },
    flip180: {
        id: 'flip180',
        prop: 'action',
        name: 'Flip on 180°',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'flip180') ? true : undefined,
    },
    flip180_side: {
        id: 'flip180_side',
        prop: 'side',
        name: 'Top side on flip 180°',
        icon: undefined,
        role: 'state',
        write: false,
        read: true,
        type: 'number',
        getter: (payload) => (payload.action === 'flip180') ? payload.side : undefined,
    },
    flip90: {
        id: 'flip90',
        prop: 'action',
        name: 'Flip on 90° event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'flip90') ? true : undefined,
    },
    flip90_from: {
        id: 'flip90_from',
        prop: 'from_side',
        name: 'From top side on flip 90°',
        icon: undefined,
        role: 'state',
        write: false,
        read: true,
        type: 'number',
        getter: (payload) => (payload.action === 'flip90') ? payload.from_side : undefined,
    },
    flip90_to: {
        id: 'flip90_to',
        prop: 'to_side',
        name: 'To top side on flip 90°',
        icon: undefined,
        role: 'state',
        write: false,
        read: true,
        type: 'number',
        getter: (payload) => (payload.action === 'flip90') ? payload.to_side : undefined,
    },
    rotate_left: {
        id: 'rotate_left',
        prop: 'action',
        name: 'Rotate left event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'rotate_left') ? true : undefined,
    },
    rotate_right: {
        id: 'rotate_right',
        prop: 'action',
        name: 'Rotate right event',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'rotate_right') ? true : undefined,
    },
    rotate_angle: {
        id: 'rotate_angle',
        prop: 'angle',
        name: 'Rotate angle',
        icon: undefined,
        role: 'state',
        write: false,
        read: true,
        type: 'number',
    },
    load_power: {
        id: 'load_power',
        prop: 'power',
        name: 'Load power',
        icon: undefined,
        role: 'value.power',
        write: false,
        read: true,
        type: 'number',
        unit: 'W'
    },
    brightness: {
        id: 'brightness',
        name: 'Brightness',
        icon: undefined,
        role: 'level.dimmer',
        write: true,
        read: true,
        type: 'number',
        unit: '',
        min: 0,
        max: 254
    },
    colortemp: {
        id: 'colortemp',
        prop: 'color_temp',
        name: 'Color temperature',
        icon: undefined,
        role: 'level.temperature',
        write: true,
        read: true,
        type: 'number'
    },
    color: {
        id: 'color',
        prop: 'color',
        name: 'Color',
        icon: undefined,
        role: 'color',
        write: true,
        read: true,
        type: 'string',
        setter: (value) => {
            // convert RGB to XY for set
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
            let xy = [0, 0];
            if (result) {
                const r = parseInt(result[1], 16),
                      g = parseInt(result[2], 16),
                      b = parseInt(result[3], 16);
                      xy = rgb.rgb_to_cie(r, g, b);
            } 
            return {x: xy[0], y: xy[1]};
        },
    },
    // new RWL states 
    rwl_state: {          
        id: 'state',
        prop: 'action',
        name: 'Switch state',
        icon: undefined,
        role: 'switch',
        write: false,
        read: true,
        type: 'boolean',
        getter: (payload) => (payload.action === 'on') ? true : (payload.action === 'off') ? false : undefined,
    },
    rwl_up_button: {
        id: 'up_button',
        prop: 'action',
        name: 'Up button pressed',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'up-press') ? true : undefined
    },
    rwl_down_button: {
        id: 'down_button',
        prop: 'action',
        name: 'Down button pressed',
        icon: undefined,
        role: 'button',
        write: false,
        read: true,
        type: 'boolean',
        isEvent: true,
        getter: (payload) => (payload.action === 'down-press') ? true : undefined
    },
};

// return list of changing states when incoming state is changed
const comb = {
    brightnessAndState: (state, value) => {
        if (state.id == states.brightness.id) {
            if (value > 0) {
                // turn on light
                return [{
                    stateDesc: states.state,
                    value: true,
                    index: -1, // before main change
                }];
            } else {
                // turn off
                return [{
                    stateDesc: states.state,
                    value: false,
                    index: 1, // after main change
                }];
            } 
        }
    }
};


const devices = [
    {
        models: ['lumi.sensor_switch'],
        icon: 'img/xiaomi_wireless_switch.png',
        states: [states.click, states.double_click, states.triple_click, states.quad_click, 
            states.many_click, states.long_click, states.voltage, states.battery],
    },
    {
        models: ['lumi.sensor_switch.aq2'],
        icon: 'img/aqara.switch.png',
        states: [states.click, states.double_click, states.triple_click, states.quad_click,
            states.voltage, states.battery],
    },
    {
        models: ['lumi.sensor_switch.aq3', 'lumi.sensor_swit'],
        icon: 'img/aqara.switch.png',
        // TODO: shake, hold, release
        states: [states.click, states.double_click, states.voltage, states.battery],
    },
    {
        models: ['lumi.sensor_86sw1\u0000lu'],
        icon: 'img/86sw1.png',
        states: [states.click, states.voltage, states.battery],
    },
    {
        models: ['lumi.sensor_86sw2\u0000Un', 'lumi.sensor_86sw2.es1'],
        icon: 'img/86sw2.png',
        states: [states.left_click, states.right_click, states.both_click, states.voltage, states.battery],
    },
    {
        models: ['lumi.ctrl_ln1.aq1'],
        icon: 'img/ctrl_ln1.png',
        // TODO: power measurement
        states: [states.click, states.state],
    },
    {
        models: ['lumi.ctrl_ln2.aq1'],
        icon: 'img/ctrl_ln2.png',
        // TODO: power measurement
        states: [states.left_button, states.right_button, states.left_state, states.right_state],
    },
    {
        models: ['lumi.ctrl_neutral1'],
        icon: 'img/ctrl_neutral1.png',
        states: [states.stateEp],
    },
    {
        models: ['lumi.ctrl_neutral2'],
        icon: 'img/ctrl_neutral2.png',
        states: [states.left_button, states.right_button, states.left_state, states.right_state],
    },
    {
        models: ['lumi.sens'],
        icon: 'img/sensor_ht.png',
        states: [states.temperature, states.humidity, states.voltage, states.battery],
    },
    {
        models: ['lumi.weather'],
        icon: 'img/aqara_temperature_sensor.png',
        states: [states.temperature, states.humidity, states.pressure, states.voltage, states.battery],
    },
    {
        models: ['lumi.sensor_motion'],
        icon: 'img/aqara_numan_body_sensor.png',
        states: [states.occupancy, states.no_motion, states.voltage, states.battery],
    },
    {
        models: ['lumi.sensor_motion.aq2'],
        icon: 'img/aqara_numan_body_sensor.png',
        states: [states.occupancy, states.no_motion, states.illuminance, states.voltage, states.battery],
    },
    {
        models: ['lumi.sensor_magnet'],
        icon: 'img/magnet.png',
        states: [states.contact, states.isopen, states.voltage, states.battery],
    },
    {
        models: ['lumi.sensor_magnet.aq2'],
        icon: 'img/sensor_magnet_aq2.png',
        states: [states.contact, states.isopen, states.voltage, states.battery],
    },
    {
        models: ['lumi.sensor_wleak.aq1'],
        icon: 'img/sensor_wleak_aq1.png',
        states: [states.water_detected, states.voltage, states.battery],
    },
    {
        models: ['lumi.sensor_cube', 'sensor_cube.aqgl01'],
        icon: 'img/cube.png',
        states: [states.shake, states.wakeup, states.fall, states.tap, states.slide, states.flip180, 
            states.flip90, states.rotate_left, states.rotate_right, states.voltage, states.battery,
            states.flip90_to, states.flip90_from, states.flip180_side, states.slide_side, states.tap_side,
            states.rotate_angle,
        ],
    },
    {
        models: ['lumi.plug'],
        icon: 'img/plug.png',
        states: [states.state, states.load_power],
    },
    {
        models: ['lumi.ctrl_86plug.aq1', 'lumi.ctrl_86plug.aq1'],
        icon: 'img/86plug.png',
        states: [states.state, states.load_power],
    },
    {
        models: ['lumi.sensor_smoke'],
        icon: 'img/smoke.png',
        states: [states.gas_detected, states.voltage, states.battery],
    },

     
    // Osram
    {
        models: ['PAR16 50 TW'],
        icon: 'img/lightify-par16.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['Classic B40 TW - LIGHTIFY'],
        icon: 'img/lightify-b40tw.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['Plug 01'],
        icon: 'img/lightify-plug.png',
        states: [states.state],
    },
    {
        models: ['Classic A60 RGBW'],
        icon: 'img/osram_a60_rgbw.png',
        states: [states.state, states.brightness, states.colortemp, states.color],
    },
    
    {
        models: ['LIGHTIFY A19 Tunable White', 'Classic A60 TW'],
        icon: 'img/osram_lightify.png',
        states: [states.state, states.brightness, states.colortemp],
    },
   
    {
        models: ['Flex RGBW'],
        icon: 'img/philips_hue_lst002.png',
        states: [states.state, states.brightness, states.colortemp, states.color],
    },

    // Hue and Philips
    {
        models: ['LWB010'],
        icon: 'img/philips_hue_white.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['LLC020'],
        icon: 'img/hue_go.png',
        states: [states.state, states.brightness, states.colortemp, states.color],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['LST002'],
        icon: 'img/philips_hue_lst002.png',
        states: [states.state, states.brightness, states.colortemp, states.color],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['LWB006'],
        icon: 'img/philips_hue_white.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['LCT010', 'LCT015'],
        icon: 'img/philips_hue_ambiance.png',
        states: [states.state, states.brightness, states.colortemp, states.color],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['LCT003'],
        icon: 'img/philips_hue_gu10_color.png',
        states: [states.state, states.brightness, states.colortemp, states.color],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['LTW013'],
        icon: 'img/philips_hue_gu10_ambiance.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['LTW010'],
        icon: 'img/philips_hue_ambiance.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['RWL020', 'RWL021'],
        icon: 'img/philips_hue_rwl021.png',
        states: [states.rwl_state, states.rwl_up_button, states.rwl_down_button],
        
    },

    // IKEA
    {
        models: [
            'TRADFRI bulb E27 WS opal 980lm', 'TRADFRI bulb E26 WS opal 980lm',
        ],
        icon: 'img/TRADFRI.bulb.E27.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: [
            'TRADFRI bulb E27 WS clear 950lm', 'TRADFRI bulb E26 WS clear 950lm',
        ],
        icon: 'img/TRADFRI.bulb.E27.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: [
            'TRADFRI bulb E27 opal 1000lm', 'TRADFRI bulb E27 W opal 1000lm',
            'TRADFRI bulb E26 opal 1000lm'
        ],
        icon: 'img/TRADFRI.bulb.E27.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['TRADFRI bulb GU10 WS 400lm'],
        icon: 'img/ikea_gu10.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['TRADFRI bulb GU10 W 400lm'],
        icon: 'img/ikea_gu10.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['TRADFRI bulb E14 WS opal 400lm', 'TRADFRI bulb E12 WS opal 400lm'],
        icon: 'ikea_e14_bulb.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['TRADFRI bulb E27 CWS opal 600lm'],
        icon: 'img/TRADFRI.bulb.E27.png',
        states: [states.state, states.brightness, states.colortemp, states.color],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['TRADFRI bulb E14 W op/ch 400lm'],
        icon: 'img/ikea_e14_bulb2.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['TRADFRI wireless dimmer'],
        // TODO:
        icon: undefined,
        states: [],
    },
    {
        models: ['TRADFRI transformer 10W', 'TRADFRI transformer 30W'],
        icon: 'img/ikea_transformer.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['FLOALT panel WS', 'FLOALT panel WS 30x30', 'FLOALT panel WS 60x60'],
        icon: 'img/FLOALT.panel.WS.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['FLOALT panel WS 30x90'],
        icon: 'img/FLOALT.panel.WS.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['TRADFRI remote control'],
        icon: 'img/TRADFRI.remote.control.png',
        // TODO:
    },

    // Hive
    {
        models: ['FWBulb01'],
        icon: 'img/hive.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },

    // Innr
    {
        models: ['RB 185 C'],
        icon: 'img/innr.png',
        states: [states.state, states.brightness, states.colortemp, states.color],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: [
            'RB 165', 'RB 175 W', 'RS 125', 'RB 145', 'PL 110', 'ST 110', 'UC 110', 
            'DL 110 N', 'DL 110 W', 'SL 110 N', 'SL 110 M', 'SL 110 W'],
        icon: 'img/innr1.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },

    // Sylvania
    {
        models: ['LIGHTIFY RT Tunable White'],
        icon: 'img/sylvania_rt.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },
    {
        models: ['LIGHTIFY BR Tunable White'],
        icon: 'img/sylvania_br.png',
        states: [states.state, states.brightness, states.colortemp],
        linkedStates: [comb.brightnessAndState],
    },

    // GE
    {
        models: ['45852'],
        icon: 'img/ge_bulb.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },

    // Sengled
    {
        models: ['E11-G13'],
        icon: 'img/sengled.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },

    // JIAWEN
    {
        models: ['FB56-ZCW08KU1.1'],
        icon: 'img/jiawen.png',
        states: [states.state, states.brightness, states.colortemp, states.color],
        linkedStates: [comb.brightnessAndState],
    },
    
    // Belkin
    {
        models: ['MZ100'],
        icon: 'img/wemo.png',
        states: [states.state, states.brightness],
        linkedStates: [comb.brightnessAndState],
    },

    // EDP
    {
        models: ['ZB-SmartPlug-1.0.0'],
        icon: 'img/edp_redy_plug.png',
        // TODO: power measurement
        states: [states.state],
    },

    // Custom devices (DiY)
    {
        models: ['lumi.router'],
        icon: 'img/lumi_router.png',
        // TODO: description, type, rssi
        states: [states.state],
    },
    {
        models: ['DNCKAT_S001'],
        icon: undefined,
        // TODO: description, type, rssi
        states: [states.state],
    },
];

const commonStates = [
//    states.link_quality,
];

module.exports = {
    devices: devices,
    commonStates: commonStates,
    findModel: (model) => devices.find((d) => d.models.includes(model)),
};
