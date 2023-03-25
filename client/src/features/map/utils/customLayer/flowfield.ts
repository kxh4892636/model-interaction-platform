import axios from "axios";
import mapboxgl from "mapbox-gl";
import { ServerData } from "../../../../types";
import { Shader } from "../renderUtils/shader";

// create random positions and velocities.
const rand = (min: number, max: number) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
};

async function loadShader_url(
  gl: WebGL2RenderingContext,
  name: string,
  vertexUrl: string,
  fragmentUrl: string,
  transformFeedbackVaryings?: Array<string>
): Promise<Shader> {
  const vertexSource = await axios.get(vertexUrl).then((response) => {
    return response.data;
  });
  const fragmentSource = await axios.get(fragmentUrl).then((response) => {
    return response.data;
  });

  return new Shader(gl, name, [vertexSource, fragmentSource], transformFeedbackVaryings);
}

function makeBufferBySource(
  gl: WebGL2RenderingContext,
  target: number,
  srcData: ArrayBuffer,
  usage: number
): WebGLBuffer | null {
  const vbo = gl.createBuffer();
  if (vbo === null) {
    console.log("ERROR::Vertex Buffer cannot be created!");
    return vbo;
  }

  gl.bindBuffer(target, vbo);
  gl.bufferData(target, srcData, usage);
  gl.bindBuffer(target, null);
  return vbo;
}

function loadTexture(gl: WebGL2RenderingContext, url: string, interpolationType = gl.LINEAR) {
  const textureID = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureID);

  const image = new Image();
  image.src = url;
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, textureID);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, interpolationType);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, interpolationType);
    }
  };

  return textureID;

  function isPowerOf2(value: number) {
    return (value & (value - 1)) === 0;
  }
}

// Data Size Constraints
interface FlowFieldConstraints {
  MAX_TEXTURE_SIZE: number;
  MAX_STREAMLINE_NUM: number;
  MAX_SEGMENT_NUM: number;
  MAX_DORP_RATE: number;
  MAX_DORP_RATE_BUMP: number;

  [name: string]: number;
}
class FlowFieldController {
  lineNum: number;
  segmentNum: number;
  fullLife: number;
  progressRate: number;
  speedFactor: number;
  dropRate: number;
  dropRateBump: number;
  fillWidth: number;
  aaWidth: number;
  content: string;

  constraints: FlowFieldConstraints;

  constructor(constraints?: FlowFieldConstraints) {
    this.lineNum = 65536;
    this.segmentNum = 32;
    this.fullLife = this.segmentNum * 3;
    this.progressRate = 0.0;
    this.speedFactor = 2.0;
    this.dropRate = 0.003;
    this.dropRateBump = 0.001;
    this.fillWidth = 1.5;
    this.aaWidth = 1.0;
    this.content = "none";

    if (constraints) {
      this.constraints = constraints;
    } else {
      this.constraints = {
        MAX_TEXTURE_SIZE: 0.0,
        MAX_STREAMLINE_NUM: 0.0,
        MAX_SEGMENT_NUM: 0.0,
        MAX_DORP_RATE: 0.0,
        MAX_DORP_RATE_BUMP: 0.0,
      };
    }
  }

  Create(constraints: FlowFieldConstraints) {
    return new FlowFieldController(constraints);
  }
}

interface TextureOffset {
  offsetX: number;
  offsetY: number;
}

type ParamsType = {
  startValue?: number;
  endValue?: number;
};

export class FlowFieldManager {
  private id: string;
  private dataDetail: ServerData | undefined;
  private params: ParamsType | undefined;

  private fieldSequence: Array<WebGLTexture>;
  private maskSequence: Array<WebGLTexture>;
  private validSequence: Array<WebGLTexture>;

  private simulationVAO: WebGLVertexArrayObject | null;
  private renderVAO: WebGLVertexArrayObject | null;

  private XFBO: WebGLTransformFeedback | null;

