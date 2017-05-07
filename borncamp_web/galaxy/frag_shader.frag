//star texture
uniform sampler2D u_texture;
//predicted color from black body
varying mediump vec3 v_color;

void main(){
    //amount of intensity from the grayscale star
    mediump float star_tex_intensity = texture2D(u_texture, gl_PointCoord).r;
    gl_FragColor = vec4(v_color * star_tex_intensity, 0.8);
}