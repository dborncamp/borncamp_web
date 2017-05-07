uniform mat4  u_model;
uniform mat4  u_view;
uniform mat4  u_projection;

//sampler that maps [0, n] -> color according to blackbody law
uniform sampler2D u_colormap;
//index to sample the colormap at
attribute float a_color_index;

//size of the star
attribute mediump float a_size;
//type
attribute float a_type;
attribute vec2  a_position;
//brightness of the star
attribute mediump float a_brightness;

varying mediump vec3 v_color;
void main (void){
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 0.0,1.0);

    //find base color according to physics from our sampler
    vec3 base_color;
    #ifdef VERTEX_TEXTURES
      base_color = texture2D(u_colormap, a_color_index).rgb;
    #else
      base_color = vec3(.5,.5,.5);
    #endif
    //scale it down according to brightness
    vec3 temp = base_color * a_brightness;

    if (a_size > 2.0) {
        gl_PointSize = a_size;
    } else {
        gl_PointSize = 0.0;
    }


    if (a_type == 2.0) {
        temp *= vec3(2, 1, 1);
    }
    else if (a_type == 3.0) {
        temp = vec3(.9);
    }
    v_color = temp;
}