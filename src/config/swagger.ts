import swaggerJSDoc from 'swagger-jsdoc';

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'REST API Node.js / Express / TypeScript',
            version: '1.0.0',
            description: "API Docs for Products"
        }
    },
   
    apis: ['./src/router.ts'], 
}

const swaggerSpec = swaggerJSDoc(options);

import { SwaggerUiOptions } from 'swagger-ui-express'; // Asegúrate de importar esto arriba

const swaggerUiOptions : SwaggerUiOptions = {
    customCss : `
        .topbar-wrapper .link {
            content: url('https://images7.memedroid.com/images/UPLOADED906/60527a8a8ae08.jpeg');
            height: 120px;
            width: auto;
        }
        .swagger-ui .topbar {
            background-color: #2b3b45;
        }
    `,
    customSiteTitle: 'Documentación REST API Express / TypeScript'
}

export default swaggerSpec;
export {
    swaggerUiOptions
}