const pairs = [
  { 
    term: 'Perxia-QA', 
    definition: 'Agente de IA para automatización de pruebas que genera casos de prueba automáticos y se integra con Azure DevOps' 
  },
  { 
    term: 'Perxia-Dev', 
    definition: 'Extensión de VS Code que funciona como copilot corporativo entrenado con conocimiento interno de la empresa' 
  },
  { 
    term: 'Perxia-Assist', 
    definition: 'Agente de IA para gestión de conocimiento a partir de reuniones que permite hacer preguntas sobre sesiones' 
  },
  { 
    term: 'Perxia-agentic', 
    definition: 'Frontend de interacción multi-agente que integra distintos agentes en un flujo conversacional unificado' 
  },
  { 
    term: 'Perxia-Hada', 
    definition: 'Agente de IA especializado en automatización de procesos internos de Periferia' 
  },
  { 
    term: 'Perxia-Bot', 
    definition: 'Agente de IA corporativo de Periferia, un ChatGPT empresarial para la página web' 
  },
  { 
    term: 'Perxia-Eval', 
    definition: 'Agente orientado a evaluación y control de calidad de código para hackatones y desarrollos internos' 
  },
  { 
    term: 'Perxia-Cloud', 
    definition: 'Agente de automatización de infraestructura que usa plantillas para desplegar infraestructuras multi-cloud' 
  },
  { 
    term: 'Perxia-Unit', 
    definition: 'Agente de IA especializado en pruebas unitarias que detecta y genera pruebas con cobertura mínima del 85%' 
  },
];

// Preguntas que se muestran al acertar un match
const questions = [
  { q: '¿Qué agente se especializa en automatización de pruebas?', a: 'Perxia-QA' },
  { q: '¿Cuál es el copilot corporativo de VS Code?', a: 'Perxia-Dev' },
  { q: '¿Qué agente gestiona conocimiento de reuniones?', a: 'Perxia-Assist' },
  { q: '¿Cuál es el frontend multi-agente?', a: 'Perxia-agentic' },
  { q: '¿Qué agente automatiza procesos internos?', a: 'Perxia-Hada' },
  { q: '¿Cuál es el ChatGPT empresarial de Periferia?', a: 'Perxia-Bot' },
  { q: '¿Qué agente evalúa calidad de código?', a: 'Perxia-Eval' },
  { q: '¿Cuál automatiza infraestructura multi-cloud?', a: 'Perxia-Cloud' },
  { q: '¿Qué agente genera pruebas unitarias?', a: 'Perxia-Unit' },
];

module.exports = { pairs, questions };
