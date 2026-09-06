module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://kupcvxpbfclpysnvpycc.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_l6otQISH0oiB-KB7diUZmg_RVYU2GtI';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    const { password, data } = body || {};

    if (password && password !== expectedPassword) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Incorrect password' });
    }

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid data payload' });
    }

    // Upsert into portfolio table in Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/portfolio`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify({
        id: 'main',
        data: data,
        updated_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(200).json({ success: false, error: `Supabase Error (${response.status}): ${errText}` });
    }

    return res.status(200).json({ success: true, message: 'Portfolio data updated in Supabase cloud database!' });
  } catch (error) {
    console.error('Error saving portfolio data to Supabase:', error);
    return res.status(200).json({ success: false, error: error.message });
  }
};
