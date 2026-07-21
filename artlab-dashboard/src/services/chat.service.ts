import type { ChatRequest, ChatResponse } from '@/types/chat'
import { apiPost } from './api'

const MOCK_RESPONSES = [
  {
    reply: 'Interesante concepto. Podríamos explorar variaciones en la iluminación para darle más profundidad. Sugiero probar con iluminación volumétrica para destacar la figura principal.',
    reasoning: 'El usuario busca mejorar una composición visual. Analizando el prompt, veo que describe una escena con potencial pero falta énfasis en la fuente de luz. La iluminación volumétrica añadiría capas de profundidad sin saturar la escena.',
  },
  {
    reply: 'He analizado la referencia. Sugiero ajustar el contraste en las sombras para un acabado más cinematográfico. También podríamos añadir un ligero grano para textura.',
    reasoning: 'La imagen de referencia tiene buen encuadre pero las sombras están aplastadas. Un ajuste de curvas en las zonas oscuras combined con grano cinematográfico daría un look más profesional.',
  },
  {
    reply: 'Buena composición. ¿Has considerado añadir elementos de foreground para dar capas a la escena? Un desenfoque de fondo ayudaría a centrar la atención.',
    reasoning: 'La composición actual tiene tres planos pero el foreground está vacío. Añadir un elemento en primer plano con desenfoque crearía profundidad y guiaría la mirada del espectador.',
  },
  {
    reply: 'El prompt tiene potencial. Podríamos iterar sobre la paleta de colores para alinearla mejor con el mood. Te sugiero una paleta azul-naranja para contraste complementario.',
    reasoning: 'Analizando la escena descrita, los tonos fríos dominan pero faltan puntos de contraste cálido. La paleta azul-naranja es la más efectiva para retratos con iluminación mixta.',
  },
  {
    reply: 'Entendido. Voy a preparar algunas variaciones con diferentes configuraciones de sampling. Recomiendo DPM++ 2M Karras para este estilo.',
    reasoning: 'El estilo solicitado (render realista) funciona mejor con samplers de alta calidad. DPM++ 2M Karras ofrece el mejor balance entre detalle y velocidad para SDXL.',
  },
]

function mockDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 800 + Math.random() * 1200))
}

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  await mockDelay()

  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    const pick = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
    const contextIntro = request.context
      ? `[Contexto cargado: ${request.context.slice(0, 80)}...]\n\n`
      : ''
    const imageIntro = request.image
      ? '[Imagen adjunta recibida]\n\n'
      : ''

    return {
      reply: imageIntro + contextIntro + pick.reply,
      reasoning: pick.reasoning,
      images: request.image
        ? [request.image]
        : Math.random() > 0.7
          ? ['https://picsum.photos/seed/chat-gen/400/300']
          : undefined,
      messageId: `mock-${Date.now()}`,
    }
  }

  return apiPost<ChatResponse>('/chat', request)
}
