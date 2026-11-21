insert into public.terms (id, jargon, translation, analogy, category) values
  ('09ebee1a-2953-49e7-b4cb-452c5232d231', 'Automatic renewal', 'An agreement continues for another period when the current one ends unless it is cancelled as described in the agreement.', 'A club membership that renews each month until you turn off renewal.', 'Contracts'),
  ('b8db2f72-484b-4e79-8a50-4eb2849b40bf', 'Force majeure', 'A contract clause that explains what happens when an extraordinary event makes it difficult or impossible to do what was agreed.', 'An outdoor event has a written backup plan for a severe storm.', 'Contracts'),
  ('8209f77a-8b5f-40ee-9844-0e734928b0ea', 'Data retention period', 'How long an organization says it keeps a particular kind of information.', 'A shop sets a time limit for keeping old receipts.', 'Privacy'),
  ('80fc2739-d76f-406e-bf14-169425ebe5b9', 'Data controller', 'The person or organization that decides why and how personal information is processed.', 'A club decides what information to request on its member form and how to use it.', 'Privacy'),
  ('4f164efe-3007-40fd-861d-9338a08b8e86', 'Probationary period', 'An initial period of employment when the employer and the employee evaluate how the role is working out.', 'A scheduled trial period at the start of a new role.', 'Employment'),
  ('505798ef-178a-425a-bd2e-314142e9d3da', 'Security deposit', 'Money held to cover certain costs that may arise during a rental. The agreement and local rules determine when it can be used or returned.', 'Leaving a deposit when borrowing equipment.', 'Housing'),
  ('615f3948-df79-438a-aee6-e64baa3a45d0', 'Notice period', 'The amount of advance warning an agreement or rule calls for before a change takes effect.', 'Telling a roommate ahead of time when you plan to move out.', 'Housing')
on conflict (id) do nothing;

insert into public.professionals (id, name, specialty, is_demo) values
  ('c7d74313-d5aa-4b74-aabb-9556a251daaa', 'Maya Reed', 'Contracts', true),
  ('ca858c3a-48e9-45db-8707-1e681131ea63', 'Alex Rowan', 'Data privacy', true),
  ('575ea2ed-a4df-4e00-ae60-08e231857fb6', 'Sam Ellis', 'Employment', true)
on conflict (id) do nothing;
