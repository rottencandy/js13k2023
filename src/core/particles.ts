import { makeShader, GL, bindVAO, bindBuffer, AttribPointers, setVAOPtr, shader, buffer, VAO, setBufferData, clear, texture, setTexData, setTextureFilter, setTextureWrap, useProgram, draw, unbindVAO, unbindBuffer, bindTexture } from "./webgl2-stateless";

type State = {
    bufs: WebGLBuffer[],
    vaos: WebGLVertexArrayObject[],
    read: number,
    write: number,
    updatePrg: WebGLProgram,
    renderPrg: WebGLProgram,
    num_particles: number,
    old_timestamp: number,
    rg_noise: WebGLTexture,
    total_time: number,
    born_particles: number,
    birth_rate: number,
    gravity: [number, number],
    origin: [number, number],
    min_theta: number,
    max_theta: number,
    min_speed: number,
    max_speed: number,

    num_part: number,
};

const vertUpdate = makeShader`
uniform float uDT;
uniform sampler2D uRgNoise;
uniform vec2 uGravity;
uniform vec2 uOrigin;
uniform float uMinTheta;
uniform float uMaxTheta;
uniform float uMinSpeed;
uniform float uMaxSpeed;

layout(location=0)in vec2 iPos;
layout(location=1)in float iAge;
layout(location=2)in float iLife;
layout(location=3)in vec2 iVelocity;

out vec2 vPos;
out float vAge;
out float vLife;
out vec2 vVelocity;

void main() {
  if (iAge >= iLife) {
    ivec2 noise_coord = ivec2(gl_VertexID % 512, gl_VertexID / 512);
    vec2 rand = texelFetch(uRgNoise, noise_coord, 0).rg;
    float theta = uMinTheta + rand.r*(uMaxTheta - uMinTheta);
    float x = cos(theta);
    float y = sin(theta);
    vPos = uOrigin;
    vAge = 0.0;
    vLife = iLife;
    vVelocity =
      vec2(x, y) * (uMinSpeed + rand.g * (uMaxSpeed - uMinSpeed));
  } else {
    vPos = iPos + iVelocity * uDT;
    vAge = iAge + uDT;
    vLife = iLife;
    vVelocity = iVelocity + uGravity * uDT;
  }
}`;

const fragUpdate = makeShader`
in float vAge;
in float iAge;
in float iLife;
in vec2 iVelocity;

void main() {
    discard;
}`;

const vertRender = makeShader`
in vec2 iPos;
in float iAge;
in float iLife;

out float vAge;
out float vLife;

void main() {
    gl_PointSize = 1. + 6. * (1. - iAge / iLife);
    gl_Position = vec4(iPos, 0., 1.);
    vAge = iAge;
    vLife = iLife;
}`;

const fragRender = makeShader`
out vec4 oFragColor;
in float vAge;
in float vLife;

void main() {
    float t = vAge / vLife;
    oFragColor = vec4(t / 2., .5, .5, 1. - t);
}`;

const randomRGData = (size_x: number, size_y: number) => {
    const d: number[] = [];
    for (let i = 0; i < size_x * size_y; ++i) {
        d.push(Math.random() * 255.0);
        d.push(Math.random() * 255.0);
    }
    return new Uint8Array(d);
};

const initialParticleData = (num_parts: number, min_age: number, max_age: number) => {
    const data: number[] = [];
    for (let i = 0; i < num_parts; ++i) {
        // position
        data.push(0.0);
        data.push(0.0);
        const life = min_age + Math.random() * (max_age - min_age);
        data.push(life + 1);
        data.push(life);

        // velocity
        data.push(0.0);
        data.push(0.0);
    }
    return data;
};

const setupParticleBufferVAO = (gl: GL, buffers: { buf: WebGLBuffer, attrs: AttribPointers[] }[], vao: WebGLVertexArrayObject) => {
    bindVAO(gl, vao);
    for (let i = 0; i < buffers.length; i++) {
        const buf = buffers[i].buf;
        const attrs = buffers[i].attrs;
        bindBuffer(gl, buf);
        let offset = 0;
        for (let i = 0; i < attrs.length; i++) {
            const atr = attrs[i];
            setVAOPtr(gl, vao, atr[0], atr[1], atr[2], offset);
            offset += atr[1] * 4;
            // todo set divisor here
        }
    }
    unbindVAO(gl);
    unbindBuffer(gl);
};

