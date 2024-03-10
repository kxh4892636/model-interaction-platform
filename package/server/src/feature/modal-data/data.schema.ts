export const dataSchema = {
  tags: ['data'],
  params: {
    type: 'object',
    properties: {
      dataID: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'image binary',
      type: 'object',
    },
  },
}

export const dataDetailSchema = {
  tags: ['data'],
  params: {
    type: 'object',
    properties: {
      dataID: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'integer' },
        data: {
          type: 'object',
        },
        message: { type: 'string' },
      },
    },
  },
}

export const dataActionSchema = {
  tags: ['data'],
  body: {
    type: 'object',
    required: ['dataName'],
    properties: {
      action: { type: 'string', enum: ['rename', 'delete'] },
      dataName: { type: 'string' },
    },
  },
  response: {
    200: {
      description:
        'Description and all status-code based properties are working',
      content: {
        'image/png': {
          schema: {},
        },
      },
    },
  },
}
