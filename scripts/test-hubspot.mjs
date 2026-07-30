import { pushLeadToHubspot } from '../src/lib/nova/crm/pushLeadToHubspot.js';

const lead = {
  full_name: 'Test Lead',
  email: 'test-lead@example.com',
  phone: '+10000000000',
  project_description: 'Wants a fast marketing site with WhatsApp lead capture.',
  budget: '$2,000–5,000',
  timeline: '2–4 weeks',
  source: 'contact_form',
  metadata: { businessType: 'clinic' },
};

console.log(await pushLeadToHubspot(lead));
