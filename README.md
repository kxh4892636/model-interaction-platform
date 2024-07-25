# 文档

## 参数设置

## 模型详解

### 数据清单

| 数据                 | type    | style  |
| -------------------- | ------- | ------ |
| mesh31.gr3           | mesh    | raster |
|                      |         |        |
| paramhk.in           | text    | text   |
| gongkuang.dat        | text    | text   |
| sanshawan.th         | text    | text   |
| vgridhk.in           | text    | text   |
| wudaodi.dat          | text    | text   |
| wuran-gongkuang.dat  | text    | text   |
| 初始浓度.dat         | text    | text   |
| wqm_para.dat         | text    | text   |
| vgridzsh.in          | text    | text   |
| phreecqc.dat         | text    | text   |
| wuran-gongkuang1.dat | text    | text   |
| Sea Water2.pqi       | text    | text   |
| llnl.dat             | text    | text   |
|                      |         |        |
| tang_info.dat        | geojson | circle |
| in_node.dat          | geojson | circle |
| cedian.dat           | geojson | circle |
| toufang.dat          | geojson | circle |
|                      |         |        |
| uvet.dat             | geojson | uvet   |
| tcd.dat              | none    | none   |
| tnd.dat              | geojson | raster |
| PH.DAT               | geojson | raster |
| snd.dat              | snd     | raster |
| yuji.dat             | yuji    | raster |

### 模型详解

#### 水动力模型

##### exe

- water-2d.exe: 执行文件;

##### 输入

- mesh31.gr3: 格网数据, 其余模型的基础数据;
- paramhk.in: 模型参数;
  - 第 12 行第一个数字(day)表明模拟时间;
  - 第 14 行第一个数字
- gongkuang.dat: 指明模型所需文件:
- sanshawan.th: 不知道干什么的;
- vgridhk.in: 模型文件, 其余模型的基础数据;
- wudaodi: 空的, 但是要有;

##### 输出

- uvet.dat: 流场可视化;
- et/vn/vt.dat: 其余模型的基础数据;

##### mesh31.gr3

- 格网数量;
  - ne: 三角格网数量, 对应 79571;
  - np: 规则格网数量, 对应 41825;
- 格网点数据: ID + X + Y + 水深;
  ![格网点数据](images/2024-03-23-19-40-10.png)
- 三角网索引: ID + 三个顶点坐标 + 规则格网位于点位;
  ![三角网索引](images/2024-03-23-19-40-48.png)

##### uvet.dat

- 数据结构: time + (petak, uu2k, vv2k) \* np;
  - time: int32, 时间 ID;
  - (petak, uu2k, vv2k): double64, 分别为水深, u, v 向量;
  - np: 规则格网数量;

![uvet.dat](images/2024-03-23-19-42-30.png)

### 水动力模型-3d

##### 执行文件

- water-3d.exe: 执行文件;

##### 模型输入

- 必要参数;
  - inputfile 文件夹;
    - fo.gr3;
    - param.in: rnday 一行第一个数字为模拟时间 (day);
    - vgrid3d.in;
    - pollutant.dat;
    - west20080410.th;
    - south20080410.th;
  - outfile 文件夹;
  - mesh31.gr3;

##### 输出

- uvet\_\*\*\*.dat: 水动力模型;
  - 同 uvet.dat;
- snd123.dat: 水质模型,
  - time + value \* np;
  - time: id, int32;
  - value: value, double64

### 水质模型-wasp

##### 执行文件

- quality-wasp.exe: 执行文件;

##### 模型输入

- 必要参数;
  - uvet;
    - mesh31.gr3;
    - vt.dat: 水动力模型结果, 需要额外 24 小时;
    - vn.dat: 水动力模型结果, 需要额外 24 小时;
    - et.dat: 水动力模型结果, 需要额外 24 小时:
  - quality;
    - wuran-gongkuang: 模型参数, 第 10 行第一个数字(day)表明模拟时间, 12 行表明是否开启 wasp, 若开启需要 wqm_para.dat 文件
    - wqm_para.dat: wuran-gongkuang 中 12 行为 1 时需要;
    - 初始浓度: 初始浓度;
    - cedian: 测点文件, 第一行为测点数量, 其余为各测点所在 ne id;
    - tang_info: 测点文件, 养殖塘信息, 不知道具体东西;
    - toufang: 测点文件, 第一行为测点数量, 其余行为 ne id + 八种污染物浓度强度(kg/s);
    - in_node: 测点文件, 鱼塘信息;
    - vgridzsh.in

##### 模型输出

- tcd1-8: 各污染物浓度在各测点的浓度值;
- tnd1-8: 各污染物整个区域浓度, 时序数据, 时间间隔 1h;

##### tnd.dat 详解

- time + value \* ne;
- time: id, int32;
- value: value, double64

### 水质模型-phreec

##### 执行文件

- quality-phreec.exe: 执行文件;

##### 模型输入

- 必要参数;
  - uvet;
    - mesh31.gr3;
    - vt.dat: 水动力模型结果, 需要额外 24 小时;
    - vn.dat: 水动力模型结果, 需要额外 24 小时;
    - et.dat: 水动力模型结果, 需要额外 24 小时:
  - quality;
    - libmmd.dll;
    - libifcoremd.dll;
    - wuran-gongkaung1.dat: 注意这个 1, 和 quality-wasp 的不同;
    - vgridzsh.in;
    - phreeqc.dat;
    - llnl.dat;
    - Sea Water2.pqi;

##### 模型输出

- ph.dat;

### 水质模型-phreec-3d

##### 执行文件

- quality-phreec-3d.exe;

##### 模型输入

