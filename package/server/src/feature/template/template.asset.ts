/* eslint-disable camelcase */
interface TemplateInterface {
  templateID: string
  templateName: string
  templateCoverImage: string
  templatePositionAndZoom: number[]
  templateFolderPath: string
  templateTag: string[]
  templateTree: Record<string, string[]>
}

export const San_Sha_Wan_Template: TemplateInterface = {
  templateID: 'c5a08bb6-5185-4dab-8da4-a041324a6287',
  templateName: '三沙湾',
  templateCoverImage: '/template/san-sha-wan/cover.png',
  templatePositionAndZoom: [119.86, 26.7, 9],
  templateFolderPath: '/template/san-sha-wan/',
  templateTag: ['三沙湾'],
  templateTree: {
    water: [
      'gongkuang.dat',
      'mesh31.gr3',
      'paramhk.in',
      'sanshawan.th',
      'vgridhk.in',
      'wudaodi.dat',
    ],
    quality: [
      'wuran-gongkuang.dat',
      'wqm_para.dat',
      '初始浓度.dat',
      'cedian.dat',
      'tang_info.dat',
      'toufang.dat',
      'in_node.dat',
      'vgridzsh.in',
    ],
    sand: ['wuran-gongkuang.dat', 'wqm_para.dat', 'vgridzsh.in'],
  },
}

export const Template_LIST: Record<string, TemplateInterface | undefined> = {
  'c5a08bb6-5185-4dab-8da4-a041324a6287': San_Sha_Wan_Template,
}
