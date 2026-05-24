import OpenAI from 'openai'

let openai = null

function getClient() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openai
}

const FALLBACK_ANALYSIS = {
  priority: 'Moyenne',
  category: 'Non classifié',
  summary: 'Analyse automatique indisponible. Veuillez traiter manuellement.',
  recommendedStatus: 'En cours',
  suggestedResponse: 'Bonjour, nous avons bien reçu votre demande et nous la traitons dans les plus brefs délais.',
  nextAction: 'Examiner la demande manuellement et contacter le client.',
}

export async function analyzeRequest(request) {
  try {
    const prompt = `Tu es un assistant IA pour PARTAPEX CONSULTING, une entreprise de conseil.
Analyse cette demande client et retourne UNIQUEMENT un objet JSON valide (sans markdown, sans texte supplémentaire).

Demande client :
- Type : ${request.requestType}
- Objet : ${request.subject}
- Message : ${request.message}
- Date souhaitée : ${request.preferredDate}
- Créneau : ${request.timeSlot}
- Statut actuel : ${request.status}
- Client : ${request.clientName}
- Email : ${request.email}

Retourne ce JSON exact :
{
  "priority": "Faible" ou "Moyenne" ou "Haute",
  "category": "catégorie de la demande",
  "summary": "résumé court en 1-2 phrases",
  "recommendedStatus": "Nouvelle" ou "En cours" ou "Terminée" ou "Refusée",
  "suggestedResponse": "réponse professionnelle suggérée en français pour l'admin à envoyer au client",
  "nextAction": "prochaine action recommandée pour l'admin"
}

Règles :
- priority basée sur l'urgence et l'importance
- recommendedStatus basé sur le contenu de la demande
- suggestedResponse doit être professionnelle et personnalisée
- nextAction doit être concrète et actionnable
- Tout en français`

    const completion = await getClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    })

    const content = completion.choices[0].message.content.trim()

    // Parse JSON from response (handle potential markdown wrapping)
    let jsonStr = content
    if (content.startsWith('```')) {
      jsonStr = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    }

    const analysis = JSON.parse(jsonStr)

    // Validate required fields
    const validStatuses = ['Nouvelle', 'En cours', 'Terminée', 'Refusée']
    const validPriorities = ['Faible', 'Moyenne', 'Haute']

    if (!validStatuses.includes(analysis.recommendedStatus)) {
      analysis.recommendedStatus = 'En cours'
    }
    if (!validPriorities.includes(analysis.priority)) {
      analysis.priority = 'Moyenne'
    }

    return {
      priority: analysis.priority,
      category: analysis.category || 'Non classifié',
      summary: analysis.summary || 'Résumé non disponible.',
      recommendedStatus: analysis.recommendedStatus,
      suggestedResponse: analysis.suggestedResponse || FALLBACK_ANALYSIS.suggestedResponse,
      nextAction: analysis.nextAction || FALLBACK_ANALYSIS.nextAction,
      analyzedAt: new Date(),
    }
  } catch (error) {
    console.error('❌ AI Analysis Error:', error.message)
    return {
      ...FALLBACK_ANALYSIS,
      analyzedAt: new Date(),
    }
  }
}