- inputfile 文件夹;
  - fo.gr3;
  - param.in: rnday 一行第一个数字为模拟时间 (day);
  - vgrid3d.in;
  - pollutant.dat;
  - west20080410.th;
  - south20080410.th;
- outfile 文件夹;

### 泥沙模型

##### 执行文件

- nishamoxing.exe: 执行- time + value \* ne;
- time: id, int32;
- value: value, double64文件;

##### 模型输入

- 必要参数;
  - water-2d;
    - mesh31.gr3;
    - vt.dat: 水动力模型结果, 需要额外 12 小时;
    - vn.dat: 水动力模型结果, 需要额外 12 小时;
    - et.dat: 水动力模型结果, 需要额外 12 小时;
    - vgridhk.in;
  - sand;
    - wuran-gongkuang: 模型参数, 第 10 行第一个数字(day)表明模拟时间, 12 行表明是否开启 wasp, 若开启需要 wqm_para.dat 文件
    - wqm_para.dat: wasp
    - vgridzsh.in

##### 模型输出

- snd.dat: 泥沙;
- yuji.dat: 淤积;

##### snd/yuji.dat 详解

- time + value \* ne;
- time: id, int32;
- value: value, double64

### 抛泥模型

##### 执行文件

- paoni.exe;

##### 模型输入

- 必要参数;
  - water-2d;
    - mesh31.gr3;
    - vt.dat: 水动力模型结果, 需要额外 12 小时;
    - vn.dat: 水动力模型结果, 需要额外 12 小时;
    - et.dat: 水动力模型结果, 需要额外 12 小时;
  - sand;
    - wuran-gongkuang: 模型参数, 第 9 行第一个数字(day)表明模拟时间
    - vgridzsh.in
    - ie_pao.dat: 抛泥点数量和位置, 第一行为数量;

##### 模型输出

- tnd1.dat: 泥沙;
- tnd2.dat: 淤积;

##### tnd.dat 详解

- time + value \* ne;
- time: id, int32;
- value: value, double64

### 耦合模型

##### 执行文件

- quality-wasp.exe: 执行文件;

##### 模型输入

- 必要参数;
  - uvet;
    - mesh31.gr3;
    - vt.dat: 水动力模型结果, 需要额外 24 小时;
    - vn.dat: 水动力模型结果, 需要额外 24 小时;
    - et.dat: 水动力模型结果, 需要额外 24 小时:
  - quality;
    - wuran-gongkuang: 模型参数, 第 7 行第一个数字(day)表明模拟时间, 8 行表示耦合时间;
    - wqm_para.dat: wuran-gongkuang 中 12 行为 1 时需要;
    - 初始浓度: 初始浓度;
    - cedian: 测点文件, 第一行为测点数量, 其余为各测点所在 ne id;
    - tang_info: 测点文件, 养殖塘信息, 不知道具体东西;
    - toufang: 测点文件, 第一行为测点数量, 其余行为 ne id + 八种污染物浓度强度(kg/s);
    - in_node: 测点文件, 鱼塘信息;
    - vgridzsh.in
  - ewe;
    - ewemodel 文件;

##### 模型输出

- tcd1-8: 各污染物浓度在各测点的浓度值;
- tnd1-8: 各污染物整个区域浓度, 时序数据, 时间间隔 1h;
- EcoSim_Couple_Result.json: ewe 模型输出文件;

## UI

## 部署

### 流场处理程序编译

##### gdal 安装

**安装命令**

```bash
git clone https://github.com/Microsoft/vcpkg.git
.\vcpkg\bootstrap-vcpkg.bat
.\vcpkg\vcpkg integrate install # 这个要多运行几次, 直到成功
.\vcpkg install gdal:x64-windows # 等待时间蛮长的
```

**注意**

- 编译出来的 exe 文件对应的 vcpkg 路径是定死的;
- 所以 vcpkg 文件夹是不能动的;
- 故安装至 project 中;

##### vs 配置

**前提条件**

- vs 2022;
- cmake;
- gdal 已经安装成功;

**步骤**

- 打开 cmake;
  - 首先 file-delete cache;
  - source code 设置为 FlowFiled_Builder 文件夹;
  - build code 设置为 FlowFiled_Builder 文件夹下的 build 文件夹;
- 点击 cmake 左下角 configure, 确认即可;
  - CMAKE_INSTALL_PREFIX 报错不用管;
- 点击 cmake 左下角 generate;
- 使用 vs 打开 build 文件夹下的 sln 文件;
- 修改 root_dir 路径, 该路径定死的, 必须和;
- 重新生成项目;
- 将 build - debug 中的所有 dll 和 exe 复制到 server 对应文件夹中;

**注意**

- root_dir 路径是定死的, 不能变;
- void buildTextures() 中的投影坐标变换要根据实际情况修改
- 压缩包我已经魔改过了, 只适用于该项目;

### 环境配置

#### postgresql

- 安装 postgresql;
- 端口设置为 5432;
- 密码设置为 123456;
- 创建 model 数据库;
  - 使用 template.sql 恢复备份;

#### conda

**安装步骤**

- 安装 miniForge;
- 安装 gdal;
  - 本地安装;
    - 解压 gis.zip 至 `c:\Users\KXH\mambaforge\envs\`;
  - 在线安装;
    - 输入下列命令;

```bash
conda create --name gis python=3.9
conda activate gis
conda install -c conda-forge gdal
```

**添加环境变量**

```bash
conda init cmd.exe
```

#### nginx

- 解压至 nginx.zip 至任意文件夹;
- 启动 nginx 服务;

#### 代码

##### 前端

- 复制 dist 文件夹;

##### 后端

- prisma;
  - 初始化 prisma;
  - 修改 .env 文件;
  ```bash
  pnpm prisma init
  pnpm db
  ```
- config: 创建并修改 config 文件夹;

## memo