  private simulationBuffer: WebGLBuffer | null;
  private lifeBuffer: WebGLBuffer | null;
  private xfSimulationBuffer: WebGLBuffer | null;
  private xfLifeBuffer: WebGLBuffer | null;

  private poolTextureBuffer: WebGLTexture | null;

  private UBO: WebGLBuffer | null;

  private updateShader: Shader | null;
  private drawShader: Shader | null;
  private poolShader: Shader | null;
  private textureShader: Shader | null;

  private uboMapBuffer: Float32Array;
  private particleMapBuffer: Float32Array | null;

  flowBoundary: Array<number>;
  public controller: FlowFieldController | null;

  private maxBlockSize: number;
  private maxBlockColumn: number;
  private textureOffsetArray: Array<TextureOffset>;
  private geoBbox: number[];
  public u_matrix: number[];
  public zoomRate = 1.0;

  // Temporary render variable
  private beginBlock = -1.0;
  private renderCount = 0.0;
  private streamline = 0.0;
  private segmentNum = 0.0;
  private vaTextureInfo: WebGLTexture = 0;
  private ffTextureInfo: Array<WebGLTexture> = [];
  private maskTextureInfo: Array<WebGLTexture> = [];

  constructor(
    id: string,
    dataDetail: ServerData | undefined = undefined,
    params: ParamsType | undefined = undefined
  ) {
    this.id = id;
    this.dataDetail = dataDetail;
    this.params = params;
    this.fieldSequence = []; // store all the flow textures
    this.maskSequence = []; // store all the mask textures
    this.validSequence = [];

    this.simulationVAO = null;
    this.renderVAO = null;
    this.simulationBuffer = null;
    this.lifeBuffer = null;
    this.xfSimulationBuffer = null;
    this.xfLifeBuffer = null;
    this.poolTextureBuffer = null;
    this.XFBO = null;
    this.UBO = null;
    this.updateShader = null;
    this.drawShader = null;
    this.poolShader = null;
    this.textureShader = null;
    this.uboMapBuffer = new Float32Array(12); // uniform block!
    this.particleMapBuffer = null;
    this.geoBbox = [0, 0, 0, 0];
    this.u_matrix = [];

    this.flowBoundary = []; // boundary 4 flow u&v
    this.controller = null;

    this.maxBlockSize = 0.0;
    this.maxBlockColumn = 0.0;
    this.textureOffsetArray = [];
  }

  static async Create(gl: WebGL2RenderingContext, descriptionUrl: string) {
    const ffManager = new FlowFieldManager(descriptionUrl);
    await ffManager.Prepare(gl);

    return ffManager;
  }

