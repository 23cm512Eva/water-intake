// In-memory storage (resets on each cold start)
let waterRecords = [];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Return all records
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      records: waterRecords,
      total: waterRecords.length
    });
  }

  // POST: Add new record
  if (req.method === 'POST') {
    const { count, date } = req.body;

    // Validate required fields
    if (!count || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: count and date are required'
      });
    }

    // Validate count is a number
    if (typeof count !== 'number' || count <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Count must be a positive number'
      });
    }

    // Create new record
    const newRecord = {
      id: Date.now(),
      count,
      date,
      timestamp: new Date().toISOString()
    };

    waterRecords.push(newRecord);

    return res.status(201).json({
      success: true,
      message: 'Water intake record added successfully',
      record: newRecord
    });
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}
