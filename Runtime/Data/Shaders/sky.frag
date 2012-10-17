varying vec3 vertex;
varying vec3 vertexMV;

uniform vec3 fog_color;

uniform samplerCube texSky;
uniform samplerCube texNight;
uniform bool enable_sun;
uniform vec3 sun_vector;

void main (void)
{
	vec4 sky_color = textureCube(texSky, vertex.xyz);
	vec4 night_color = textureCube(texNight, vertex.xyz);
	
	if(enable_sun)
	{
		vec3 vert = normalize(vertex);
		vec3 sun = normalize(sun_vector);
		
		float day_factor = max(-sun.y, 0.0);
		
		
		float dotv = max(dot(vert, -sun), 0.0);
		vec4 sun_color = clamp(gl_LightSource[0].diffuse*1.5, 0.0, 1.0);
	
		float pow_factor = day_factor * 175.0 + 25.0;
		float sun_factor = clamp(pow(dotv, pow_factor), 0.0, 1.0);
		

		if(day_factor > 0){
			gl_FragColor = (-sun.y * sky_color) + sun_color * sun_factor;
		}else{
			gl_FragColor =  (sun.y * night_color) + (sun_color * sun_factor);
		}
	}
	else
		gl_FragColor = sky_color;
		
	gl_FragColor.a = 0.0;
}