  async Prepare(gl: WebGL2RenderingContext) {
    console.log("prepare");

    await axios
      .get(`http://localhost:3456/data/uvet?id=` + this.id, {
        params: { type: "description" },
      })
      .then(async (response) => {
        // Get boundaries of flow speed
        this.flowBoundary[0] = response.data["flow_boundary"]["u_min"];
        this.flowBoundary[1] = response.data["flow_boundary"]["v_min"];
        this.flowBoundary[2] = response.data["flow_boundary"]["u_max"];
        this.flowBoundary[3] = response.data["flow_boundary"]["v_max"];

        // Set uniform buffer object data (something will not change)
        this.uboMapBuffer[8] = this.flowBoundary[0];
        this.uboMapBuffer[9] = this.flowBoundary[1];
        this.uboMapBuffer[10] = this.flowBoundary[2];
        this.uboMapBuffer[11] = this.flowBoundary[3];

        // Get constraints
        const constraints: FlowFieldConstraints = {
          MAX_TEXTURE_SIZE: response.data["constraints"]["max_texture_size"],
          MAX_STREAMLINE_NUM: response.data["constraints"]["max_streamline_num"],
          MAX_SEGMENT_NUM: response.data["constraints"]["max_segment_num"],
          MAX_DORP_RATE: response.data["constraints"]["max_drop_rate"],
          MAX_DORP_RATE_BUMP: response.data["constraints"]["max_drop_rate_bump"],
        };

        const extent: [number, number, number, number] = [
          this.dataDetail!.extent[0],
          this.dataDetail!.extent[3],
          this.dataDetail!.extent[1],
          this.dataDetail!.extent[2],
        ];

        const startValue = this.params?.startValue ? this.params.startValue : 0;
        const endValue = this.params?.endValue
          ? this.params?.endValue
          : this.params?.endValue === 0
          ? 0
          : Number(this.dataDetail!.transform[1]) - 1;

        this.geoBbox = this.TransMercator(extent);
        // Set constraints
        this.controller = new FlowFieldController(constraints)!;

        // Load textures of flow fields
        for (let i = startValue; i <= endValue; i++) {
          axios 
            .get(`http://localhost:3456/data/uvet?id=` + this.id, {
              params: { currentImage: i, type: "uv" },
              responseType: "blob",
            })
            .then((res) => {
              const blob = new Blob([res.data]);
              const url = window.URL.createObjectURL(blob);
              this.fieldSequence.push(loadTexture(gl, url, gl.NEAREST)!);
            });
        }
        // Load textures of area masks
        for (let i = startValue; i <= endValue; i++) {
          axios
            .get(`http://localhost:3456/data/uvet?id=` + this.id, {
              params: { currentImage: i, type: "mask" },
              responseType: "blob",
            })
            .then((res) => {
              const blob = new Blob([res.data]);
              const url = window.URL.createObjectURL(blob);
              this.maskSequence.push(loadTexture(gl, url, gl.NEAREST)!);
            });
        }
        // Load textures of valid address
        for (let i = startValue; i <= endValue; i++) {
          axios
            .get(`http://localhost:3456/data/uvet?id=` + this.id, {
              params: { currentImage: i, type: "valid" },
              responseType: "blob",
            })
            .then((res) => {
              const blob = new Blob([res.data]);
              const url = window.URL.createObjectURL(blob);
              this.validSequence.push(loadTexture(gl, url, gl.NEAREST)!);
            });
        }
      });

    // Prepare descriptive variables
    const MAX_TEXTURE_SIZE = this.controller!.constraints["MAX_TEXTURE_SIZE"];
    const MAX_STREAMLINE_NUM = this.controller!.constraints["MAX_STREAMLINE_NUM"];
    const MAX_SEGMENT_NUM = this.controller!.constraints["MAX_SEGMENT_NUM"];

    this.maxBlockSize = Math.ceil(Math.sqrt(MAX_STREAMLINE_NUM)); // block num in a row/col
    this.maxBlockColumn = Math.floor(MAX_TEXTURE_SIZE / this.maxBlockSize); // column num of a block
    for (let i = 0; i < MAX_SEGMENT_NUM; i++) {
      // get the particle position in the texture
      const offset: TextureOffset = {
        offsetX: (i % this.maxBlockColumn) * this.maxBlockSize,
        offsetY: Math.floor(i / this.maxBlockColumn) * this.maxBlockSize,
      };

      this.textureOffsetArray.push(offset);
    }

    // Set data of particle block used to fill simulation buffer and particle pool texture
    this.particleMapBuffer = new Float32Array(this.maxBlockSize * this.maxBlockSize * 3).fill(0);
    for (let i = 0; i < MAX_STREAMLINE_NUM; i++) {
      this.particleMapBuffer[i * 3 + 0] = rand(0, 1.0);
      this.particleMapBuffer[i * 3 + 1] = rand(0, 1.0);
      this.particleMapBuffer[i * 3 + 2] = rand(0, 0);
    }

    // Set coundown for particles
    const particleCountdownArray = new Float32Array(MAX_STREAMLINE_NUM);
    for (let i = 0; i < MAX_STREAMLINE_NUM; i++) {
      particleCountdownArray[i] = Math.floor(
        rand(this.controller!.segmentNum, this.controller!.fullLife)
      );
    }

    // Set Buffer used to simulation
    this.simulationBuffer = makeBufferBySource(
      gl,
      gl.ARRAY_BUFFER,
      this.particleMapBuffer.slice(0, MAX_STREAMLINE_NUM * 3),
      gl.DYNAMIC_DRAW
    );
    this.xfSimulationBuffer = makeBufferBySource(
      gl,
      gl.TRANSFORM_FEEDBACK_BUFFER,
      this.particleMapBuffer.slice(0, MAX_STREAMLINE_NUM * 3),
      gl.DYNAMIC_DRAW
    );
    this.lifeBuffer = makeBufferBySource(
      gl,
      gl.ARRAY_BUFFER,
      particleCountdownArray,
      gl.DYNAMIC_DRAW
    );
    this.xfLifeBuffer = makeBufferBySource(
      gl,
      gl.TRANSFORM_FEEDBACK_BUFFER,
      particleCountdownArray,
      gl.DYNAMIC_DRAW
    );

    // Make uniform buffer object
    this.UBO = gl.createBuffer()!;
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.UBO);
    gl.bufferData(gl.UNIFORM_BUFFER, 48, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);

