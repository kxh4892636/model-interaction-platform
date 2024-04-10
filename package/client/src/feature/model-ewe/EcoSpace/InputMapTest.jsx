import React,{useEffect,useState} from 'react'
function Map(props){
  return(<h1>{props.data}</h1>)
}
export default function InputMap() {
  useEffect(()=>{
    // // 获取Canvas元素
    // var canvas = document.getElementById('gridCanvas');
    // var ctx = canvas.getContext('2d');

    // // 假设这是您的栅格图像数据
    // // var gridData = [
    // //     [0.2, 0.5, 0.8],
    // //     [0.3, 0.6, 0.9],
    // //     [0.4, 0.7, 1.0]
    // //     // 可以根据实际情况传入更多的数据
    // // ];
    // var gridData = [[1.098765,1.304527,1.699588,2.148148,2.226337,1.958848,1.58642,1.62963,2.080247,2.512346,2.483539,1.993827,1.432099,1.100823,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[1.201646,1.447188,1.899863,2.347051,2.382716,2.075446,1.783265,2.026063,2.740741,3.281207,3.141289,2.373114,1.576132,1.140432,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[1.487654,1.802469,2.347051,2.777778,2.733882,2.368999,2.223594,2.772291,3.853224,4.459534,4.072702,2.848423,1.734568,1.179012,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[1.917695,2.297668,2.9369,3.381344,3.323731,3.002743,3.07133,3.894376,5.139917,5.562414,4.76406,3.103567,1.875772,1.225926,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[2.384773,2.784636,3.460906,3.91358,3.924554,3.743484,4.016461,4.86214,5.864197,5.801783,4.626886,2.831275,1.785714,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[2.631687,3.020576,3.713306,4.198903,4.355281,4.377229,4.857339,5.645491,6.225823,5.615594,4.132165,2.413286,1.627866,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[2.479424,2.831275,3.504801,4.006858,4.289437,4.429013,4.972154,5.588456,5.994284,4.96121,3.544485,2.16695,1.454145,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[2.014403,2.318244,2.934157,3.419753,3.729767,3.863511,4.337817,4.84988,5.277999,0.0,3.168899,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[1.669753,1.992456,2.633745,3.153635,3.399765,3.338998,3.464974,3.812915,4.177946,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[1.874486,2.400548,3.36214,4.122085,4.267098,3.833476,3.409708,3.276309,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[2.792181,3.824417,5.633745,7.061728,7.214678,6.290819,5.153571,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[3.998971,5.648149,8.477367,10.66255,10.80031,9.251195,7.785912,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[4.87037,6.942387,10.43484,13.09328,13.2478,11.39201,9.119277,7.275065,0.0,0.0,0.0,1.59542,1.30805,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.228909,1.148534,1.100823,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[5.329732,7.378944,10.73457,13.14541,13.1603,11.40191,9.019638,7.262032,5.866055,4.434146,2.906052,1.861268,1.444626,0.0,0.0,0.0,0.0,1.334877,1.331276,1.334877,0.0,0.0,0.0,1.491852,1.656878,1.625386,1.506516,1.403292,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[5.368827,7.014059,9.645405,11.46776,11.54938,10.54492,9.096135,7.618545,6.120113,4.514397,3.073745,2.118814,0.0,0.0,0.0,0.0,0.0,1.648148,1.641975,1.648148,0.0,0.0,1.4875,1.737125,2.09904,2.228052,2.130658,1.907407,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[5.523663,6.690672,8.551441,9.79561,9.956104,9.543724,8.719037,7.565819,5.95537,4.247721,2.792937,2.114596,0.0,0.0,0.0,0.0,0.0,2.225088,2.223314,2.264204,0.0,0.0,0.0,2.036389,2.599708,2.769547,2.607682,2.279835,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[4.95216,5.707476,6.999315,7.987655,8.426612,8.451303,7.924555,6.820302,5.17524,3.554998,2.303764,1.777148,0.0,0.0,0.0,0.0,0.0,2.283045,2.436718,2.583073,0.0,0.0,2.194828,2.347415,2.782836,2.901235,2.675926,2.137377,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[4.04321,4.591221,5.639232,6.563786,7.116598,7.112483,6.497942,5.367627,4.057613,2.904321,2.122068,1.711358,0.0,0.0,0.0,0.0,1.939826,2.194376,2.463173,2.709263,2.813718,2.654679,2.545647,2.529223,2.772891,2.698217,2.391975,1.819279,1.36489,1.043651,0.0,0.0,0.0,0.0,0.0],[2.63323,3.060014,3.95679,4.875171,5.524005,5.577503,5.149519,4.384088,3.732853,3.077375,2.625974,0.0,0.0,0.0,0.0,2.208644,2.180895,2.205847,2.482657,2.810973,3.031516,3.066955,3.012001,2.898454,2.831276,2.552812,2.156035,1.614981,1.272101,1.073016,0.0,0.0,0.0,0.0,0.0],[1.907922,2.340535,3.236625,4.168724,4.772291,4.754458,4.4417,4.050755,4.03155,3.740483,3.437693,2.677065,0.0,0.0,0.0,3.200666,3.010032,2.857296,3.003135,3.217421,3.466,3.548844,3.561924,3.398393,3.120027,2.626886,2.08642,1.563002,1.279415,0.0,0.0,0.0,0.0,0.0,0.0],[1.588477,2.034293,2.931413,3.869684,4.440329,4.412894,4.229081,4.152263,4.567558,4.474837,3.919024,2.797295,2.317885,2.671076,3.936083,4.299782,4.221598,3.815501,3.746228,3.754458,3.919067,3.951989,3.935528,3.710562,3.301783,2.722908,2.201646,1.812659,1.663433,0.0,0.0,0.0,0.0,0.0,0.0],[1.596708,2.056241,2.980796,3.946502,4.517147,4.462277,4.281207,4.286694,4.86214,4.855967,4.272891,2.920255,2.508047,2.994709,4.461456,5.265297,5.430299,4.806585,4.432099,4.198902,4.231824,4.21262,4.138546,3.886145,3.48011,3.049383,2.827161,2.79561,2.845679,0.0,0.0,0.0,0.0,0.0,0.0],[1.481482,1.91358,2.82716,3.814815,4.462277,4.473251,4.366255,4.421125,5.05487,5.096022,4.561042,3.312757,2.99177,3.630316,5.196158,6.092592,6.145405,5.28738,4.632373,4.294924,4.319616,4.303155,4.14952,3.883402,3.665295,3.71605,4.203018,4.866941,5.283951,0.0,0.0,0.0,0.0,0.0,0.0],[1.329218,1.713306,2.580247,3.556927,4.275721,4.39369,4.429355,4.596708,5.29904,5.370371,4.88203,3.776406,3.611797,4.437586,5.949245,6.692729,6.360769,5.23594,4.407407,4.16598,4.333333,4.374485,4.174212,3.97668,4.122085,4.763203,5.944469,7.245566,7.991034,0.0,0.0,0.0,0.0,0.0,0.0],[1.218107,1.559671,2.377229,3.370371,4.190672,4.495199,4.725652,5.052126,5.768176,5.773662,5.178327,4.113855,4.028807,4.969821,6.253772,6.679012,5.919067,4.750343,4.091906,4.237311,4.670782,4.731138,4.390946,4.078189,4.312757,5.168063,6.50565,8.197815,9.529762,0.0,0.0,0.0,0.0,0.0,0.0],[1.139918,1.430727,2.163237,3.161866,4.080933,4.640604,5.109739,5.641975,6.292181,6.14952,5.318244,4.245542,4.171468,5.167353,6.171468,6.347051,5.397806,4.533608,4.300412,4.887517,5.474623,5.485597,4.989027,4.462277,4.410151,4.780448,5.716207,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[1.219136,1.504115,2.192044,3.241427,4.266118,5.083677,5.674897,6.193416,6.500686,6.09465,5.052126,4.072702,4.028807,5.079561,5.935528,6.144033,5.37037,5.019205,5.142661,5.853223,6.248285,6.141289,5.621742,4.962277,4.378258,3.889183,3.283888,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[1.619341,2.004115,2.7476,3.759945,4.581619,5.233196,5.587106,5.864198,5.857339,5.400548,4.451303,3.746227,3.798354,4.942387,5.891633,6.440329,6.045267,5.982168,5.938272,6.209877,6.144033,6.03635,5.788065,5.350094,4.514214,3.380018,2.48909,1.852381,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[2.816358,3.489369,4.552126,5.555555,5.8738,5.79561,5.386831,5.060357,4.75583,4.434842,3.855967,3.491084,3.620027,4.75583,5.842249,6.6869,6.510974,6.299383,5.731824,5.367283,4.898491,4.85048,4.978009,4.982596,4.491444,3.37783,2.142928,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[4.850823,5.944444,7.615912,8.717421,8.38683,7.078189,5.474623,4.325103,3.861454,3.79561,3.636488,3.441701,3.444444,4.226337,5.137175,5.943073,5.842207,5.411479,4.494471,3.766804,3.22771,3.321331,3.698037,4.145004,4.176143,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[7.362654,8.857681,11.20233,12.50343,11.67627,9.205761,6.451303,4.469135,3.762689,3.737997,3.776406,3.576132,3.331962,3.521262,3.908093,4.307613,4.135759,3.935137,3.320492,2.788066,2.296296,2.429527,2.875759,3.393195,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[8.965535,10.66289,13.41907,14.86557,13.80658,10.66255,7.257888,4.803841,3.914952,3.792867,3.847736,3.595336,3.142661,2.758573,2.539094,2.494513,2.34495,2.345183,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[8.779836,10.46091,13.1845,14.56584,13.40878,10.25377,6.947874,4.645405,3.762689,3.556927,3.598079,3.414266,2.967078,2.333333,1.776406,1.47428,1.37037,1.350617,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[7.167181,8.69513,11.119,12.34396,11.2284,8.480109,5.70096,3.900892,3.20919,3.041152,3.124828,3.067215,2.73251,2.083676,1.45679,1.102881,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[6.013889,7.450617,9.669238,10.78344,9.677983,7.211934,4.800412,3.363683,2.828189,2.720165,2.845679,2.874486,2.627572,2.032922,1.438272,1.096708,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]]
    // // 定义每个单元格的宽度和高度
    // var cellWidth = canvas.width / gridData[0].length;
    // var cellHeight = canvas.height / gridData.length;

    // // 遍历栅格图像数据，绘制矩形代表不同数值
    // for (var i = 0; i < gridData.length; i++) {
    //     for (var j = 0; j < gridData[i].length; j++) {
    //         var value = gridData[i][j];
    //         ctx.fillStyle = 'rgba(0, 0, 255, ' + value + ')'; // 以蓝色作为颜色，透明度根据数值大小变化
    //         ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
    //     }
    // }
    const canvas = document.getElementById('gridCanvas');
    const ctx = canvas.getContext('2d');
    let x = 50;
    let y = 50;
    let vx = 5;
    let vy = 1;
    
    function draw() {
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      // 更新小球位置
      x += vx;
      y += vy;
    
      // 边界检测
      if (x + 10 > canvas.width || x - 10 < 0) {
        vx = -vx;
      }
      if (y + 10 > canvas.height || y - 10 < 0) {
        vy = -vy;
      }
    
      // 绘制小球
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.closePath();
    
      // 循环动画
      requestAnimationFrame(draw);
    }
    
    draw();
    
  })
  const [content, setContent] = useState('初始状态')
  return (
    <div>
      <canvas id="gridCanvas" width="400" height="400"></canvas>
      <div onClick={()=>{
            content==='初始状态' ? setContent('新的状态') : setContent('初始状态')
        }}
        style={{background:"red",height:"50px",width:"50px"}}>
        </div>
      <Map data={content}></Map>
    </div>
  )
}