// todo value sanity checks
export const init = (
    gl: GL,
    num_particles: number,
    particle_birth_rate: number,
    min_age: number,
    max_age: number,
    min_theta: number,
    max_theta: number,
    min_speed: number,
    max_speed: number,
    gravity: [number, number]): State => {
    const [updatePrg] = shader(gl, vertUpdate, fragUpdate, ['vPos', 'vAge', 'vLife', 'vVelocity'])
    const [renderPrg] = shader(gl, vertRender, fragRender);
    const update_attrib_locations: AttribPointers[] = [
        // iPos
        [
            0,
            2,
            4 * 6,
        ],
        // iAge
        [
            1,
            1,
            4 * 6,
        ],
        // iLife
        [
            2,
            1,
            4 * 6,
        ],
        // iVelocity
        [
            3,
            2,
            4 * 6,
        ]
    ];
    const render_attrib_locations: AttribPointers[] = update_attrib_locations;
    const vaos = [
        VAO(gl),
        VAO(gl),
        VAO(gl),
        VAO(gl),
    ];
    const buffers = [
        buffer(gl),
        buffer(gl),
    ];
    const vao_desc = [
        {
            vao: vaos[0],
            buffers: [{
                buf: buffers[0],
                attrs: update_attrib_locations
            }]
        },
        {
            vao: vaos[1],
            buffers: [{
                buf: buffers[1],
                attrs: update_attrib_locations
            }]
        },
        {
            vao: vaos[2],
            buffers: [{
                buf: buffers[0],
                attrs: render_attrib_locations
            }],
        },
        {
            vao: vaos[3],
            buffers: [{
                buf: buffers[1],
                attrs: render_attrib_locations
            }],
        },
    ];
    const initial_data =
        new Float32Array(initialParticleData(num_particles, min_age, max_age));
    setBufferData(gl, buffers[0], initial_data, gl.ARRAY_BUFFER, gl.STREAM_DRAW);
    setBufferData(gl, buffers[1], initial_data, gl.ARRAY_BUFFER, gl.STREAM_DRAW);
    for (let i = 0; i < vao_desc.length; i++) {
        setupParticleBufferVAO(gl, vao_desc[i].buffers, vao_desc[i].vao);
    }

    const rg_noise_texture = texture(gl);
    setTexData(gl, rg_noise_texture, randomRGData(512, 512), gl.TEXTURE_2D, 0, gl.RG8, 512, 512, 0, gl.RG);
    setTextureWrap(gl, gl.TEXTURE_2D, gl.MIRRORED_REPEAT);
    setTextureFilter(gl);
    return {
        bufs: buffers,
        vaos: vaos,
        read: 0,
        write: 1,
        updatePrg: updatePrg,
        renderPrg: renderPrg,
        num_particles: initial_data.length / 6,
        old_timestamp: 0.0,
        rg_noise: rg_noise_texture,
        total_time: 0.0,
        born_particles: 0,
        birth_rate: particle_birth_rate,
        gravity: gravity,
        origin: [0.0, 0.0],
        min_theta: min_theta,
        max_theta: max_theta,
        min_speed: min_speed,
        max_speed: max_speed,

        num_part: 0,
    };
};

export const update = (gl: GL, state: State, dt: number) => {
    state.num_part = state.born_particles;
    if (state.born_particles < state.num_particles) {
        state.born_particles = Math.min(state.num_particles,
            Math.floor(state.born_particles + state.birth_rate * dt * 1000));
    }
    useProgram(gl, state.updatePrg);
    gl.uniform1f(
        gl.getUniformLocation(state.updatePrg, "uDT"),
        dt);
    gl.uniform1f(
        gl.getUniformLocation(state.updatePrg, "uTotalTime"),
        state.total_time);
    gl.uniform2f(
        gl.getUniformLocation(state.updatePrg, "uGravity"),
        state.gravity[0], state.gravity[1]);
    gl.uniform2f(
        gl.getUniformLocation(state.updatePrg, "uOrigin"),
        state.origin[0],
        state.origin[1]);
    gl.uniform1f(
        gl.getUniformLocation(state.updatePrg, "uMinTheta"),
        state.min_theta);
    gl.uniform1f(
        gl.getUniformLocation(state.updatePrg, "uMaxTheta"),
        state.max_theta);
    gl.uniform1f(
        gl.getUniformLocation(state.updatePrg, "uMinSpeed"),
        state.min_speed);
    gl.uniform1f(
        gl.getUniformLocation(state.updatePrg, "uMaxSpeed"),
        state.max_speed);
    state.total_time += dt;
    bindTexture(gl, state.rg_noise);
    gl.uniform1i(
        gl.getUniformLocation(state.updatePrg, "uRgNoise"),
        0);
    bindVAO(gl, state.vaos[state.read]);
    gl.bindBufferBase(
        gl.TRANSFORM_FEEDBACK_BUFFER, 0, state.bufs[state.write]);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    draw(gl, state.num_part, gl.POINTS);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
};

export const render = (gl: GL, state: State) => {
    bindVAO(gl, state.vaos[state.read + 2]);
    useProgram(gl, state.renderPrg);
    clear(gl);
    draw(gl, state.num_part, gl.POINTS);
    const tmp = state.read;
    state.read = state.write;
    state.write = tmp;
};
