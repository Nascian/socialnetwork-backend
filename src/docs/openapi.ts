// Lightweight OpenAPI 3.0 spec describing current API. Keep it simple and static.
export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Social Network API',
    version: '1.0.0',
    description: 'API de backend para autenticación, publicaciones, likes y perfil.',
  },
  servers: [{ url: 'http://localhost:4001' }],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Profile' },
    { name: 'Posts' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      ApiError: {
        type: 'object',
        properties: { message: { type: 'string' } },
        required: ['message'],
      },
      AuthLoginRequest: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
        required: ['password'],
      },
      AuthLoginResponse: {
        type: 'object',
        properties: { token: { type: 'string' } },
        required: ['token'],
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          username: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          birthDate: { type: 'string', format: 'date-time' },
          alias: { type: 'string' },
        },
        required: ['id', 'email', 'username', 'firstName', 'lastName', 'birthDate', 'alias'],
      },
      ProfileStats: {
        type: 'object',
        properties: {
          posts: { type: 'integer', minimum: 0 },
          likesGiven: { type: 'integer', minimum: 0 },
          likesReceived: { type: 'integer', minimum: 0 },
        },
        required: ['posts', 'likesGiven', 'likesReceived'],
      },
      PostItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          message: { type: 'string', maxLength: 280 },
          userId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              alias: { type: 'string' },
            },
            required: ['id', 'firstName', 'lastName', 'alias'],
          },
          likeCount: { type: 'integer', minimum: 0 },
          likedByMe: { type: 'boolean' },
        },
        required: ['id', 'message', 'userId', 'createdAt', 'user', 'likeCount', 'likedByMe'],
      },
      PostsPage: {
        type: 'object',
        properties: {
          items: { type: 'array', items: { $ref: '#/components/schemas/PostItem' } },
          total: { type: 'integer', minimum: 0 },
          page: { type: 'integer', minimum: 1 },
          pageSize: { type: 'integer', minimum: 1 },
          totalPages: { type: 'integer', minimum: 1 },
          hasNextPage: { type: 'boolean' },
          hasPrevPage: { type: 'boolean' },
        },
        required: ['items', 'total', 'page', 'pageSize', 'totalPages', 'hasNextPage', 'hasPrevPage'],
      },
      CreatePostRequest: {
        type: 'object',
        properties: { message: { type: 'string', maxLength: 280 } },
        required: ['message'],
      },
      LikeResponse: {
        type: 'object',
        properties: { likeCount: { type: 'integer', minimum: 0 }, likedByMe: { type: 'boolean' } },
        required: ['likeCount', 'likedByMe'],
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'OK',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, timestamp: { type: 'string', format: 'date-time' } } } } },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login con username/email y password',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthLoginRequest' } } },
        },
        responses: {
          200: { description: 'Token emitido', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthLoginResponse' } } } },
          400: { description: 'Solicitud inválida', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
          401: { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
    },
    '/me': {
      get: {
        tags: ['Profile'],
        summary: 'Perfil del usuario actual',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Perfil', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } } },
          401: { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
    },
    '/me/stats': {
      get: {
        tags: ['Profile'],
        summary: 'Estadísticas del usuario actual',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Estadísticas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ProfileStats' } } } },
          401: { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
    },
    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Listar publicaciones con paginación',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 }, required: false },
          { name: 'pageSize', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50 }, required: false },
        ],
        responses: {
          200: { description: 'Página de publicaciones', content: { 'application/json': { schema: { $ref: '#/components/schemas/PostsPage' } } } },
          401: { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
      post: {
        tags: ['Posts'],
        summary: 'Crear publicación',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePostRequest' } } } },
        responses: {
          201: { description: 'Creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/PostItem' } } } },
          400: { description: 'Validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
          401: { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
    },
    '/posts/{id}/like': {
      post: {
        tags: ['Posts'],
        summary: 'Dar like a una publicación (idempotente)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          201: { description: 'Like creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/LikeResponse' } } } },
          200: { description: 'Ya existía el like', content: { 'application/json': { schema: { $ref: '#/components/schemas/LikeResponse' } } } },
          401: { description: 'No autorizado' },
          404: { description: 'No encontrado' },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Quitar like de una publicación (idempotente)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/LikeResponse' } } } },
          401: { description: 'No autorizado' },
          404: { description: 'No encontrado' },
        },
      },
    },
  },
} as const;
