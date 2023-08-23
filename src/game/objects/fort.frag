#version 300 es
precision mediump float;

in vec3 vNormal, vFragPos;

uniform vec3 uColor, uLightPos, uCam;

out vec4 outColor;

void main() {
    // variables
    vec3 lightColor = vec3(1.);
    vec3 ambientStr = vec3(.1);
    vec3 diffStr = vec3(1.);
    vec3 spectacularStr = vec3(.5);
    float shininess = 8.;

    // ambient
    vec3 ambient = ambientStr * lightColor;

    // diffuse
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    float diff = max(dot(norm, lightDir), 0.);
    vec3 diffuse = lightColor * (diff * diffStr);

    // spectacular
    vec3 viewDir = normalize(uCam - vFragPos);

    // For blinn-phong
    //vec3 halfwayDir = normalize(lightDir + viewDir);
    //float spec = pow(max(dot(viewDir, halfwayDir), 0.), 16.);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.), shininess);

    vec3 spectacular = lightColor * (spec * spectacularStr);

    vec3 result = (ambient + diffuse + spectacular) * uColor;
    outColor = vec4(result, 1.);
}
