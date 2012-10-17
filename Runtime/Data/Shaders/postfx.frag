uniform sampler2D	texScreen, texBloom, texRain, texWaterNoiseNM;

uniform bool		enable_underwater, enable_rain;

uniform float		screenWidth;
uniform float		screnHeight;
uniform float		noise_tile;
uniform float		noise_factor, time;

uniform float		bloom_factor;

uniform bool		enable_bloom;

uniform vec3		wind_vec;
uniform float		rain_tile;
uniform vec3		rain_offset;

#define MAX_DEPTH	2

vec4 Bloom(vec4 color)
{
	return color + bloom_factor * texture2D(texBloom, gl_TexCoord[0].st);
}

// BILLBOARD RAIN CODE HERE BEGIN====================================================
vec4 Rain(vec4 color, float depth)
{
	vec4 colorOut;
	
	vec2 Texcoord = gl_TexCoord[0].st * ((rain_tile + 1) * (1.5*depth));
	Texcoord.s += (rain_offset.s + (depth*0.1)) * (((MAX_DEPTH + 1) - depth) / MAX_DEPTH*2);
	Texcoord.t += (rain_offset.t) * (((MAX_DEPTH + 1) - depth) / MAX_DEPTH*2);

	colorOut = color + texture2D( texRain,  gl_TexCoord[0].st + Texcoord.st );

	float fade = 1.0 - smoothstep(0.0, (depth / MAX_DEPTH) * 0.5, length(gl_TexCoord[0].t));

	if( depth != 1 )
		if( gl_TexCoord[0].t < fade )
			return color;

	return colorOut;
}
// BILLBOARD RAIN CODE HERE END======================================================

vec4 LevelOfGrey(vec4 colorIn)
{
	vec4 temp;
	temp.r *= 0.299;
	temp.g *= 0.587;
	temp.b *= 0.114;

	return temp;
}

vec4 UnderWater()
{
	vec4 colorOut;
	
	
	vec2 uvNormal0 = gl_TexCoord[0].st*noise_tile;
	uvNormal0.s += time*0.01;
	uvNormal0.t += time*0.01;
	vec2 uvNormal1 = gl_TexCoord[0].st*noise_tile;
	uvNormal1.s -= time*0.01;
	uvNormal1.t += time*0.01;
		
	vec3 normal0 = texture2D(texWaterNoiseNM, uvNormal0).rgb * 2.0 - 1.0;
	
	colorOut = texture2D(texScreen, gl_TexCoord[0].st + noise_factor*normal0.st);
	
	colorOut = clamp(colorOut, vec4(0.0, 0.0, 0.0, 0.0),  vec4(1.0, 1.0, 1.0, 1.0));
	
	return colorOut;
}

void main(void)
{
	
	
	if(enable_underwater)
	{
		gl_FragColor = UnderWater();
	}
	else
	{
		gl_FragColor = texture2D(texScreen, gl_TexCoord[0].st);
	}
	
	if(enable_bloom)
		gl_FragColor = Bloom(gl_FragColor);

	// Enable Rain!
	if(enable_rain)
	{
		for(int x = 1; x < MAX_DEPTH; x++)
			gl_FragColor = Rain(gl_FragColor, x);
	}
		
}