    // Set particle pool
    this.poolTextureBuffer = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.poolTextureBuffer);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGB32F, MAX_TEXTURE_SIZE, MAX_TEXTURE_SIZE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    for (let i = 0; i < MAX_SEGMENT_NUM; i++) {
      // init each block(particle line status)
      gl.texSubImage2D(
        gl.TEXTURE_2D,
        0,
        this.textureOffsetArray[i].offsetX,
        this.textureOffsetArray[i].offsetY,
        this.maxBlockSize,
        this.maxBlockSize,
        gl.RGB,
        gl.FLOAT,
        this.particleMapBuffer
      );
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Set Vertex Array Object
    this.simulationVAO = gl.createVertexArray();
    gl.bindVertexArray(this.simulationVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.simulationBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0);
    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.lifeBuffer);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 1 * 4, 0);
    gl.enableVertexAttribArray(1);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.renderVAO = gl.createVertexArray();
    gl.bindVertexArray(this.renderVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.lifeBuffer);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 1 * 4, 0);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribDivisor(0, 1);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Set Transform Feedback Object
    this.XFBO = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.XFBO);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, this.xfSimulationBuffer);
    gl.bindBufferRange(
      gl.TRANSFORM_FEEDBACK_BUFFER,
      0,
      this.xfSimulationBuffer,
      0,
      MAX_STREAMLINE_NUM * 12
    );
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, this.xfLifeBuffer);
    gl.bindBufferRange(
      gl.TRANSFORM_FEEDBACK_BUFFER,
      1,
      this.xfLifeBuffer,
      0,
      MAX_STREAMLINE_NUM * 4
    );
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

    // Build Shaders
    this.updateShader = await loadShader_url(
      gl,
      "update",
      "http://localhost:3333/shaders/update.vert",
      "http://localhost:3333/shaders/update.frag",
      ["newPosition", "aliveTime"]
    );
    this.drawShader = await loadShader_url(
      gl,
      "draw",
      "http://localhost:3333/shaders/ribbonParticle.vert",
      "http://localhost:3333/shaders/ribbonParticle.frag"
    );
    this.poolShader = await loadShader_url(
      gl,
      "textureDebug",
      "http://localhost:3333/shaders/showPool.vert",
      "http://localhost:3333/shaders/showPool.frag"
    );
    this.textureShader = await loadShader_url(
      gl,
      "textureDebug",
      "http://localhost:3333/shaders/texture.vert",
      "http://localhost:3333/shaders/texture.frag"
    );

    return true;
  }

  getFieldTexture(index: number) {
    if (index < 0 || index >= this.fieldSequence.length) return null;

    return this.fieldSequence[index];
  }

  getMaskTexture(index: number) {
    if (index < 0 || index >= this.maskSequence.length) return null;

    return this.maskSequence[index];
  }
  getValidTexture(progressRate: number) {
    const progress = progressRate * (this.fieldSequence.length - 1.0);
    const fractionalPart = progress - Math.floor(progress);

    return fractionalPart < 0.5
      ? this.validSequence[Math.floor(progress)]
      : this.validSequence[Math.ceil(progress)];
  }

  getFieldTextures(progressRate: number) {
    const progress = progressRate * (this.fieldSequence.length - 1.0);

    return [this.fieldSequence[Math.floor(progress)], this.fieldSequence[Math.ceil(progress)]];
  }

  getMaskTextures(progressRate: number) {
    const progress = progressRate * (this.maskSequence.length - 1.0);

    return [this.maskSequence[Math.floor(progress)], this.maskSequence[Math.ceil(progress)]];
  }

  getProgressBetweenTexture(progressRate: number) {
    const progress = progressRate * (this.fieldSequence.length - 1.0);

    return progress - Math.floor(progress);
  }

  bindUBO(gl: WebGL2RenderingContext, bindingPointIndex: number) {
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.UBO);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.uboMapBuffer);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, bindingPointIndex, this.UBO);
  }

  step(stepSize: number) {
    this.controller!.progressRate =
      this.controller!.progressRate +
      stepSize -
      Math.floor(this.controller!.progressRate + stepSize);
  }

  tickLogic() {
    this.step(this.renderCount * 0.002);
    console.log(this.controller);
    this.beginBlock = (this.beginBlock + 1) % this.controller!.constraints["MAX_SEGMENT_NUM"];

    this.uboMapBuffer[0] = this.getProgressBetweenTexture(this.controller!.progressRate);
    this.uboMapBuffer[1] = this.controller!.segmentNum;
    this.uboMapBuffer[2] = this.controller!.segmentNum * 3;
    this.uboMapBuffer[3] = this.controller!.dropRate;
    this.uboMapBuffer[4] = this.controller!.dropRateBump;
    this.uboMapBuffer[5] = this.controller!.speedFactor * this.renderCount * 100;
  }
  tickLogicCount() {
    this.step(0.001);
    this.beginBlock = (this.beginBlock + 1) % this.controller!.constraints["MAX_SEGMENT_NUM"];
    // console.log(this.beginBlock);

    this.uboMapBuffer[0] = this.getProgressBetweenTexture(this.controller!.progressRate);
    this.uboMapBuffer[1] = this.controller!.segmentNum;
    this.uboMapBuffer[2] = this.controller!.segmentNum * 3;
    this.uboMapBuffer[3] = this.controller!.dropRate;
    this.uboMapBuffer[4] = this.controller!.dropRateBump;
    this.uboMapBuffer[5] = this.controller!.speedFactor * 0.01 * 100;
  }

  private TransMercator(bbox: [number, number, number, number]) {
    const min = mapboxgl.MercatorCoordinate.fromLngLat({ lng: bbox[0], lat: bbox[1] });
    const max = mapboxgl.MercatorCoordinate.fromLngLat({ lng: bbox[2], lat: bbox[3] });
    const res = [min.x, min.y, max.x, max.y];
    return res;
  }

  tickRender(gl: WebGL2RenderingContext) {
    this.vaTextureInfo = this.getValidTexture(this.controller!.progressRate);
    this.ffTextureInfo = this.getFieldTextures(this.controller!.progressRate);
    this.maskTextureInfo = this.getMaskTextures(this.controller!.progressRate);
    this.streamline = this.controller!.lineNum;
    this.segmentNum = this.controller!.segmentNum;
    this.bindUBO(gl, 0);

    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Pass 1 - Operation 1: Simulation
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.ffTextureInfo[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.maskTextureInfo[0]);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.ffTextureInfo[1]);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.maskTextureInfo[1]);
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, this.vaTextureInfo);
    this.updateShader!.use(gl);
    this.updateShader!.setInt(gl, "flowField1", 0);
    this.updateShader!.setInt(gl, "mask1", 1);
    this.updateShader!.setInt(gl, "flowField2", 2);
    this.updateShader!.setInt(gl, "mask2", 3);
    this.updateShader!.setInt(gl, "validAddress", 4);
    this.updateShader!.setFloat(gl, "randomSeed", Math.random());
    this.updateShader!.setUniformBlock(gl, "FlowFieldUniforms", 0);
    this.updateShader!.setFloat2(gl, "boundary", gl.canvas.width, gl.canvas.height);

    gl.enable(gl.RASTERIZER_DISCARD); // prevent generating primitives
    gl.bindVertexArray(this.simulationVAO);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.XFBO);

    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, this.streamline);
    gl.endTransformFeedback();

    gl.bindVertexArray(null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);

    // Pass 1 - Operation 2: Update particle pool
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, this.xfLifeBuffer);
    gl.bindBuffer(gl.COPY_WRITE_BUFFER, this.lifeBuffer);
    gl.copyBufferSubData(
      gl.TRANSFORM_FEEDBACK_BUFFER,
      gl.COPY_WRITE_BUFFER,
      0,
      0,
      this.streamline * 1 * 4
    );

    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, this.xfSimulationBuffer);
    gl.bindBuffer(gl.COPY_WRITE_BUFFER, this.simulationBuffer);
    gl.copyBufferSubData(
      gl.TRANSFORM_FEEDBACK_BUFFER,
      gl.COPY_WRITE_BUFFER,
      0,
      0,
      this.streamline * 3 * 4
    );
    gl.getBufferSubData(
      gl.TRANSFORM_FEEDBACK_BUFFER,
      0,
      this.particleMapBuffer!,
      0,
      this.streamline * 3
    );
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

    gl.bindTexture(gl.TEXTURE_2D, this.poolTextureBuffer);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      this.textureOffsetArray[this.beginBlock].offsetX,
      this.textureOffsetArray[this.beginBlock].offsetY,
      this.maxBlockSize,
      this.maxBlockSize,
      gl.RGB,
      gl.FLOAT,
      this.particleMapBuffer
    );

    // Pass 2 - Operation 1: Rendering
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.bindVertexArray(this.renderVAO);
    this.drawShader!.use(gl);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.poolTextureBuffer);
    this.drawShader!.setInt(gl, "particlePool", 0);
    this.drawShader!.setInt(gl, "blockNum", this.controller!.constraints["MAX_SEGMENT_NUM"]);
    this.drawShader!.setInt(gl, "beginBlock", this.beginBlock);
    this.drawShader!.setInt(gl, "blockSize", this.maxBlockSize);
    this.drawShader!.setFloat(gl, "fillWidth", this.controller!.fillWidth);
    this.drawShader!.setFloat(gl, "aaWidth", this.controller!.aaWidth);
    this.drawShader!.setFloat2(gl, "viewport", gl.canvas.width, gl.canvas.height);
    this.drawShader!.setVec4(gl, "bbox", this.geoBbox);
    this.drawShader!.setMat4(gl, "u_matrix", this.u_matrix);
    this.drawShader!.setUniformBlock(gl, "FlowFieldUniforms", 0);
    gl.drawArraysInstanced(
      gl.TRIANGLE_STRIP,
      0,
      (this.segmentNum - 1) * 2,
      this.streamline * this.zoomRate
    );
    gl.disable(gl.BLEND);
    // console.log(this.streamline * this.zoomRate);

    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    // Debug
    // Show particle pool
    if (this.controller!.content === "particle pool") {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      this.poolShader!.use(gl);
      this.poolShader!.setFloat2(gl, "viewport", window.innerWidth, window.innerHeight);
      this.poolShader!.setInt(gl, "textureBuffer", 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.poolTextureBuffer);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 1);
      gl.disable(gl.BLEND);
    }
    // Show flow fields
    if (this.controller!.content === "flow field") {
      this.textureShader!.use(gl);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.ffTextureInfo[0]);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.ffTextureInfo[1]);
      this.textureShader!.setInt(gl, "texture1", 0);
      this.textureShader!.setInt(gl, "texture2", 1);
      this.textureShader!.setFloat(gl, "progress", this.getProgressBetweenTexture(this.beginBlock));
      this.textureShader!.setFloat2(gl, "viewport", window.innerWidth, window.innerHeight);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 1);
    }
  }
}
