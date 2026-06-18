const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CRBS API',
    version: '1.0.0',
    description: 'Campus Resource Booking System - Backend API documentation',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}/api`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object', nullable: true },
          errors: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          userID: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: {
            type: 'string',
            enum: ['Student', 'FacultyStaff', 'ResourceManager', 'Admin'],
          },
          department: { type: 'string', nullable: true },
          campusId: { type: 'string', nullable: true },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              user: {
                $ref: '#/components/schemas/User',
              },
              token: { type: 'string' },
            },
          },
          errors: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john@mmu.edu.my' },
          password: { type: 'string', format: 'password', example: 'Password123' },
          role: {
            type: 'string',
            enum: ['Student', 'FacultyStaff', 'ResourceManager', 'Admin'],
            example: 'Student',
          },
          department: { type: 'string', example: 'Faculty of Computing' },
          campusId: { type: 'string', example: 'S12345678' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@mmu.edu.my' },
          password: { type: 'string', format: 'password', example: 'Admin123!' },
        },
      },
      UpdateProfileInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'John Updated' },
          email: { type: 'string', format: 'email', example: 'john.updated@mmu.edu.my' },
          department: { type: 'string', example: 'Faculty of Engineering' },
          campusId: { type: 'string', example: 'S12345678' },
        },
      },
      AdminUpdateUserInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: {
            type: 'string',
            enum: ['Student', 'FacultyStaff', 'ResourceManager', 'Admin'],
          },
          department: { type: 'string' },
          userId: { type: 'string' },
          isActive: { type: 'boolean' },
        },
      },
      Booking: {
        type: 'object',
        properties: {
          bookingID: { type: 'integer' },
          userID: { type: 'integer' },
          resourceID: { type: 'integer' },
          startDateTime: { type: 'string', format: 'date-time' },
          endDateTime: { type: 'string', format: 'date-time' },
          status: {
            type: 'string',
            enum: ['Pending', 'Confirmed', 'Cancelled', 'Rejected', 'Completed'],
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      BookingApproval: {
        type: 'object',
        properties: {
          approvalID: { type: 'integer' },
          bookingID: { type: 'integer' },
          approvedBy: { type: 'integer' },
          approvalStatus: {
            type: 'string',
            enum: ['Approved', 'Rejected', 'Pending'],
          },
          remarks: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
    {
      name: 'Users',
      description: 'User profile endpoints',
    },
    {
      name: 'Admin',
      description: 'Admin user management endpoints',
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse',
                },
              },
            },
          },
          409: {
            description: 'Email already registered',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and revoke token',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Logout successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse',
                },
              },
            },
          },
          401: {
            description: 'Missing or invalid token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse',
                },
              },
            },
          },
        },
      },
    },
    '/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Profile retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      $ref: '#/components/schemas/User',
                    },
                    errors: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update current user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateProfileInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      $ref: '#/components/schemas/User',
                    },
                    errors: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error',
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List all users (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Users list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                    errors: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          403: {
            description: 'Insufficient permissions',
          },
        },
      },
    },
    '/admin/users/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get user by ID (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'User details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      $ref: '#/components/schemas/User',
                    },
                    errors: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'User not found',
          },
        },
      },
      put: {
        tags: ['Admin'],
        summary: 'Update user (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AdminUpdateUserInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User updated',
          },
          400: {
            description: 'Validation error',
          },
          404: {
            description: 'User not found',
          },
        },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Disable user account (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'User disabled',
          },
          404: {
            description: 'User not found',
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});

module.exports = swaggerSpec;
