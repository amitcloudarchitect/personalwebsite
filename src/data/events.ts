import type { EventItem } from '@/types'

/**
 * Do not add events that have not happened. Placeholder cards show the entry format only.
 * Supported types: conference talk, customer workshop, architecture session,
 * technical webinar, internal technology session, panel, training.
 */
export const events: EventItem[] = [
  {
    id: 'placeholder-conference',
    event: 'Placeholder: conference',
    topic: 'Placeholder topic',
    role: 'Speaker',
    type: 'Conference talk',
    location: 'Location to be added',
    description:
      'Template for a conference talk. Replace this record or delete it. It is not a real engagement.',
    placeholder: true,
  },
  {
    id: 'placeholder-workshop',
    event: 'Placeholder: customer workshop',
    topic: 'Placeholder topic',
    role: 'Facilitator',
    type: 'Customer workshop',
    location: 'Location to be added',
    description:
      'Template for a customer workshop or architecture session. Replace this record or delete it.',
    placeholder: true,
  },
  {
    id: 'placeholder-webinar',
    event: 'Placeholder: webinar',
    topic: 'Placeholder topic',
    role: 'Presenter',
    type: 'Technical webinar',
    location: 'Online',
    description: 'Template for a webinar, panel, internal session, or training. Replace or delete it.',
    placeholder: true,
  },
]
