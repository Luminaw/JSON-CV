const Ajv = require('ajv');
const fs = require('fs');

// Simplified IETF JSON Resume schema (partial)
const schema = {
  type: 'object',
  properties: {
    basics: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        label: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        url: { type: 'string' },
        summary: { type: 'string' },
        location: {
          type: 'object',
          properties: {
            address: { type: 'string' },
            postalCode: { type: 'string' },
            city: { type: 'string' },
            countryCode: { type: 'string' },
            region: { type: 'string' }
          }
        },
        profiles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              network: { type: 'string' },
              username: { type: 'string' },
              url: { type: 'string' }
            }
          }
        }
      },
      required: ['name']
    },
    work: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          position: { type: 'string' },
          url: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          summary: { type: 'string' },
          highlights: { type: 'array', items: { type: 'string' } }
        },
        required: ['name', 'position']
      }
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          institution: { type: 'string' },
          url: { type: 'string' },
          area: { type: 'string' },
          studyType: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          score: { type: 'string' },
          courses: { type: 'array', items: { type: 'string' } }
        },
        required: ['institution']
      }
    },
    skills: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          level: { type: 'string' },
          keywords: { type: 'array', items: { type: 'string' } }
        },
        required: ['name']
      }
    },
    projects: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          highlights: { type: 'array', items: { type: 'string' } },
          keywords: { type: 'array', items: { type: 'string' } },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          url: { type: 'string' },
          roles: { type: 'array', items: { type: 'string' } },
          entity: { type: 'string' },
          type: { type: 'string' }
        },
        required: ['name']
      }
    }
  },
  required: ['basics']
};

const ajv = new Ajv();
const validate = ajv.compile(schema);

function validateResume(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const valid = validate(data);
    return {
      valid,
      errors: valid ? [] : validate.errors.map(err => ({
        message: `${err.instancePath} ${err.message}`
      }))
    };
  } catch (err) {
    return {
      valid: false,
      errors: [{ message: `Failed to parse JSON: ${err.message}` }]
    };
  }
}

module.exports = { validateResume };