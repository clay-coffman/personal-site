import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Create policy for public read access
    const { error: readError } = await supabase.rpc('create_policy', {
      table_name: 'books',
      policy_name: 'Enable read access for all users',
      definition: 'FOR SELECT TO public USING (true)'
    });

    if (readError) throw readError;

    // Create policy for authenticated write access
    const { error: writeError } = await supabase.rpc('create_policy', {
      table_name: 'books',
      policy_name: 'Enable write access for authenticated users only',
      definition: 'FOR ALL TO authenticated USING (true) WITH CHECK (true)'
    });

    if (writeError) throw writeError;

    res.status(200).json({ message: 'Policies created successfully' });
  } catch (error) {
    console.error('Error creating policies:', error);
    res.status(500).json({ error: error.message });
  }
}
