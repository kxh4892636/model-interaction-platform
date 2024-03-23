import { FastifyTypebox } from '@/type/app.type'
import { generateResponse } from '@/util/app'
import { randomUUID } from 'crypto'
import { eweService } from './model.ewe.service'
import {
  ModelActionBodySchema,
  ModelActionResponseSchema,
  ModelActionResponseType,
  ModelInfoParamsSchema,
  ModelInfoResponseSchema,
  ModelInfoResponseType,
} from './model.type'
import { modelService } from './model.water.service'

export const modelRoute = async (app: FastifyTypebox) => {
  app.route({
    method: 'get',
    url: '/info/:modelID',
    schema: {
      tags: ['model'],
      params: ModelInfoParamsSchema,
      response: {
        200: ModelInfoResponseSchema,
      },
    },
    handler: async (req): Promise<ModelInfoResponseType> => {
      const params = req.params
      const result = await modelService.getModelInfo(params.modelID)
      const response = generateResponse(1, 'success', result)
      return response
    },
  })

  app.route({
    method: 'post',
    url: '/water/action',
    schema: {
      body: ModelActionBodySchema,
      response: {
        200: ModelActionResponseSchema,
      },
    },
    handler: async (req): Promise<ModelActionResponseType> => {
      const body = req.body
      const modelID = body.modelID
      const action = body.action
      const init = body.modelInit
      if (action === 'run') {
        if (!init) throw Error()
        const modelID = randomUUID()
        modelService
          .runModel(
            init.modelType,
            init.modelName,
            init.projectID,
            modelID,
            init.paramsID,
            init.hours,
            init.uvetID,
          )
          .catch(() => {
            modelService.stopModal(modelID)
          })
        const response = generateResponse(1, '', modelID)
        return response
      } else {
        if (!modelID) throw Error()
        modelService.stopModal(modelID)
        const response = generateResponse(1, '', null)
        return response
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/Import',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.Import_Model(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoPath',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoPath(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoSim',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoSim(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoSim_Switch',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoSim_Switch(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/GroupPlot_Switch',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.GroupPlot_Switch(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/FleetPlot_Switch',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.FleetPlot_Switch(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoSpace',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoSpace(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoSpace_Switch',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoSpace_Switch(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })

  app.route({
    method: 'post',
    url: '/ewe/RunEcoSpace_SwitchMap',
    schema: {},
    handler: async (req, res) => {
      try {
        res.status(200).send(await eweService.RunEcoSpace_SwitchMap(req, res))
      } catch (error) {
        if (error instanceof Error) {
          res.status(200).send({ status: 'fail', content: error.message })
        } else;
        console.log(error)
      }
    },
  })
}
