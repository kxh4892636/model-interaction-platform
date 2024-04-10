import styled from 'styled-components'

const SingleArrow = styled.div`
  width: 70px;
  height: 10px;
  position: relative;
  background-color: black;
  margin-top: 50px;
  margin-right: 30px;
  margin-left: 10px;
`

const ArrowHead = styled.div`
  content: '';
  display: block;
  position: absolute;
  right: -20px;
  top: -5px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 20px solid black;
`

const Arrow = () => {
  return (
    <SingleArrow>
      <ArrowHead />
    </SingleArrow>
  )
}

export default function EWEModel() {
  return (
    <div>
      <div
        style={{
          marginTop: '10px',
          padding: '10px',
          width: '340px',
          border: '1px solid #bfbfbf',
          borderRadius: '4px',
          color: '#595959',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            paddingLeft: '0px',
            paddingBottom: '4px',
          }}
        >
          生态模块数据解释
        </div>
        <ol style={{ paddingLeft: '10px' }}>
          <li>各功能组的生物量</li>
          <li>生产量/生物量（P/B）</li>
          <li>消耗量/生物量（Q/B）</li>
          <li>各功能组食物构成矩阵</li>
          <li>捕捞数据</li>
        </ol>
      </div>
      <div
        style={{
          marginTop: '10px',
          padding: '10px',
          width: '540px',
          border: '1px solid #bfbfbf',
          borderRadius: '4px',
          color: '#595959',
        }}
      >
        <div style={{ fontSize: '16px' }}>
          模型耦合（营养盐改变初级生产，从而对生态系统产生影响）
        </div>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              width: '150px',
              border: '1px solid #bfbfbf',
              borderRadius: '4px',
              color: '#595959',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                paddingLeft: '0px',
                paddingBottom: '4px',
              }}
            >
              水质模型
            </div>
            <ul style={{ paddingLeft: '10px' }}>
              <li>营养盐数据</li>
              <li>total nutrient.CSV</li>
            </ul>
          </div>
          <Arrow></Arrow>
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              width: '150px',
              border: '1px solid #bfbfbf',
              borderRadius: '4px',
              color: '#595959',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                paddingLeft: '0px',
                paddingBottom: '4px',
              }}
            >
              生态模块
            </div>
            <ul style={{ paddingLeft: '10px' }}>
              <li>影响初级生产</li>
              <li>forcing function</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
