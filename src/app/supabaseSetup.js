import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://rjldwtpgxgmswclltjmp.supabase.co'
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqbGR3dHBneGdtc3djbGx0am1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NzMxMzQsImV4cCI6MjA0NjQ0OTEzNH0.ZbD9nqPOnAn5K0qIN33zFbO4HmOt43cd49-fU2zXDTM'
const supabase = createClient(supabaseUrl, supabaseKey)


module.exports = {supabase}