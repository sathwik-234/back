import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.APP_SUPABASE_URL
const supabaseKey = process.env.APP_SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = {supabase}