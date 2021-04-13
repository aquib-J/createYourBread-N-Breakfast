module.exports = {
    service: {
      name: process.env.SERVICE_NAME,
      methods: ['get', 'post', 'patch', 'put', 'delete'],
    },
    tracer: {
    //   zipkinEndpoint: process.env.ZIPKIN_ENDPOINT || 'http://localhost:9411', :TODO: expand if it becomes a multi-service arch
    },
    isLocal: process.env.NODE_ENV === 'local',
    isProd: process.env.NODE_ENV === 'prod',
  };
  