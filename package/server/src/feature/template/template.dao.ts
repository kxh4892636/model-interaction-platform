/* eslint-disable camelcase */
import { Template_LIST } from './template.asset'

export const templateDao = {
  getAllTemplate: async () => {
    const result = Object.values(Template_LIST)
    return result
  },

  getTemplateByTemplateID: async (templateID: string) => {
    const result = Template_LIST[templateID]
    return result || null
  },
}
