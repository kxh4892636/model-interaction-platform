import { Map } from 'mapbox-gl'
import { CustomLayer } from './cusLayer'
import { FlowFieldManager } from './flowfield'

class FlowLayer extends CustomLayer {
  private map: mapboxgl.Map | null = null
  private ready = false

  constructor(
    id: string,
    renderingMode: '2d' | '3d',
    public ffManager: FlowFieldManager,
  ) {
    super(id, renderingMode)
  }

  async onAdd(map: Map, gl: WebGL2RenderingContext) {
    console.log('Custom flow field layer is being added...')
    this.map = map
    this.ready = await this.ffManager.Prepare(gl)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null)
    gl.bindVertexArray(null)
  }

  render(gl: WebGL2RenderingContext, u_matrix: number[]) {
    if (this.ready === false) {
      console.log('manager not ready !')
      this.map?.triggerRepaint()
      return
    }
    console.log('finish')
    // console.log(u_matrix)
    this.ffManager.zoomRate = this.map!.getZoom() / this.map!.getMaxZoom()
    if (this.ffManager.zoomRate <= 0.3) {
      this.ffManager.zoomRate = 10.0 / (3.0 * this.ffManager.zoomRate)
      // console.log("wuhu1!")
    } else if (this.ffManager.zoomRate <= 0.7) {
      this.ffManager.zoomRate = 1.0
      // console.log("wuhu2!")
    } else {
      this.ffManager.zoomRate =
        -10.0 / (3.0 * this.ffManager.zoomRate) + 10.0 / 3.0
      // console.log("wuhu3!")
    }
    this.ffManager.u_matrix = u_matrix
    this.ffManager?.tickLogicCount()
    this.ffManager?.tickRender(gl)
    this.map?.triggerRepaint()
  }
}

export { FlowLayer }
