/// <reference path="../WebGL2.d.ts" />
// JavaScript source code

h = 'hi';
console.log(h);
var gl; // A global variable for the WebGL context
var galaxy;

function init() {


    galaxy = Galaxy;
    //galaxy.reset(13000, 4000, 0.0004, 0.90, 0.90, 0.5, 200, 300)

    // coldest and hottest temperatures of out galaxy
    var t0 = 200.0;
    var t1 = 10000.0;

    // total number of discrete colors between t0 and t1
    var n = 1000;
    var dt = (t1 - t0) / n;

    /*
    maps[0, n) -> colors
    generate a linear interpolation of temperatures
    then map the temperatures to colors using black body
    color predictions
    */
    var colors = [];
    for (var i = 0; i < n; i++) {
        var temperature = t0 + i * dt;
        var [x, y, z] = spectrum_to_xyz(bb_spectrum, temperature);
        var [r, g, b] = xyz_to_rgb(SMPTEsystem, x, y, z);

        var r = Math.min(...[Math.max(r, 0), 1]);
        var g = Math.min(...[Math.max(g, 0), 1]);
        var b = Math.min(...[Math.max(b, 0), 1]);
        colors.push(norm_rgb(r, g, b));
    }
}


function __create_galaxy_vertex_data() {
    data = np.zeros(len(galaxy),
        dtype = [('a_size', np.float32, 1),
        ('a_position', np.float32, 2),
        ('a_color_index', np.float32, 1),
        ('a_brightness', np.float32, 1),
        ('a_type', np.float32, 1)])
    var data = 

    // see shader for parameter explanations
    pw, ph = self.physical_size
    data['a_size'] = galaxy['size'] * max(pw / 800.0, ph / 800.0)
    data['a_position'] = galaxy['position'] / 13000.0

    data['a_color_index'] = (galaxy['temperature'] - t0) / (t1 - t0)
    data['a_brightness'] = galaxy['brightness']
    data['a_type'] = galaxy['type']

    return data
}