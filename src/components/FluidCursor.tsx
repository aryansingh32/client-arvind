import { useEffect, useRef } from "react";

// Ported from a WebGL fluid-simulation cursor demo (originally vanilla JS +
// jQuery, https://codepen.io/RunicFreak/pen/abKPYJa) and adapted to run as a
// self-contained effect inside a React component: no globals, no jQuery, a
// single canvas ref, and full teardown (listeners, RAF, GL context) on
// unmount so route/layout remounts can't leak GPU resources. Left as
// close to the original algorithm as possible — this is a physics sim, not
// application code, so it's typed loosely on purpose rather than forced into
// interfaces that don't help readability here.
//
// A decorative overlay layered on top of the normal cursor, not a
// replacement for it — the OS pointer stays visible throughout. Desktop
// pointer:fine only; skipped entirely under prefers-reduced-motion or on
// touch/coarse pointers, same rule the rest of the site's signature
// interactions follow.
export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    let rafId: number | null = null;

    // Resolution and iteration count are toned down from the original demo's
    // values (DYE_RESOLUTION 1440, PRESSURE_ITERATIONS 20): that pen ran on a
    // dedicated black full-bleed page as the whole point of the demo, whereas
    // here it's a continuous background effect competing for GPU time with
    // the rest of a content-heavy site on whatever hardware a visitor has.
    // Same visual character at typical viewing distance, a fraction of the
    // per-frame cost.
    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 720,
      DENSITY_DISSIPATION: 3.5,
      VELOCITY_DISSIPATION: 2,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 12,
      CURL: 3,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLOR_UPDATE_SPEED: 10,
    };

    const pointer = {
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      moved: false,
      color: { r: 0.15, g: 0, b: 1.5 },
    };

    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };
    // WebGL's context types differ enough between webgl/webgl2 (and the
    // ancient "experimental-webgl" fallback some browsers still expect)
    // that typing this precisely fights the DOM lib's overloads for no
    // benefit — every call below is checked against the real API at
    // runtime the same way the original demo was.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gl: any = canvas.getContext("webgl2", params);
    const isWebGL2 = !!gl;
    if (!gl) {
      gl = canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params);
    }
    if (!gl) return;
    const glCtx: any = gl;

    let halfFloat: any;
    let supportLinearFiltering: any;
    if (isWebGL2) {
      glCtx.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = glCtx.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = glCtx.getExtension("OES_texture_half_float");
      supportLinearFiltering = glCtx.getExtension("OES_texture_half_float_linear");
    }
    if (!supportLinearFiltering) {
      config.DYE_RESOLUTION = 512;
      config.SHADING = false;
    }

    glCtx.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2 ? glCtx.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;

    function supportRenderTextureFormat(internalFormat: number, format: number, type: number) {
      const texture = glCtx.createTexture();
      glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

      const fbo = glCtx.createFramebuffer();
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, fbo);
      glCtx.framebufferTexture2D(glCtx.FRAMEBUFFER, glCtx.COLOR_ATTACHMENT0, glCtx.TEXTURE_2D, texture, 0);
      const status = glCtx.checkFramebufferStatus(glCtx.FRAMEBUFFER);
      return status === glCtx.FRAMEBUFFER_COMPLETE;
    }

    function getSupportedFormat(internalFormat: number, format: number, type: number): { internalFormat: number; format: number } | null {
      if (!supportRenderTextureFormat(internalFormat, format, type)) {
        if (isWebGL2) {
          if (internalFormat === glCtx.R16F) {
            return getSupportedFormat(glCtx.RG16F, glCtx.RG, type);
          }
          if (internalFormat === glCtx.RG16F) {
            return getSupportedFormat(glCtx.RGBA16F, glCtx.RGBA, type);
          }
        }
        return null;
      }
      return { internalFormat, format };
    }

    let formatRGBA: { internalFormat: number; format: number } | null;
    let formatRG: { internalFormat: number; format: number } | null;
    let formatR: { internalFormat: number; format: number } | null;
    if (isWebGL2) {
      formatRGBA = getSupportedFormat(glCtx.RGBA16F, glCtx.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(glCtx.RG16F, glCtx.RG, halfFloatTexType);
      formatR = getSupportedFormat(glCtx.R16F, glCtx.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(glCtx.RGBA, glCtx.RGBA, halfFloatTexType);
      formatRG = formatRGBA;
      formatR = formatRGBA;
    }

    function compileShader(type: number, source: string, keywords?: string[] | null) {
      let fullSource = source;
      if (keywords) {
        let keywordsString = "";
        keywords.forEach((keyword) => {
          keywordsString += "#define " + keyword + "\n";
        });
        fullSource = keywordsString + source;
      }
      const shader = glCtx.createShader(type)!;
      glCtx.shaderSource(shader, fullSource);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.warn(glCtx.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = glCtx.createProgram()!;
      glCtx.attachShader(program, vertexShader);
      glCtx.attachShader(program, fragmentShader);
      glCtx.linkProgram(program);
      if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
        console.warn(glCtx.getProgramInfoLog(program));
      }
      return program;
    }

    function getUniforms(program: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const uniformCount = glCtx.getProgramParameter(program, glCtx.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const uniformName = glCtx.getActiveUniform(program, i)!.name;
        uniforms[uniformName] = glCtx.getUniformLocation(program, uniformName);
      }
      return uniforms;
    }

    class Program {
      uniforms: Record<string, WebGLUniformLocation | null>;
      program: WebGLProgram;
      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program);
      }
      bind() {
        glCtx.useProgram(this.program);
      }
    }

    class Material {
      vertexShader: WebGLShader;
      fragmentShaderSource: string;
      programs: Record<number, WebGLProgram>;
      activeProgram: WebGLProgram | null;
      uniforms: Record<string, WebGLUniformLocation | null>;
      constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = {};
        this.activeProgram = null;
        this.uniforms = {};
      }
      setKeywords(keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
        let program = this.programs[hash];
        if (program == null) {
          const fragmentShader = compileShader(glCtx.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }
      bind() {
        if (this.activeProgram) glCtx.useProgram(this.activeProgram);
      }
    }

    const baseVertexShader = compileShader(
      glCtx.VERTEX_SHADER,
      `precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`
    );

    const copyShader = compileShader(
      glCtx.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        gl_FragColor = texture2D(uTexture, vUv);
      }`
    );

    const clearShader = compileShader(
      glCtx.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }`
    );

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
      #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;
        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);
        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);
        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
      #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
    `;

    const splatShader = compileShader(
      glCtx.FRAGMENT_SHADER,
      `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }`
    );

    const advectionShader = compileShader(
      glCtx.FRAGMENT_SHADER,
      `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
      #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
      #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
      #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }`,
      supportLinearFiltering ? null : ["MANUAL_FILTERING"]
    );

    const divergenceShader = compileShader(
      glCtx.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }`
    );

    const curlShader = compileShader(
      glCtx.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }`
    );

    const vorticityShader = compileShader(
      glCtx.FRAGMENT_SHADER,
      `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }`
    );

    const pressureShader = compileShader(
      glCtx.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }`
    );

    const gradientSubtractShader = compileShader(
      glCtx.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }`
    );

    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, glCtx.createBuffer());
    glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), glCtx.STATIC_DRAW);
    glCtx.bindBuffer(glCtx.ELEMENT_ARRAY_BUFFER, glCtx.createBuffer());
    glCtx.bufferData(glCtx.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), glCtx.STATIC_DRAW);
    glCtx.vertexAttribPointer(0, 2, glCtx.FLOAT, false, 0, 0);
    glCtx.enableVertexAttribArray(0);

    function blit(target: FBO | null, clear = false) {
      if (target == null) {
        glCtx.viewport(0, 0, glCtx.drawingBufferWidth, glCtx.drawingBufferHeight);
        glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, null);
      } else {
        glCtx.viewport(0, 0, target.width, target.height);
        glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, target.fbo);
      }
      if (clear) {
        glCtx.clearColor(0.0, 0.0, 0.0, 1.0);
        glCtx.clear(glCtx.COLOR_BUFFER_BIT);
      }
      glCtx.drawElements(glCtx.TRIANGLES, 6, glCtx.UNSIGNED_SHORT, 0);
    }

    interface FBO {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach(id: number): number;
    }
    interface DoubleFBO {
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      read: FBO;
      write: FBO;
      swap(): void;
    }

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
      glCtx.activeTexture(glCtx.TEXTURE0);
      const texture = glCtx.createTexture()!;
      glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, param);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, param);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = glCtx.createFramebuffer()!;
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, fbo);
      glCtx.framebufferTexture2D(glCtx.FRAMEBUFFER, glCtx.COLOR_ATTACHMENT0, glCtx.TEXTURE_2D, texture, 0);
      glCtx.viewport(0, 0, w, h);
      glCtx.clear(glCtx.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        attach(id: number) {
          glCtx.activeTexture(glCtx.TEXTURE0 + id);
          glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function resizeFBO(target: FBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      glCtx.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      return newFBO;
    }

    function resizeDoubleFBO(target: DoubleFBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    function updateKeywords() {
      const displayKeywords: string[] = [];
      if (config.SHADING) displayKeywords.push("SHADING");
      displayMaterial.setKeywords(displayKeywords);
    }

    function hashCode(s: string) {
      if (s.length === 0) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }

    function scaleByPixelRatio(input: number) {
      const pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(input * pixelRatio);
    }

    function getResolution(resolution: number) {
      let aspectRatio = glCtx.drawingBufferWidth / glCtx.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      if (glCtx.drawingBufferWidth > glCtx.drawingBufferHeight) return { width: max, height: min };
      return { width: min, height: max };
    }

    function HSVtoRGB(h: number, s: number, v: number) {
      let r = 0;
      let g = 0;
      let b = 0;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
      }
      return { r, g, b };
    }

    function generateColor() {
      const c = HSVtoRGB(Math.random(), 1.0, 1.0);
      c.r *= 0.15;
      c.g *= 0.15;
      c.b *= 0.15;
      return c;
    }

    function wrap(value: number, min: number, max: number) {
      const range = max - min;
      if (range === 0) return min;
      return ((value - min) % range) + min;
    }

    function correctRadius(radius: number) {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    function correctDeltaX(delta: number) {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }

    function correctDeltaY(delta: number) {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = halfFloatTexType;
      const rgba = formatRGBA!;
      const rg = formatRG!;
      const r = formatR!;
      const filtering = supportLinearFiltering ? glCtx.LINEAR : glCtx.NEAREST;

      glCtx.disable(glCtx.BLEND);

      dye = dye
        ? resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
        : createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

      velocity = velocity
        ? resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
        : createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, glCtx.NEAREST);
      curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, glCtx.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, glCtx.NEAREST);
    }

    function resizeCanvas() {
      const width = scaleByPixelRatio(canvas!.clientWidth);
      const height = scaleByPixelRatio(canvas!.clientHeight);
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
        return true;
      }
      return false;
    }

    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    function calcDeltaTime() {
      const now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    }

    function updateColors(dt: number) {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointer.color = generateColor();
      }
    }

    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      splatProgram.bind();
      glCtx.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      glCtx.uniform1f(splatProgram.uniforms.aspectRatio, canvas!.width / canvas!.height);
      glCtx.uniform2f(splatProgram.uniforms.point, x, y);
      glCtx.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      glCtx.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
      blit(velocity.write);
      velocity.swap();

      glCtx.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      glCtx.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function splatPointer() {
      const dx = pointer.deltaX * config.SPLAT_FORCE;
      const dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function clickSplat() {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      const dx = 10 * (Math.random() - 0.5);
      const dy = 30 * (Math.random() - 0.5);
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    function applyInputs() {
      if (pointer.moved) {
        pointer.moved = false;
        splatPointer();
      }
    }

    function step(dt: number) {
      glCtx.disable(glCtx.BLEND);

      curlProgram.bind();
      glCtx.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glCtx.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      glCtx.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glCtx.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      glCtx.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      glCtx.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      glCtx.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      glCtx.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glCtx.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      glCtx.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      glCtx.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      glCtx.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glCtx.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        glCtx.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradienSubtractProgram.bind();
      glCtx.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      glCtx.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      glCtx.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      glCtx.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!supportLinearFiltering) {
        glCtx.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      const velocityId = velocity.read.attach(0);
      glCtx.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      glCtx.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      glCtx.uniform1f(advectionProgram.uniforms.dt, dt);
      glCtx.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!supportLinearFiltering) {
        glCtx.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }
      glCtx.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      glCtx.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      glCtx.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function drawDisplay() {
      const width = glCtx.drawingBufferWidth;
      const height = glCtx.drawingBufferHeight;
      displayMaterial.bind();
      if (config.SHADING) glCtx.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
      glCtx.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    function render() {
      glCtx.blendFunc(glCtx.ONE, glCtx.ONE_MINUS_SRC_ALPHA);
      glCtx.enable(glCtx.BLEND);
      drawDisplay();
    }

    function updatePointerMoveData(posX: number, posY: number, color: { r: number; g: number; b: number }) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    }

    function updatePointerDownData(posX: number, posY: number) {
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    }

    function update() {
      if (destroyed) return;
      if (document.hidden) {
        // Bail without scheduling the next frame while backgrounded, but
        // clear loopStarted too (not just rafId) — otherwise ensureLoopStarted's
        // guard permanently blocks the visibilitychange listener from ever
        // restarting the loop once the tab comes back to the foreground.
        rafId = null;
        loopStarted = false;
        return;
      }
      const dt = calcDeltaTime();
      if (resizeCanvas()) initFramebuffers();
      updateColors(dt);
      applyInputs();
      step(dt);
      render();
      rafId = requestAnimationFrame(update);
    }

    let loopStarted = false;
    function ensureLoopStarted() {
      if (loopStarted) return;
      loopStarted = true;
      rafId = requestAnimationFrame(update);
    }

    const onMouseDown = (e: MouseEvent) => {
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      updatePointerDownData(posX, posY);
      clickSplat();
      ensureLoopStarted();
    };

    const onMouseMove = (e: MouseEvent) => {
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      updatePointerMoveData(posX, posY, pointer.color);
      ensureLoopStarted();
    };

    const onTouchStart = (e: TouchEvent) => {
      const touches = e.targetTouches;
      const posX = scaleByPixelRatio(touches[0].clientX);
      const posY = scaleByPixelRatio(touches[0].clientY);
      updatePointerDownData(posX, posY);
      ensureLoopStarted();
    };

    const onTouchMove = (e: TouchEvent) => {
      const touches = e.targetTouches;
      const posX = scaleByPixelRatio(touches[0].clientX);
      const posY = scaleByPixelRatio(touches[0].clientY);
      updatePointerMoveData(posX, posY, pointer.color);
    };

    const onVisibilityChange = () => {
      if (!document.hidden) ensureLoopStarted();
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    updateKeywords();
    initFramebuffers();

    return () => {
      destroyed = true;
      if (rafId != null) cancelAnimationFrame(rafId);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // Deliberately not calling WEBGL_lose_context here: canvas.getContext()
      // returns the *same* context object on a later call for the same
      // canvas element even after it's been explicitly lost, and StrictMode's
      // dev-only mount→cleanup→remount reuses this exact canvas node — so an
      // explicit loseContext() here would leave the remount stuck rendering
      // nothing until the browser gets around to an async restore. The GL
      // resources are released by the browser once the canvas element itself
      // is actually detached from the DOM (a real unmount).
    };
  }, []);

  return <canvas ref={canvasRef} className="fluid-cursor-canvas" aria-hidden="true" />;
}
