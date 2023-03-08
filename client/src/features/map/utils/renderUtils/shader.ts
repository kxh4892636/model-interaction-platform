export class Shader {
    name: string;
    shaderProgram: WebGLProgram | null;

    constructor(gl: WebGL2RenderingContext, name: string, shaderSources: Array<string>, transformFeedbackVaryings?: Array<string>) {
        this.name = name || "";

        // Create shader program
        const program = gl.createProgram();
        if (!program) {
            console.log("ERROR::Shader program cannot be created!");
            this.shaderProgram = null;
            return;
        }

        // Create and attach shader module to program
        [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
            const shader = this.createShader(gl, type, shaderSources[ndx]);
            if (!shader) return;
            gl.attachShader(program, shader);
        });

        // Set transform feedback if exists
        if (transformFeedbackVaryings && (transformFeedbackVaryings!).length != 0) {
            gl.transformFeedbackVaryings(
                program, 
                transformFeedbackVaryings!,
                gl.SEPARATE_ATTRIBS
            );
        }

        // Link program
        gl.linkProgram(program);

        // Check if program is built sucessfully
        if (gl.getProgramParameter(program, gl.LINK_STATUS))
            this.shaderProgram = program;
        else {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            this.shaderProgram = null;
        }
        
    }

    createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
        const shader = gl.createShader(type);
        if (!shader) return null;

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            return shader;
    
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    use(gl: WebGL2RenderingContext) {
        gl.useProgram(this.shaderProgram);
    }

    setVertexBufferPointer(gl: WebGL2RenderingContext, layout: number, size: number, type: number, normalize: boolean, stride: number, offset: number) {
        gl.enableVertexAttribArray(layout);
        gl.vertexAttribPointer(layout, size, type, normalize, stride, offset);
    }

    setVertexBufferPointer_Instancing(gl: WebGL2RenderingContext, layout: number, size: number, type: number, normalize: boolean, stride: number, offset: number, divisor=1) {
        gl.enableVertexAttribArray(layout);
        gl.vertexAttribPointer(layout, size, type, normalize, stride, offset);
        gl.vertexAttribDivisor(layout, divisor);
    }

    breakVertexBufferLink(gl: WebGL2RenderingContext, layout: number) {
        gl.disableVertexAttribArray(layout);
    }

    setFloat(gl: WebGL2RenderingContext, name: string, value: number) {
        const uniformLocation = gl.getUniformLocation(this.shaderProgram!, name);
        gl.uniform1f(uniformLocation, value);
    }

    setInt(gl: WebGL2RenderingContext, name: string, value: number) {
        const uniformLocation = gl.getUniformLocation(this.shaderProgram!, name);
        gl.uniform1i(uniformLocation, value);
    }

    setFloat2(gl: WebGL2RenderingContext, name: string, value1: number, value2: number) {
        const uniformLocation = gl.getUniformLocation(this.shaderProgram!, name);
        gl.uniform2f(uniformLocation, value1, value2);
    }

    setFloat3(gl: WebGL2RenderingContext, name: string, value1: number, value2: number, value3: number) {
        const uniformLocation = gl.getUniformLocation(this.shaderProgram!, name);
        gl.uniform3f(uniformLocation, value1, value2, value3);
    }

    setFloat4(gl: WebGL2RenderingContext, name: string, value1: number, value2: number, value3: number, value4: number) {
        const uniformLocation = gl.getUniformLocation(this.shaderProgram!, name);
        gl.uniform4f(uniformLocation, value1, value2, value3, value4);
    }


    setVec4(gl: WebGL2RenderingContext, name: string, vector: Array<number>) {
        const uniformLocation = gl.getUniformLocation(this.shaderProgram!, name);
        gl.uniform4fv(uniformLocation, vector);
    }

    setMat4(gl: WebGL2RenderingContext, name: string, matrix: number[] | Float32Array) {
        const uniformLocation = gl.getUniformLocation(this.shaderProgram!, name);
        gl.uniformMatrix4fv(uniformLocation, false, matrix);
    }

    setUniformBlock(gl: WebGL2RenderingContext, name: string, blockIndex: number) {
        const uniformLocation = gl.getUniformBlockIndex(this.shaderProgram!, name);
        gl.uniformBlockBinding(this.shaderProgram!, uniformLocation, blockIndex);
        // console.log(gl.getActiveUniformBlockParameter(this.shaderProgram!, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE));
    }
}