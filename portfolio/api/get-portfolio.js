module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://kupcvxpbfclpysnvpycc.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_l6otQISH0oiB-KB7diUZmg_RVYU2GtI';

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/portfolio?id=eq.main&select=data`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Supabase returned status ${response.status}: ${errText}`);
      return res.status(200).json({ success: false, data: {}, note: errText });
    }

    const rows = await response.json();
    const portfolioData = rows && rows.length > 0 ? rows[0].data : {};
    return res.status(200).json({ success: true, data: portfolioData });
  } catch (error) {
    console.error('Error fetching portfolio data from Supabase:', error);
    return res.status(200).json({ success: false, data: {}, error: error.message });
  }
};
